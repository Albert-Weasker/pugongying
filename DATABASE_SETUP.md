# 数据库设置指南

## 方法一：使用 Prisma db push（推荐）

这是最简单的方法，会根据 `prisma/schema.prisma` 自动创建表。

### 步骤：

1. **确保 `.env.local` 文件存在并包含数据库连接信息**：
   ```bash
   DATABASE_URL=postgresql://neondb_owner:npg_61xfcbrWCvHw@ep-late-bush-a469rl9o-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

2. **生成 Prisma Client**：
   ```bash
   npm run db:generate
   ```

3. **创建数据库表**：
   ```bash
   npm run db:push
   ```

   这会自动：
   - 根据 schema.prisma 创建所有表
   - 创建索引
   - 创建枚举类型

## 方法二：直接在 Neon 控制台执行 SQL（推荐，如果方法一失败）

如果 `npm run db:push` 遇到连接问题，最简单的方法是在 Neon 控制台直接执行 SQL：

### 步骤：

1. **登录 Neon 控制台**
   - 访问 https://console.neon.tech
   - 登录你的账户

2. **选择你的数据库项目**
   - 找到 `neondb` 项目

3. **打开 SQL Editor**
   - 点击左侧菜单的 "SQL Editor"

4. **执行 SQL 脚本**
   - 打开项目中的 `prisma/migrations/init.sql` 文件
   - 复制全部内容
   - 粘贴到 SQL Editor 中
   - 点击 "Run" 执行

5. **验证表是否创建成功**
   - 在 SQL Editor 中运行：
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';
   ```
   - 应该看到：`wind_messages`, `sessions`, `session_views`

### 方法三：使用脚本（如果连接正常）

如果数据库连接正常，可以使用脚本：

```bash
npm run db:setup
```

### 测试数据库连接

```bash
npm run db:test
```

## 验证表是否创建成功

运行以下命令检查表是否存在：

```bash
npm run db:studio
```

这会打开 Prisma Studio，你可以在浏览器中查看所有表和数据。

## 导入初始数据

表创建成功后，运行：

```bash
npm run import:messages
```

这会导入 52 条初始消息到数据库。

## 常见问题

### 问题：`MODULE_NOT_FOUND: .prisma/client`

**解决方案**：
```bash
npm run db:generate
rm -rf .next
npm run dev
```

### 问题：`DATABASE_URL` 未设置

**解决方案**：
1. 创建 `.env.local` 文件
2. 添加 `DATABASE_URL` 环境变量

### 问题：表已存在错误

**解决方案**：
- 如果表已存在，可以跳过创建
- 或者先删除旧表（谨慎操作）
