import { readdirSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildCatalog, listForLocale, localizePost } from '../utils/post-catalog'
import { escapeXml } from '../utils/format'
import { STATIC_PAGES } from '../data/site-pages'
import { SITE_NAME_ZH } from '../utils/site'

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

/**
 * 静态 HTML 的 h1 与标题兜底
 * ------------------------------------------------------------
 * 不执行 JS 的抓取器（多数 SEO/GEO 审计工具）只看得到 dist 里的静态 HTML，
 * 而本站的 h1 是 Vue 在浏览器里渲染的。2026-09-15 审计因此报了「缺少 h1 标记」
 * 与「标题太短」，这里把结论固化成断言，防止哪次改动把兜底去掉。
 *
 * 与上面 feed 那几条一样：dist 不存在时跳过（CI 先跑测试再构建），
 * 但本地 `npm run build && npm test` 必须全绿。
 */
describe('静态 HTML 的 h1 与标题兜底', () => {
  const DIST = path.resolve(__dirname, '../../dist')
  const homeFile = path.join(DIST, 'index.html')
  const home = STATIC_PAGES.find((page) => page.dir === '')
  const built = existsSync(homeFile)

  describe.skipIf(!built)('构建产物（dist 已存在）', () => {
    it('首页 <title> 由 site-pages.ts 驱动，且明显长于纯品牌名', () => {
      const title = /<title>([\s\S]*?)<\/title>/i.exec(readFileSync(homeFile, 'utf-8'))?.[1]?.trim() ?? ''
      // 与运行时 applyDocumentTitle() 的 `${页面名} | ${站点名}` 逐字一致
      expect(title).toBe(`${home?.title} | ${SITE_NAME_ZH}`)
      // 「张豪 | 技术人文空间」11 字被判过「标题太短」，这里要求更长
      expect(title.length).toBeGreaterThan(SITE_NAME_ZH.length)
    })

    it('首页与每个静态页外壳都带 <h1> 兜底', () => {
      const pages = [
        'index.html',
        ...STATIC_PAGES.filter((page) => page.emitShell).map((page) => `${page.dir}/index.html`),
      ]
      for (const rel of pages) {
        const file = path.join(DIST, rel)
        expect(existsSync(file), `缺外壳 ${rel}`).toBe(true)
        const html = readFileSync(file, 'utf-8')
        expect(/<h1[^>]*>[^<]+<\/h1>/.test(html), `${rel} 静态 HTML 里没有 h1`).toBe(true)
      }
    })

    it('预渲染的文章页 h1 就是文章标题，且未破坏 JSON-LD', () => {
      // 与 build/static-site.ts 的写法一致：用作者原文语言的标题
      const post = catalog
        .map((item) => localizePost(item, item.primary.bodyLang))
        .find((item) => !item.externalUrl)
      expect(post).toBeDefined()
      const html = readFileSync(path.join(DIST, post!.path, 'index.html'), 'utf-8')
      expect(html).toContain(`<h1>${escapeXml(post!.title)}</h1>`)
      expect(html).toContain('"@type":"BlogPosting"')
    })
  })
})
