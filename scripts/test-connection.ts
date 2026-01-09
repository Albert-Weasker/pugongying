/**
 * 测试数据库连接
 */

import { prisma } from '../lib/db/prisma'

async function testConnection() {
  try {
    console.log('正在测试数据库连接...')
    
    // 尝试执行一个简单的查询
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ 数据库连接成功！')
    console.log('测试结果:', result)
    
    // 检查表是否存在
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `
    
    console.log('\n当前数据库中的表:')
    if (tables.length === 0) {
      console.log('  (无表)')
    } else {
      tables.forEach((table: { tablename: string }) => {
        console.log(`  - ${table.tablename}`)
      })
    }
    
  } catch (error: any) {
    console.error('❌ 数据库连接失败:')
    console.error('错误信息:', error.message)
    console.error('\n可能的原因:')
    console.error('1. 数据库服务器不可用')
    console.error('2. 网络连接问题')
    console.error('3. DATABASE_URL 配置错误')
    console.error('4. 需要 VPN 或特殊网络配置')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
