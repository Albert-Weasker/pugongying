# 创建环境变量文件

## 快速设置

在项目根目录创建 `.env.local` 文件，内容如下：

```bash
DATABASE_URL=postgresql://neondb_owner:npg_61xfcbrWCvHw@ep-late-bush-a469rl9o-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 创建方法

### 方法一：使用命令行（推荐）

```bash
cat > .env.local << 'EOF'
DATABASE_URL=postgresql://neondb_owner:npg_61xfcbrWCvHw@ep-late-bush-a469rl9o-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
EOF
```

### 方法二：手动创建

1. 在项目根目录创建文件 `.env.local`
2. 复制以下内容到文件中：

```
DATABASE_URL=postgresql://neondb_owner:npg_61xfcbrWCvHw@ep-late-bush-a469rl9o-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 验证

创建后，运行：

```bash
npm run db:push
```

应该可以正常工作了。
