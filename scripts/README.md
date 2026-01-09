# 导入消息脚本使用说明

## 前置条件

1. 确保已创建 `.env.local` 文件，并配置了 `DATABASE_URL`
2. 确保数据库表已创建（运行过 `npm run db:push` 或执行过 SQL 脚本）

## 运行导入脚本

```bash
npm run import:messages
```

或者直接使用 tsx：

```bash
npx tsx scripts/import-messages.ts
```

## 脚本功能

- 从 `scripts/import-messages.ts` 中的消息列表批量导入到数据库
- 所有消息标记为 `ORIGIN` 类型（原始消息）
- 自动跳过空消息
- 显示导入进度和统计信息

## 注意事项

- 脚本会向数据库写入数据，请确保数据库连接正常
- 如果消息已存在，可能会创建重复记录（根据业务需求决定是否需要去重）
