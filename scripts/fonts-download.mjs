#!/usr/bin/env node
/**
 * 字体自托管下载脚本
 * 从 Google Fonts css2 API 抓取 woff2 分片，写入 public/fonts/ 并生成 fonts.css。
 * 产物必须随仓库提交（ESA 构建容器无外网依赖）。
 *
 * 用法：node scripts/fonts-download.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('public/fonts')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

// family -> css2 请求片段（每项一个请求，得到一组 @font-face）
const REQUESTS = [
  'family=Noto+Serif+SC:wght@400;600;700',
  'family=Source+Serif+4:opsz,wght@8..60,200..900',
  'family=JetBrains+Mono:wght@400;500',
]

function parseBlocks(css) {
  const blocks = []
  const re = /@font-face\s*\{([^}]+)\}/g
  let m
  while ((m = re.exec(css)) !== null) blocks.push(m[1])
  return blocks
}

function prop(body, name) {
  const m = body.match(new RegExp(`${name}:\\s*([^;]+);`))
  return m ? m[1].trim() : ''
}

function slugify(s) {
  return s.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase()
}

async function fetchBody(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

async function download(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (!buf.length) throw new Error(`empty body for ${url}`)
  return buf
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const cssBlocks = []
  let totalBytes = 0
  let fileCount = 0

  for (const req of REQUESTS) {
    const url = `https://fonts.googleapis.com/css2?${req}&display=swap`
    const css = await fetchBody(url)
    const blocks = parseBlocks(css)
    console.log(`${req} -> ${blocks.length} @font-face`)

    for (let i = 0; i < blocks.length; i++) {
      const body = blocks[i]
      const family = prop(body, 'font-family').replace(/^'|'$/g, '')
      const weight = prop(body, 'font-weight')
      const style = prop(body, 'font-style') || 'normal'
      const unicodeRange = prop(body, 'unicode-range')
      const srcMatch = body.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/)
      if (!srcMatch) throw new Error(`no woff2 url in block ${i} of ${req}`)

      const dir = `${slugify(family)}-${weight === '400' ? 'regular' : weight.replace(/\s+/g, '-')}`
      const filename = (style === 'normal' ? '' : style + '-') + `${i}.woff2`
      const outPath = path.join(OUT, dir, filename)
      const sub = `${dir}/${filename}`

      await mkdir(path.dirname(outPath), { recursive: true })
      const buf = await download(srcMatch[1])
      await writeFile(outPath, buf)
      totalBytes += buf.length
      fileCount++

      cssBlocks.push(
        `@font-face {\n` +
          `  font-family: '${family}';\n` +
          `  font-style: ${style};\n` +
          `  font-weight: ${weight};\n` +
          `  font-display: swap;\n` +
          `  src: url(./${encodeURI(sub)}) format('woff2');\n` +
          `  unicode-range: ${unicodeRange};\n` +
          `}`,
      )
    }
  }

  await writeFile(path.join(OUT, 'fonts.css'), cssBlocks.join('\n\n') + '\n', 'utf-8')
  console.log(`\nDone: ${fileCount} files, ${(totalBytes / 1024 / 1024).toFixed(2)} MB -> ${OUT}`)
  console.log(`generated: ${path.join(OUT, 'fonts.css')}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
