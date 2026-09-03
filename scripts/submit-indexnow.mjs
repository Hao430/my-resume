#!/usr/bin/env node
/**
 * 向 IndexNow 提交站点 URL（Bing / Yandex / Naver / Seznam 免账号即时收录）
 *
 *   npm run build && node scripts/submit-indexnow.mjs
 *
 * 前置条件：站点根目录已经能通过 https://hao430.cn/<key>.txt 访问到 key 文件
 * （key 文件就是 public/ 下那个 32 位十六进制文件名，随构建产物一起发布）
 *
 * Google 不吃 IndexNow，必须走 Search Console，见 docs/seo-submission.md
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const HOST = 'hao430.cn'
const ROOT = path.resolve(import.meta.dirname, '..')
const ENDPOINTS = ['api.indexnow.org', 'www.bing.com', 'yandex.com', 'searchadvisor.naver.com', 'indexnow.yep.com']

async function findKey() {
  const files = await fs.readdir(path.join(ROOT, 'public'))
  const keyFile = files.find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
  if (!keyFile) throw new Error('public/ 下找不到 IndexNow key 文件（32 位十六进制 .txt）')
  return keyFile.replace(/\.txt$/, '')
}

async function readSitemap() {
  const file = path.join(ROOT, 'dist', 'sitemap.xml')
  const xml = await fs.readFile(file, 'utf-8')
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter(Boolean)
}

const key = await findKey()
const urls = await readSitemap()
const payload = { host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList: urls }

console.log(`· key: ${key}`)
console.log(`· URLs: ${urls.length} 条（来自 dist/sitemap.xml）`)

let anyOk = false
for (const endpoint of ENDPOINTS) {
  try {
    const res = await fetch(`https://${endpoint}/indexnow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })
    const ok = res.status === 200 || res.status === 202
    anyOk = anyOk || ok
    console.log(`${ok ? '✔' : '·'} ${endpoint.padEnd(28)} HTTP ${res.status}`)
  } catch (error) {
    console.log(`✖ ${endpoint.padEnd(28)} ${error instanceof Error ? error.message : error}`)
  }
}

if (!anyOk) {
  console.error('\n全部端点失败。常见原因：key 文件还没部署到站点根目录（先 push 等 ESA 构建完再跑）。')
  process.exit(1)
}
console.log('\n已提交。Bing 通常在数分钟内开始抓取；再用 curl -sI https://hao430.cn/<key>.txt 确认 key 文件可访问。')
