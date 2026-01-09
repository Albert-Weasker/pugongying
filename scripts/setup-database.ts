/**
 * 数据库表创建脚本
 * 直接执行 SQL 创建表结构
 */

import fs from 'fs'
import path from 'path'
import { prisma } from '../lib/db/prisma'

async function setupDatabase() {
  try {
    console.log('开始创建数据库表...')

    // 读取 SQL 文件
    const sqlPath = path.resolve(process.cwd(), 'prisma/migrations/init.sql')
    const sql = fs.readFileSync(sqlPath, 'utf-8')

    // 分割 SQL 语句（按分号分割，但要注意字符串中的分号）
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`准备执行 ${statements.length} 条 SQL 语句...`)

    // 执行每条 SQL 语句
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          await prisma.$executeRawUnsafe(statement)
          console.log(`✓ 已执行第 ${i + 1}/${statements.length} 条语句`)
        } catch (error: any) {
          // 如果表已存在，跳过错误
          if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
            console.log(`⚠ 第 ${i + 1} 条语句：表或对象已存在，跳过`)
          } else {
            console.error(`✗ 第 ${i + 1} 条语句执行失败:`, error.message)
            throw error
          }
        }
      }
    }

    console.log('\n✅ 数据库表创建完成！')

    // 验证表是否创建成功
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('wind_messages', 'sessions', 'session_views')
      ORDER BY tablename
    `

    console.log('\n已创建的表:')
    tables.forEach((table: { tablename: string }) => {
      console.log(`  - ${table.tablename}`)
    })

    if (tables.length === 3) {
      console.log('\n✅ 所有表都已成功创建！')
    } else {
      console.log(`\n⚠️  警告：期望 3 个表，实际创建了 ${tables.length} 个`)
    }

  } catch (error) {
    console.error('❌ 创建数据库表时发生错误:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()
  .catch((error) => {
    console.error('执行失败:', error)
    process.exit(1)
  })
