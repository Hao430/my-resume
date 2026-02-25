#!/usr/bin/env node

/**
 * 简历数据同步脚本
 * 从 resume-data.json 读取数据，同步到 src/data/resume.ts
 *
 * 使用方法：
 *   node scripts/sync-resume.js
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const JSON_FILE = resolve(process.cwd(), 'resume-data.json')
const TS_FILE = resolve(process.cwd(), 'src/data/resume.ts')

console.log('📄 开始同步简历数据...')

try {
  // 读取 JSON 数据
  const jsonData = readFileSync(JSON_FILE, 'utf-8')
  const resumeData = JSON.parse(jsonData)

  // 生成 TypeScript 文件内容
  const tsContent = `import type { ResumeData } from '../types/resume'

export const resumeData: ResumeData = ${JSON.stringify(resumeData, null, 2)}
`

  // 写入 TypeScript 文件
  writeFileSync(TS_FILE, tsContent, 'utf-8')

  console.log('✅ 数据同步成功！')
  console.log(`   源文件: ${JSON_FILE}`)
  console.log(`   目标文件: ${TS_FILE}`)
  console.log('\n💡 提示：现在只需编辑 resume-data.json 文件，网页会自动同步')
} catch (error) {
  console.error('❌ 同步失败:', error.message)
  process.exit(1)
}