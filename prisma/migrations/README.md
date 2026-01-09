# 数据库迁移说明

## 方式一：使用 Prisma Migrate（推荐）

```bash
# 1. 设置环境变量
export DATABASE_URL="postgresql://neondb_owner:npg_61xfcbrWCvHw@ep-late-bush-a469rl9o-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

# 2. 创建迁移
npx prisma migrate dev --name init

# 3. 生成 Prisma Client
npx prisma generate
```

## 方式二：直接执行 SQL（快速）

如果你已经连接到数据库，可以直接执行 `init.sql`：

```bash
# 使用 psql 连接并执行
psql "postgresql://neondb_owner:npg_61xfcbrWCvHw@ep-late-bush-a469rl9o-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" -f prisma/migrations/init.sql
```

或者在 Neon 控制台的 SQL Editor 中直接粘贴执行 `init.sql` 的内容。

## 验证表结构

执行后，应该能看到以下表：

- `wind_messages` - 风里的话
- `sessions` - 匿名会话
- `session_views` - 会话查看记录

## 测试连接

```bash
npx prisma db pull
```

如果成功，说明连接正常。
