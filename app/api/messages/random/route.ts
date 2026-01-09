import { NextResponse } from 'next/server'

// 模拟数据 - 后续替换为数据库查询
const sampleMessages = [
  '今天什么都没发生，但我还是很累。',
  '有时候觉得，安静比热闹更让人安心。',
  '想说的话很多，但不知道从哪里开始。',
  '今天天气很好，但心情一般。',
  '有些话，说出来就好了，不需要回应。',
  'I had a quiet day today.',
  'Sometimes silence is the best response.',
  'Just needed to write this down.',
  'Today was ordinary, and that\'s okay.',
  'Some thoughts are better left floating.',
]

export const dynamic = 'force-dynamic' // 确保每次请求都重新生成
export const revalidate = 300 // 5分钟重新验证

export async function GET() {
  try {
    // 随机选择一条消息
    const randomIndex = Math.floor(Math.random() * sampleMessages.length)
    const message = sampleMessages[randomIndex]

    // 如果没有消息，返回null
    if (!message) {
      return NextResponse.json({ message: null })
    }

    return NextResponse.json({ 
      message,
      // 不返回任何元数据（时间、ID等）
    })
  } catch (error) {
    console.error('Error fetching random message:', error)
    return NextResponse.json({ message: null }, { status: 500 })
  }
}
