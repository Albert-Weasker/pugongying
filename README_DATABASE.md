# 蒲公英数据库设计

## 核心原则

> **在蒲公英里，每一句话只存在一次。被看见，就是它的结束。**

这不是留言板、不是社区、不是匿名倾诉，而是**一次性存在系统（ephemeral human messages）**。

---

## 数据库表结构

### 1. `wind_messages` - 风里的话（核心表）

每一句话只要被"某一个人看见"，就从风中消失（对所有人）。

```sql
CREATE TABLE wind_messages (
  id UUID PRIMARY KEY,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('ORIGIN', 'REPLY')) NOT NULL DEFAULT 'ORIGIN',
  is_visible BOOLEAN DEFAULT TRUE,
  consumed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**字段说明：**
- `type`: `ORIGIN` = 用户最初写的，`REPLY` = "给世界一个拥抱"写的
- `is_visible`: 是否仍在风中（可被任何人看见）
- `consumed_at`: 被"风消耗"的时间（第一次被看到）

**这不是软删除，是"被风带走"的自然生命周期结束。**

---

### 2. `sessions` - 匿名会话

不需要用户表，只需要知道"当前是谁"。

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW()
);
```

- session id 存在 cookie / sessionStorage
- 不绑定身份
- 只用于防止同一人重复看到同一条

---

### 3. `session_views` - 会话查看记录

页面监控当前用户看到的话。

```sql
CREATE TABLE session_views (
  session_id UUID,
  message_id UUID,
  viewed_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (session_id, message_id),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (message_id) REFERENCES wind_messages(id) ON DELETE CASCADE
);
```

**这个表解决了 3 件事：**
1. 当前用户不会再看到这句话
2. 页面可以知道「我现在看的是哪一句」
3. 防止刷新刷到同一句（即使并发）

---

## 核心流程

### 1. 从风池取一句话（最关键）

```sql
SELECT *
FROM wind_messages
WHERE is_visible = true
AND id NOT IN (
  SELECT message_id
  FROM session_views
  WHERE session_id = :sessionId
)
ORDER BY RANDOM()
LIMIT 1;
```

⚠️ **注意：**
- 不是按时间
- 不是最新
- 完全随机 = 像风

---

### 2. 展示给某个 session 的瞬间（原子操作）

**一旦展示，就立刻"消耗"**

必须在事务里做：

```sql
BEGIN;

-- 1. 记录当前用户看到了这句话
INSERT INTO session_views (session_id, message_id)
VALUES (:sessionId, :messageId)
ON CONFLICT DO NOTHING;

-- 2. 标记这句话已被风带走（对所有人）
UPDATE wind_messages
SET is_visible = false,
    consumed_at = NOW()
WHERE id = :messageId
AND is_visible = true;  -- 并发安全

COMMIT;
```

**关键点：**
- 不等用户点不点
- 不等停留多久
- **只要被展示，就消失**

---

### 3. 将一句话放入风池

```sql
INSERT INTO wind_messages (
  id,
  content,
  type,
  is_visible
)
VALUES (
  gen_random_uuid(),
  :content,
  :type,
  true
);
```

无论是 `ORIGIN` 还是 `REPLY`，都完全同权。风不会记得它来自哪里。

---

## 并发安全

保证同一条 message 不会被两个 session 同时 consume：

```sql
UPDATE wind_messages
SET is_visible = false,
    consumed_at = NOW()
WHERE id = :messageId
AND is_visible = true;
```

检查 affected rows：
- `=1` → 成功
- `=0` → 被别人先"吹走"了 → 再取一条

---

## API 接口

### GET `/api/wind/random`
从风池取一句话（并消耗）

**Headers:**
- `x-session-id`: 会话 ID

**Response:**
```json
{
  "message": {
    "id": "uuid",
    "content": "今天什么都没发生，但我还是很累。",
    "type": "ORIGIN"
  }
}
```

---

### POST `/api/wind/add`
将一句话放入风池

**Body:**
```json
{
  "content": "写下一句话。",
  "type": "ORIGIN" | "REPLY"
}
```

**Response:**
```json
{
  "id": "uuid",
  "message": "Carried away by the wind"
}
```

---

### GET `/api/wind/stats`
获取风池统计（用于"世界还在转"页面）

**Response:**
```json
{
  "total": 1000,
  "visible": 500,
  "consumed": 500
}
```

---

## 使用 Prisma

```bash
# 安装依赖
npm install @prisma/client
npm install -D prisma

# 初始化数据库
npx prisma migrate dev --name init

# 生成 Prisma Client
npx prisma generate
```

---

## 环境变量

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pugongying"
```

---

## 设计原则

> **在蒲公英里，每一句话只存在一次。被看见，就是它的结束。**

- ✅ 一次性消息队列（human-consumed）
- ✅ 不是 feed、不是广场、不是可重复展示内容
- ✅ 被看见 = 对所有人消失
- ✅ 不绑定身份，只跟踪会话
