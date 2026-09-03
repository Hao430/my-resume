import { readdirSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildCatalog, listForLocale } from '../utils/post-catalog'

/**
 * 构建产物一致性（规则：站内看到的 == 订阅源里的）
 * ------------------------------------------------------------
 * build/static-site.ts 与浏览器 store 共用 buildCatalog，
 * 但「共用代码」不等于「产物一致」——这里用真实 content/posts
 * 目录跑 catalog，再与 dist/feed.xml 里实际写出的 URL 对账。
 */

const CONTENT_DIR = path.resolve(__dirname, '../../content/posts')

function loadRealPosts(): Record<string, string> {
  const files: Record<string, string> = {}
  for (const name of readdirSync(CONTENT_DIR)) {
    if (!name.endsWith('.md')) continue
    files[name] = readFileSync(path.join(CONTENT_DIR, name), 'utf-8')
  }
  return files
}

const catalog = buildCatalog(loadRealPosts())

describe('真实内容目录 → catalog', () => {
  it('catalog 非空，且每个 slug 唯一（一个 slug 一个 URL）', () => {
    expect(catalog.length).toBeGreaterThan(0)
    const slugs = catalog.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('每篇文章 URL 统一 /blog/<slug>/，与 canonical 规范一致', () => {
    for (const post of catalog) {
      if (post.externalUrl) continue
      expect(post.path).toBe(`/blog/${post.slug}/`)
    }
  })

  it('中英列表都非空，且任意文章都有可渲染正文', () => {
    const zh = listForLocale(catalog, 'zh')
    const en = listForLocale(catalog, 'en')
    expect(zh.length).toBeGreaterThan(0)
    expect(en.length).toBeGreaterThan(0)
    for (const post of [...zh, ...en]) {
      expect(post.title, `${post.slug}`).not.toBe('')
      expect(post.contentHtml, `${post.slug}`).toContain('<p')
    }
  })

  it('feed.xml 的 URL 与站内列表完全对账（构建产物一致性）', () => {
    const feedPath = path.resolve(__dirname, '../../dist/feed.xml')
    if (!existsSync(feedPath)) return // CI 先跑测试再构建时跳过；本地构建后必须卡住
    const feed = readFileSync(feedPath, 'utf-8')
    const zhPosts = listForLocale(catalog, 'zh').filter((p) => !p.externalUrl)
    const urlSet = new Set(feed.match(/<link>https:\/\/hao430\.cn[^<]*<\/link>/g)?.map((m) => m.slice(6, -7)) ?? [])
    for (const post of zhPosts) {
      expect(urlSet.has(`https://hao430.cn${post.path}`), `feed 缺 ${post.path}`).toBe(true)
    }
  })
})
