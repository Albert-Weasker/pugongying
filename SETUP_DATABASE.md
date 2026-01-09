# 数据库快速设置指南

## 1. 创建 .env.local 文件

在项目根目录创建 `.env.local` 文件：

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_61xfcbrWCvHw@ep-late-bush-a469rl9o-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

# For Prisma migrations (without connection pooling)
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_61xfcbrWCvHw@ep-late-bush-a469rl9o.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

## 2. 安装依赖

```bash
npm install
```

## 3. 初始化数据库

### 方式 A：使用 Prisma Migrate（推荐）

```bash
# 使用非池化连接进行迁移
DATABASE_URL="postgresql://neondb_owner:npg_61xfcbrWCvHw@ep-late-bush-a469rl9o.us-east-1.aws.neon.tech/neondb?sslmode=require" npx prisma migrate dev --name init

# 生成 Prisma Client
npx prisma generate
```

### 方式 B：直接在 Neon 控制台执行 SQL

1. 打开 Neon 控制台：https://console.neon.tech
2. 进入你的项目
3. 打开 SQL Editor
4. 复制 `prisma/migrations/init.sql` 的内容
5. 粘贴并执行

## 4. 验证设置

```bash
# 拉取数据库结构验证连接
npx prisma db pull

# 打开 Prisma Studio 查看数据
npx prisma studio
```

## 5. 测试 API

启动开发服务器：

```bash
npm run dev
```

测试 API：

```bash
# 测试添加消息
curl -X POST http://localhost:3000/api/wind/add \
  -H "Content-Type: application/json" \
  -d '{"content": "测试消息", "type": "ORIGIN"}'

# 测试获取随机消息（需要 sessionId）
curl http://localhost:3000/api/wind/random \
  -H "x-session-id: test-session-123"
```

## 数据库表结构

执行后，应该能看到以下表：

- ✅ `wind_messages` - 风里的话（核心表）
- ✅ `sessions` - 匿名会话
- ✅ `session_views` - 会话查看记录

## 常见问题

### Q: 迁移失败怎么办？

A: 确保使用 `DATABASE_URL_UNPOOLED`（非池化连接）进行迁移，因为 Prisma Migrate 需要直接连接。

### Q: 如何重置数据库？

A: 在 Neon 控制台的 SQL Editor 中执行：

```sql
DROP TABLE IF EXISTS "session_views" CASCADE;
DROP TABLE IF EXISTS "wind_messages" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TYPE IF EXISTS "MessageType" CASCADE;
```

然后重新执行 `init.sql`。

### Q: 如何查看数据？

A: 使用 Prisma Studio：

```bash
npx prisma studio
```

会在浏览器打开 http://localhost:5555
