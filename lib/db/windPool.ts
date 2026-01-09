/**
 * 风池服务
 * 
 * 核心原则：
 * - 每一句话只存在一次
 * - 被看见，就是它的结束
 * - 不是对这个人消失，是对整个世界消失
 */

import { MessageType } from '@prisma/client'
import { prisma } from './prisma'

/**
 * 从风池取一句话（随机）
 * 一旦展示给某个 session，就立刻"消耗"
 */
export async function getRandomWindMessage(sessionId: string) {
  // 1. 使用原生 SQL 查询获取真正的随机消息（排除已看过的）
  const result = await prisma.$queryRaw<Array<{
    id: string
    content: string
    type: string
    is_visible: boolean
    consumed_at: Date | null
    created_at: Date
  }>>`
    SELECT wm.*
    FROM wind_messages wm
    WHERE wm.is_visible = true
    AND wm.id NOT IN (
      SELECT sv.message_id
      FROM session_views sv
      WHERE sv.session_id = ${sessionId}
    )
    ORDER BY RANDOM()
    LIMIT 1
  `

  if (!result || result.length === 0) {
    return null
  }

  const msg = result[0]

  // 2. 原子操作：记录查看 + 标记为已消耗
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 标记这句话已被风带走（对所有人）- 并发安全
      const updateResult = await tx.windMessage.updateMany({
        where: {
          id: msg.id,
          isVisible: true, // 只有当前可见的才能被消耗
        },
        data: {
          isVisible: false,
          consumedAt: new Date(),
        },
      })

      // 如果被别人先消耗了，返回 null
      if (updateResult.count === 0) {
        return null
      }

      // 记录当前用户看到了这句话
      await tx.sessionView.upsert({
        where: {
          sessionId_messageId: {
            sessionId,
            messageId: msg.id,
          },
        },
        create: {
          sessionId,
          messageId: msg.id,
        },
        update: {},
      })

      return {
        id: msg.id,
        content: msg.content,
        type: msg.type as MessageType,
      }
    })

    return result
  } catch (error) {
    console.error('Error consuming wind message:', error)
    // 如果事务失败，返回 null，让前端再取一条
    return null
  }
}

/**
 * 将一句话放入风池
 * 无论是 origin 还是 reply，都完全同权
 */
export async function addToWindPool(content: string, type: MessageType = MessageType.ORIGIN) {
  return await prisma.windMessage.create({
    data: {
      content,
      type,
      isVisible: true,
    },
  })
}

/**
 * 创建或获取会话
 */
export async function getOrCreateSession(sessionId: string) {
  return await prisma.session.upsert({
    where: { id: sessionId },
    create: { id: sessionId },
    update: { lastActivity: new Date() },
  })
}

/**
 * 获取当前 session 已看过的消息数量
 */
export async function getSessionViewCount(sessionId: string): Promise<number> {
  return await prisma.sessionView.count({
    where: { sessionId },
  })
}

/**
 * 获取风池统计
 */
export async function getWindPoolStats() {
  const [total, visible, consumed] = await Promise.all([
    prisma.windMessage.count(),
    prisma.windMessage.count({ where: { isVisible: true } }),
    prisma.windMessage.count({ where: { isVisible: false } }),
  ])

  return {
    total,
    visible,
    consumed,
  }
}
