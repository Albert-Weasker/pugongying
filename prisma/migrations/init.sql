-- 蒲公英 (Pugongying) 数据库初始化脚本
-- 一次性消息系统：每一句话只存在一次，被看见就是它的结束

-- 1. 创建枚举类型
CREATE TYPE "MessageType" AS ENUM ('ORIGIN', 'REPLY');

-- 2. 创建 wind_messages 表（风里的话）
CREATE TABLE "wind_messages" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "content" TEXT NOT NULL,
  "type" "MessageType" NOT NULL DEFAULT 'ORIGIN',
  "is_visible" BOOLEAN NOT NULL DEFAULT true,
  "consumed_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 创建索引
CREATE INDEX "wind_messages_is_visible_idx" ON "wind_messages"("is_visible");
CREATE INDEX "wind_messages_consumed_at_idx" ON "wind_messages"("consumed_at");
CREATE INDEX "wind_messages_created_at_idx" ON "wind_messages"("created_at" DESC);

-- 3. 创建 sessions 表（匿名会话）
CREATE TABLE "sessions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "last_activity" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. 创建 session_views 表（会话查看记录）
CREATE TABLE "session_views" (
  "session_id" UUID NOT NULL,
  "message_id" UUID NOT NULL,
  "viewed_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("session_id", "message_id"),
  FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE,
  FOREIGN KEY ("message_id") REFERENCES "wind_messages"("id") ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX "session_views_session_id_idx" ON "session_views"("session_id");
CREATE INDEX "session_views_message_id_idx" ON "session_views"("message_id");
CREATE INDEX "session_views_viewed_at_idx" ON "session_views"("viewed_at");

-- 5. 添加注释（可选，帮助理解）
COMMENT ON TABLE "wind_messages" IS '风里的话：每一句话只存在一次，被看见就是它的结束';
COMMENT ON COLUMN "wind_messages"."is_visible" IS '是否仍在风中（可被任何人看见）';
COMMENT ON COLUMN "wind_messages"."consumed_at" IS '被风消耗的时间（第一次被看到）';
COMMENT ON COLUMN "wind_messages"."type" IS 'ORIGIN = 用户最初写的，REPLY = 给世界一个拥抱写的';

COMMENT ON TABLE "sessions" IS '匿名会话：不需要用户表，只需要知道当前是谁';
COMMENT ON TABLE "session_views" IS '会话查看记录：防止同一人重复看到同一条';
