#!/usr/bin/env node
/**
 * 新建文章脚手架
 * ------------------------------------------------------------
 *   npm run new-post -- "文章标题" --slug=my-post-title --tags=AI,产品
 *
 * 约束（为了海外可访问性与 SEO，全部强制）：
 *   1. slug 必须是 ASCII 小写短横线（URL 不出现中文转义）
 *   2. frontmatter 预留 title_en / description_en，英文读者不会看到空列表
 *   3. 默认 lang: both，中英界面都能发现这篇文章
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = path.resolve(import.meta.dirname, '..')
const POSTS_DIR = path.join(ROOT, 'content', 'posts')
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function parseArgs(argv) {
  const args = { lang: 'both', tags: '', date: '', draft: false }
  const positional = []
  for (const item of argv) {
    const m = /^--([^=]+)(?:=(.*))?$/.exec(item)
    if (m) {
      args[m[1]] = m[2] === undefined ? true : m[2]
    } else {
      positional.push(item)
    }
  }
  args.title = positional.join(' ').trim()
  return args
}

function guessSlug(title) {
  const ascii = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return ascii
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

const args = parseArgs(process.argv.slice(2))

if (!args.title) {
  console.error('用法: npm run new-post -- "文章标题" --slug=ascii-slug [--lang=zh|en|both] [--tags=AI,产品]')
  process.exit(1)
}

const autoSlug = !args.slug
const slug = args.slug ? String(args.slug) : guessSlug(args.title)
if (autoSlug && slug && !/[a-z]{4}/.test(slug)) {
  console.error(
    `\n✖ 中文标题无法自动派生 slug（得到 '${slug || '空'}'）。请加 --slug=english-words\n`,
  )
  process.exit(1)
}
if (autoSlug) {
  console.log(`· 由标题自动派生 slug='${slug}'，若不理想请用 --slug= 指定`)
}
if (!SLUG_RE.test(slug)) {
  console.error(
    `\n✖ slug 不符合海外友好规则：'${slug}'\n` +
      '  要求：小写字母 / 数字 / 单短横线，例如 build-ai-workflow\n' +
      '  中文标题请加 --slug=english-slug\n',
  )
  process.exit(1)
}

const file = path.join(POSTS_DIR, `${slug}.md`)
try {
  await fs.access(file)
  console.error(`✖ 文件已存在：content/posts/${slug}.md（请换一个 slug）`)
  process.exit(1)
} catch {
  /* 正常：文件不存在 */
}

const tags = String(args.tags)
  .split(/[,，]/)
  .map((t) => t.trim())
  .filter(Boolean)

const content = `---
title: ${args.title}
title_en: ""
description: 一句话摘要（会用于列表页、RSS 与分享卡片）
description_en: ""
date: ${args.date || todayISO()}
tags: [${tags.join(', ')}]
lang: ${args.lang}
draft: true
---

## 为什么写这篇

正文从这里开始。支持标准 Markdown：表格、代码块、引用、图片（图片请放 \`public/images/\`）。

## 小结

- 要点一
- 要点二

发布前把上面的 \`draft: true\` 改成 \`false\`。
`

await fs.mkdir(POSTS_DIR, { recursive: true })
await fs.writeFile(file, content, 'utf-8')

console.log(`✔ 已创建 content/posts/${slug}.md`)
console.log('')
console.log('下一步：')
console.log(`  1. 写正文，补齐 title_en / description_en（海外读者与分享卡片会用到）`)
console.log(`  2. 本地预览：npm run dev  →  http://localhost:5173/blog/${slug}`)
console.log(`  3. 发布：把 draft 改为 false，然后 git add content/posts/${slug}.md && git commit && git push`)
console.log('     （推送 main 后阿里云 ESA 自动构建部署到 https://hao430.cn）')
