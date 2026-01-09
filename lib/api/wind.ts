/**
 * 风池 API 客户端
 */

import { getSessionId } from '@/lib/anonymousSession'

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || ''

/**
 * 从风池获取随机消息（并消耗）
 */
export async function getRandomWindMessage(): Promise<{ id: string; content: string; type: string } | null> {
  try {
    const sessionId = getSessionId()
    if (!sessionId) {
      return null
    }

    const response = await fetch(`${API_BASE}/api/wind/random`, {
      method: 'GET',
      headers: {
        'x-session-id': sessionId,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch wind message')
    }

    const data = await response.json()
    return data.message || null
  } catch (error) {
    console.error('Error fetching wind message:', error)
    return null
  }
}

/**
 * 将一句话放入风池
 */
export async function addToWindPool(content: string, type: 'ORIGIN' | 'REPLY' = 'ORIGIN'): Promise<{ id: string } | null> {
  try {
    const response = await fetch(`${API_BASE}/api/wind/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, type }),
    })

    if (!response.ok) {
      throw new Error('Failed to add to wind pool')
    }

    const data = await response.json()
    return { id: data.id }
  } catch (error) {
    console.error('Error adding to wind pool:', error)
    return null
  }
}

/**
 * 获取风池统计
 */
export async function getWindPoolStats(): Promise<{ total: number; visible: number; consumed: number } | null> {
  try {
    const response = await fetch(`${API_BASE}/api/wind/stats`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch stats')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching stats:', error)
    return null
  }
}
