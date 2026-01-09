import { NextResponse } from 'next/server'
import { getRandomWindMessage, getOrCreateSession } from '@/lib/db/windPool'

export const dynamic = 'force-dynamic'

/**
 * 从风池取一句话
 * 一旦展示，就立刻"消耗"（对所有人消失）
 */
export async function GET(request: Request) {
  try {
    // 从请求头获取 sessionId
    const sessionId = request.headers.get('x-session-id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required', message: null },
        { status: 400 }
      )
    }

    // 确保 session 存在
    await getOrCreateSession(sessionId)

    // 获取随机消息（并消耗）
    const message = await getRandomWindMessage(sessionId)

    if (!message) {
      return NextResponse.json({ message: null })
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error fetching wind message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
