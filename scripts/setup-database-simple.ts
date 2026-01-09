/**
 * 简化的数据库表创建脚本
 * 直接执行 SQL 创建表结构
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function setupDatabase() {
  try {
    console.log('开始创建数据库表...\n')

    // 读取 SQL 文件
    const sqlPath = path.join(process.cwd(), 'prisma/migrations/init.sql')
    console.log(`读取 SQL 文件: ${sqlPath}`)
    const sql = fs.readFileSync(sqlPath, 'utf-8')

    // 按行分割，过滤注释和空行
    const lines = sql.split('\n')
    let currentStatement = ''
    const statements: string[] = []

    for (const line of lines) {
      const trimmed = line.trim()
      // 跳过注释和空行
      if (!trimmed || trimmed.startsWith('--')) {
        continue
      }
      
      currentStatement += line + '\n'
      
      // 如果行以分号结尾，说明是一个完整的语句
      if (trimmed.endsWith(';')) {
        statements.push(currentStatement.trim())
        currentStatement = ''
      }
    }

    console.log(`准备执行 ${statements.length} 条 SQL 语句...\n`)

    // 执行每条 SQL 语句
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement) {
        try {
          await prisma.$executeRawUnsafe(statement)
          console.log(`✓ [${i + 1}/${statements.length}] 执行成功`)
        } catch (error: any) {
          // 如果表已存在，跳过错误
          const errorMsg = error.message || ''
          if (
            errorMsg.includes('already exists') ||
            errorMsg.includes('duplicate') ||
            errorMsg.includes('relation') && errorMsg.includes('already exists')
          ) {
            console.log(`⚠ [${i + 1}/${statements.length}] 已存在，跳过`)
          } else {
            console.error(`✗ [${i + 1}/${statements.length}] 执行失败:`)
            console.error(`  ${errorMsg}`)
            // 对于非"已存在"的错误，继续执行其他语句
          }
        }
      }
    }

    console.log('\n✅ SQL 语句执行完成！\n')

    // 验证表是否创建成功
    try {
      const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('wind_messages', 'sessions', 'session_views')
        ORDER BY tablename
      `

      console.log('已创建的表:')
      if (tables.length === 0) {
        console.log('  (无)')
      } else {
        tables.forEach(table => {
          console.log(`  ✓ ${table.tablename}`)
        })
      }

      if (tables.length === 3) {
        console.log('\n✅ 所有表都已成功创建！')
      } else if (tables.length > 0) {
        console.log(`\n⚠️  警告：期望 3 个表，实际找到 ${tables.length} 个`)
      }
    } catch (error: any) {
      console.log('\n⚠️  无法验证表（可能权限问题）:', error.message)
    }

  } catch (error: any) {
    console.error('\n❌ 创建数据库表时发生错误:')
    console.error(error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()
  .catch((error) => {
    console.error('\n执行失败:', error)
    process.exit(1)
  })
