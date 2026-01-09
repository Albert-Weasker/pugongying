import { NextResponse } from 'next/server'
import { getWindPoolStats } from '@/lib/db/windPool'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // 1分钟重新验证

/**
 * 获取风池统计
 * 用于"世界还在转"页面
 */
export async function GET() {
  try {
    const stats = await getWindPoolStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching wind pool stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
