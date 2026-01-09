import { NextResponse } from 'next/server'
import { addToWindPool } from '@/lib/db/windPool'
import { MessageType } from '@prisma/client'

export const dynamic = 'force-dynamic'

/**
 * 将一句话放入风池
 * 无论是 origin 还是 reply，都完全同权
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, type = 'ORIGIN' } = body

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // 限制长度
    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Content too long (max 500 characters)' },
        { status: 400 }
      )
    }

    const message = await addToWindPool(
      content.trim(),
      type === 'REPLY' ? MessageType.REPLY : MessageType.ORIGIN
    )

    return NextResponse.json({ 
      id: message.id,
      message: 'Carried away by the wind'
    })
  } catch (error) {
    console.error('Error adding to wind pool:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
