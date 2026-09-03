import { promises as fs } from 'node:fs'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import type { Plugin } from 'vite'

import {
  buildCatalog,
  listForLocale,
  localizePost,
  type BlogPost,
  type LocalizedPost,
} from '../src/utils/post-catalog'
import {
  SITE_DESCRIPTION_EN,
  SITE_DESCRIPTION_ZH,
  SITE_EMAIL,
  SITE_NAME_EN,
  SITE_NAME_ZH,
  SITE_URL,
} from '../src/utils/site'
import { escapeXml, toRfc822 } from '../src/utils/format'
import { toISODate } from '../src/utils/markdown'

/**
 * 纯静态站点的构建期产物生成器（Vite 插件，apply: 'build'）
 * ------------------------------------------------------------
 * 1. RSS：/feed.xml（中文优先）+ /feed-en.xml（英文版），全文 content:encoded
 * 2. /briefs.xml：每日早参订阅源
 * 3. /sitemap.xml：主页面 + 每篇文章 + 每期早参（lastmod 取 frontmatter 日期）
 * 4. 每篇文章预渲染独立 HTML 外壳：正确的 title / canonical / OG / Twitter / JSON-LD，
 *    让 Google、X、Telegram、Slack、微信等不执行 JS 的抓取器也能拿到摘要
 * 5. 每日早参复制为 ASCII 路径 /briefs/YYYY-MM-DD/（中文路径保留并补 canonical）
 *
 * 与站内运行时共用 src/utils/post-catalog.ts，保证「页面看到的」与
 * 「订阅源 / sitemap 里的」完全一致。无后端、无外部服务。
 */

const AUTHOR = '张豪 (Hao430)'
const run = promisify(execFile)

/* ---------------- 每篇文章专属的 OG 分享图 ---------------- */

/** 按近似字符宽度折行（CJK 记 2 个宽度单位），最多 4 行 */
function wrapTitle(text: string, maxWidth = 26, maxLines = 4): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  const widthOf = (value: string) =>
    [...value].reduce((sum, ch) => sum + (/[\u3000-\u9fff\uf900-\ufaff]/.test(ch) ? 2 : 1), 0)
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (widthOf(candidate) > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  let result = lines
  if (result.length > maxLines) {
    result = result.slice(0, maxLines)
    result[maxLines - 1] = `${(result[maxLines - 1] ?? '').slice(0, maxWidth - 1)}…`
  } else if (result.length >= 2) {
    // 避免最后一行只剩一个孤词
    const last = (result[result.length - 1] ?? '').trim()
    if (last && !last.includes(' ')) {
      const prev = (result[result.length - 2] ?? '').trim().split(/\s+/)
      if (prev.length > 1) {
        const moved = prev.pop()
        result[result.length - 2] = prev.join(' ')
        result[result.length - 1] = `${moved} ${last}`
      }
    }
  }
  return result
}

function ogSvg(title: string, subtitle: string, tagline: string): string {
  const lines = wrapTitle(title)
  const size = lines.length <= 2 ? 76 : lines.length === 3 ? 66 : 58
  const startY = 300 - ((lines.length - 1) * (size + 12)) / 2
  const tspans = lines
    .map((line, i) => `<tspan x="96" y="${startY + i * (size + 12)}">${escapeXml(line)}</tspan>`)
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="ink" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d0d0f"/>
      <stop offset="100%" stop-color="#17171b"/>
    </linearGradient>
    <linearGradient id="acc" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c9454b"/>
      <stop offset="100%" stop-color="#9e2a2b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ink)"/>
  <rect width="1200" height="6" fill="url(#acc)"/>
  <g transform="translate(1040,520) scale(0.9)">
    <path d="M 0 -80 C 8 -70, 54 -18, 54 16 C 54 50, 32 72, 0 80 C -32 72, -54 50, -54 16 C -54 -18, -8 -70, 0 -80 Z" fill="url(#acc)" opacity="0.9"/>
  </g>
  <rect x="96" y="150" width="96" height="5" fill="url(#acc)"/>
  <text x="96" y="122" font-family="DejaVu Sans, Helvetica, sans-serif" font-size="26" letter-spacing="7" fill="#8f8b81">${escapeXml(subtitle.toUpperCase())}</text>
  <text font-family="DejaVu Serif, Noto Sans CJK SC, Georgia, serif" font-size="${size}" font-weight="bold" fill="#f3f1ea">${tspans}</text>
  <text x="96" y="556" font-family="DejaVu Sans, Noto Sans CJK SC, Helvetica, sans-serif" font-size="27" fill="#b7b3a8">${escapeXml(tagline)}</text>
</svg>
`
}

/** 构建环境（含 ESA 容器）的 CJK 字体不可控（本机有 Noto Sans CJK 但没有 Serif CJK），
 *  所以标题/文案含中文时一律回退到品牌图，避免分享图渲染成豆腐块 */
const CJK = /[\u3000-\u9fff\uf900-\ufaff\uff00-\uffef]/

/** 生成一张专属分享图；环境不支持或标题含非拉丁字符时返回 null */
async function renderOgImage(
  outDir: string,
  slug: string,
  title: string,
  subtitle: string,
  tagline: string,
): Promise<string | null> {
  if (CJK.test(title) || CJK.test(tagline)) return null
  const svg = ogSvg(title, subtitle, tagline)
  const dir = path.join(outDir, 'og')
  const file = path.join(dir, `${slug}.svg`)
  const png = path.join(dir, `${slug}.png`)
  const url = `${SITE_URL}/og/${slug}.png`
  // 1. 已随仓库发布、或已拷进 dist 的现成图（ESA 构建容器没有 librsvg，靠这一条兜住）
  for (const candidate of [png, path.join(process.cwd(), 'public', 'og', `${slug}.png`)]) {
    try {
      await fs.access(candidate)
      return url
    } catch {
      /* 继续尝试渲染 */
    }
  }
  // 2. 本机有 librsvg：即时渲染，并把结果同步回 public/og/，
  //    这样改了英文标题后重新构建即可，ESA 容器（无 librsvg）也能继续用上一次的图
  try {
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(file, svg, 'utf-8')
    await run('rsvg-convert', ['-w', '1200', '-h', '630', file, '-o', png])
    await fs.mkdir(path.join(process.cwd(), 'public', 'og'), { recursive: true })
    await fs.copyFile(png, path.join(process.cwd(), 'public', 'og', `${slug}.png`))
    return url
  } catch {
    return null
  }
}

/* ---------------- 插件 ---------------- */

interface Brief {
  date: string
  title: string
  summary: string
  asciiUrl: string
  legacyFile: string
}

/* ---------------- head 改写工具 ---------------- */

function replaceTitle(html: string, title: string): string {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeXml(title)}</title>`)
}

function upsertMeta(html: string, attr: 'name' | 'property', key: string, value: string): string {
  const escaped = escapeXml(value)
  const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`, 'i')
  if (re.test(html)) return html.replace(re, `$1${escaped}$2`)
  return html.replace(/<\/head>/i, `    <meta ${attr}="${key}" content="${escaped}">\n  </head>`)
}

function upsertLink(html: string, rel: string, href: string, extra = ''): string {
  const escaped = escapeXml(href)
  const re = new RegExp(`(<link\\s+rel="${rel}"\\s+href=")[^"]*(")`, 'i')
  if (re.test(html)) return html.replace(re, `$1${escaped}$2`)
  return html.replace(/<\/head>/i, `    <link rel="${rel}" href="${escaped}"${extra}>\n  </head>`)
}

function appendHead(html: string, snippet: string): string {
  return html.replace(/<\/head>/i, `    ${snippet}\n  </head>`)
}

/* ---------------- 数据装载 ---------------- */

async function loadCatalog(root: string): Promise<BlogPost[]> {
  const dir = path.join(root, 'content', 'posts')
  const files: Record<string, string> = {}
  try {
    for (const name of await fs.readdir(dir)) {
      if (!name.endsWith('.md')) continue
      files[`/content/posts/${name}`] = await fs.readFile(path.join(dir, name), 'utf-8')
    }
  } catch {
    return []
  }
  return buildCatalog(files)
}

async function loadBriefs(root: string): Promise<Brief[]> {
  const dir = path.join(root, 'public', '每日早参')
  let names: string[] = []
  try {
    names = (await fs.readdir(dir)).filter((f) => /^article_\d{8}\.html$/.test(f))
  } catch {
    return []
  }

  const briefs: Brief[] = []
  for (const name of names) {
    const parts = /^article_(\d{4})(\d{2})(\d{2})\.html$/.exec(name)
    const date = toISODate(parts ? `${parts[1]}-${parts[2]}-${parts[3]}` : '')
    if (!date) continue
    const source = await fs.readFile(path.join(dir, name), 'utf-8')
    const title = (source.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? `每日早参 ${date}`).trim()
    const summary = (source.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? '').trim()
    briefs.push({ date, title, summary, asciiUrl: `${SITE_URL}/briefs/${date}/`, legacyFile: `每日早参/${name}` })
  }
  return briefs.sort((a, b) => (a.date < b.date ? 1 : -1))
}

/* ---------------- RSS ---------------- */

function feedItem(post: LocalizedPost, locale: 'zh' | 'en'): string {
  const url = `${SITE_URL}${post.path}`
  const page = `<!DOCTYPE html><html lang="${locale === 'en' ? 'en' : 'zh-CN'}"><head><meta charset="utf-8"><title>${escapeXml(
    post.title,
  )}</title></head><body>${post.contentHtml}<hr><p><a href="${url}">${
    locale === 'en' ? 'Read on hao430.cn' : '在 hao430.cn 阅读全文'
  }</a></p></body></html>`
  const categories = post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('')
  const note = post.translationMissing
    ? `[${post.bodyLang === 'zh' ? '原文为中文' : 'Original in English'} · ${
        post.bodyLang === 'zh' ? 'Original in Chinese' : '中文原文'
      }] `
    : ''
  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <language>${locale === 'en' ? 'en' : 'zh-CN'}</language>
      ${categories}
      <description>${escapeXml(note + post.description)}</description>
      <content:encoded><![CDATA[${page}]]></content:encoded>
    </item>`
}

function buildFeed(items: LocalizedPost[], locale: 'zh' | 'en', file: string): string {
  const title = locale === 'en' ? SITE_NAME_EN : SITE_NAME_ZH
  const description = locale === 'en' ? SITE_DESCRIPTION_EN : SITE_DESCRIPTION_ZH
  const last = items[0]?.date ?? ''
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${SITE_URL}/blog/</link>
    <description>${escapeXml(description)}</description>
    <language>${locale === 'en' ? 'en' : 'zh-CN'}</language>
    <managingEditor>${SITE_EMAIL} (${escapeXml(AUTHOR)})</managingEditor>
    <webMaster>${SITE_EMAIL} (${escapeXml(AUTHOR)})</webMaster>
    <lastBuildDate>${toRfc822(last)}</lastBuildDate>
    <generator>hao430 static build</generator>
    <image>
      <url>${SITE_URL}/logo.svg</url>
      <title>${escapeXml(title)}</title>
      <link>${SITE_URL}/blog/</link>
    </image>
    <atom:link href="${SITE_URL}/${file}" rel="self" type="application/rss+xml" />
${items.map((post) => feedItem(post, locale)).join('\n')}
  </channel>
</rss>
`
}

function buildBriefFeed(briefs: Brief[]): string {
  const items = briefs
    .map(
      (brief) => `    <item>
      <title>${escapeXml(brief.title)}</title>
      <link>${brief.asciiUrl}</link>
      <guid isPermaLink="true">${brief.asciiUrl}</guid>
      <pubDate>${toRfc822(brief.date)}</pubDate>
      <language>zh-CN</language>
      <description>${escapeXml(brief.summary || brief.title)}</description>
    </item>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>每日早参 · 张豪</title>
    <link>${SITE_URL}/daily-brief/</link>
    <description>每交易日早晨的信息速览：政策 × 产业 × 科技 × 市场</description>
    <language>zh-CN</language>
    <lastBuildDate>${toRfc822(briefs[0]?.date ?? '')}</lastBuildDate>
    <atom:link href="${SITE_URL}/briefs.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}

/* ---------------- sitemap ---------------- */

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}

function buildSitemap(catalog: BlogPost[], briefs: Brief[], today: string): string {
  const entries = [
    urlEntry(`${SITE_URL}/`, today, 'weekly', '1.0'),
    urlEntry(`${SITE_URL}/about/`, today, 'monthly', '0.8'),
    urlEntry(`${SITE_URL}/blog/`, today, 'weekly', '0.9'),
    urlEntry(`${SITE_URL}/services/`, today, 'monthly', '0.7'),
    urlEntry(`${SITE_URL}/daily-brief/`, today, 'daily', '0.8'),
  ]
  for (const post of catalog) {
    if (post.externalUrl) continue
    entries.push(
      urlEntry(`${SITE_URL}${post.path}`, post.updated || post.date, 'monthly', '0.7'),
    )
  }
  for (const brief of briefs) entries.push(urlEntry(brief.asciiUrl, brief.date, 'yearly', '0.5'))
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`
}

/* ---------------- 预渲染外壳 ---------------- */

/** 让英文原文页面的 <html lang> 从一开始就是对的（而不是等 JS 改） */
function setHtmlLang(html: string, lang: 'zh-CN' | 'en'): string {
  return /<html[^>]*\slang="[^"]*"/i.test(html)
    ? html.replace(/(<html[^>]*\slang=")[^"]*(")/i, `$1${lang}$2`)
    : html.replace(/<html/i, `<html lang="${lang}"`)
}

function postHtml(shell: string, post: LocalizedPost, customImage?: string): string {
  const url = `${SITE_URL}${post.path}`
  const image =
    customImage ??
    (post.cover
      ? `${SITE_URL}${post.cover}`
      : `${SITE_URL}/${post.bodyLang === 'en' ? 'og-image-en.png' : 'og-image.png'}`)
  const siteName = post.bodyLang === 'en' ? SITE_NAME_EN : SITE_NAME_ZH

  let html = setHtmlLang(shell, post.bodyLang === 'en' ? 'en' : 'zh-CN')
  html = replaceTitle(html, `${post.title} | ${siteName}`)
  html = upsertMeta(html, 'name', 'description', post.description)
  html = upsertLink(html, 'canonical', url)
  html = upsertMeta(html, 'property', 'og:title', post.title)
  html = upsertMeta(html, 'property', 'og:description', post.description)
  html = upsertMeta(html, 'property', 'og:url', url)
  html = upsertMeta(html, 'property', 'og:type', 'article')
  html = upsertMeta(html, 'property', 'og:locale', post.bodyLang === 'en' ? 'en_US' : 'zh_CN')
  html = upsertMeta(
    html,
    'property',
    'og:locale:alternate',
    post.bodyLang === 'en' ? 'zh_CN' : 'en_US',
  )
  html = upsertMeta(html, 'property', 'og:image', image)
  html = upsertMeta(html, 'property', 'article:published_time', `${post.date}T08:00:00+08:00`)
  if (post.updated && post.updated !== post.date) {
    html = upsertMeta(html, 'property', 'article:modified_time', `${post.updated}T08:00:00+08:00`)
  }
  html = upsertMeta(html, 'name', 'twitter:title', post.title)
  html = upsertMeta(html, 'name', 'twitter:description', post.description)
  html = upsertMeta(html, 'name', 'twitter:image', image)
  html = appendHead(
    html,
    post.tags.map((tag) => `<meta property="article:tag" content="${escapeXml(tag)}">`).join('\n    '),
  )

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    inLanguage: post.bodyLang === 'en' ? 'en' : 'zh-CN',
    image,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    articleSection: post.tags.join(', '),
    keywords: post.tags.join(', '),
    wordCount: post.plain.length,
    url,
    author: { '@type': 'Person', name: AUTHOR, url: `${SITE_URL}/about/` },
    publisher: { '@type': 'Person', name: AUTHOR, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  })
  return appendHead(html, `<script type="application/ld+json">${jsonLd}</script>`)
}

function listHtml(shell: string, title: string, description: string, url: string): string {
  let html = replaceTitle(shell, `${title} | ${SITE_NAME_ZH}`)
  html = upsertMeta(html, 'name', 'description', description)
  html = upsertLink(html, 'canonical', url)
  html = upsertMeta(html, 'property', 'og:title', title)
  html = upsertMeta(html, 'property', 'og:description', description)
  html = upsertMeta(html, 'property', 'og:url', url)
  html = upsertMeta(html, 'property', 'og:type', 'website')
  html = upsertMeta(html, 'name', 'twitter:title', title)
  html = upsertMeta(html, 'name', 'twitter:description', description)
  return html
}

function briefHtml(source: string, brief: Brief): string {
  const snippet = [
    `<link rel="canonical" href="${brief.asciiUrl}">`,
    `<meta property="og:title" content="${escapeXml(brief.title)}">`,
    `<meta property="og:description" content="${escapeXml(brief.summary || '每日早参')}">`,
    `<meta property="og:url" content="${brief.asciiUrl}">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:image" content="${SITE_URL}/og-image.png">`,
  ].join('\n    ')
  if (/<\/head>/i.test(source)) return source.replace(/<\/head>/i, `    ${snippet}\n  </head>`)
  if (/<head[^>]*>/i.test(source)) return source.replace(/<head[^>]*>/i, (m) => `${m}\n    ${snippet}`)
  return `${snippet}\n${source}`
}

/* ---------------- llms.txt（供 ChatGPT / Claude / Perplexity 等检索引用） ---------------- */

function buildLlms(catalog: BlogPost[], briefs: Brief[]): string {
  const posts = listForLocale(catalog, 'en').filter((p) => !p.externalUrl)
  const zhPosts = listForLocale(catalog, 'zh').filter((p) => !p.externalUrl)
  const lines: string[] = [
    `# ${SITE_NAME_EN}`,
    '',
    `> ${SITE_DESCRIPTION_EN}`,
    `> 中文简介：${SITE_DESCRIPTION_ZH}`,
    '',
    'This site is bilingual. Every article lives at one URL and is available in both',
    'Chinese and English — the page switches language on request, and both full-text',
    'feeds are published below. Written by Hao Zhang (张豪), a full-stack developer in',
    'Guiyang, China, working on AI-era engineering practice and independent shipping.',
    '',
    '## Key links',
    '',
    `- [Blog index](${SITE_URL}/blog/): all articles, Chinese and English`,
    `- [English RSS (full text)](${SITE_URL}/feed-en.xml)`,
    `- [中文 RSS（全文）](${SITE_URL}/feed.xml)`,
    `- [Daily brief RSS / 每日早参](${SITE_URL}/briefs.xml)`,
    `- [About the author](${SITE_URL}/about/)`,
    '- [GitHub](https://github.com/Hao430): open-source projects and the MCP sandboxing tooling mentioned in the agent-security article',
    '',
    '## Articles (English)',
    '',
  ]
  for (const post of posts) {
    lines.push(`- [${post.title}](${SITE_URL}${post.path}): ${post.description} (published ${post.date}; Chinese version available at the same URL)`)
  }
  lines.push('', '## Articles (Chinese / 中文原文)', '')
  for (const post of zhPosts) {
    lines.push(`- [${post.title}](${SITE_URL}${post.path}): ${post.description}（发布于 ${post.date}，同一 URL 提供英文版）`)
  }
  if (briefs.length) {
    lines.push(
      '',
      '## Daily brief / 每日早参',
      '',
      `A weekday-morning briefing on policy, industry, technology and markets, mostly in Chinese. Latest: [${briefs[0].title}](${briefs[0].asciiUrl}). Subscribe: ${SITE_URL}/briefs.xml`,
      '',
    )
  }
  lines.push(
    '## Citation notes',
    '',
    'Statistics in the security and engineering articles link to primary sources',
    '(Cloud Security Alliance, Gravitee, JetBrains, Stack Overflow, Wharton/Penn,',
    'arXiv). Please cite those originals rather than this site where possible.',
    '',
  )
  return lines.join('\n')
}

/* ---------------- 插件 ---------------- */

export function staticSitePlugin(): Plugin {
  let root = process.cwd()
  let outDir = 'dist'

  return {
    name: 'hao430:static-site',
    apply: 'build',
    configResolved(config) {
      root = config.root
      outDir = path.isAbsolute(config.build.outDir)
        ? config.build.outDir
        : path.join(config.root, config.build.outDir)
    },
    async closeBundle() {
      const startedAt = Date.now()
      const shellPath = path.join(outDir, 'index.html')
      let shell: string
      try {
        shell = await fs.readFile(shellPath, 'utf-8')
      } catch {
        this.warn('未找到 dist/index.html，跳过静态可发现性资产生成')
        return
      }

      const catalog = await loadCatalog(root)
      const briefs = await loadBriefs(root)
      const zhItems = listForLocale(catalog, 'zh')
      const enItems = listForLocale(catalog, 'en')
      const today = new Date().toISOString().slice(0, 10)
      const writes: Promise<unknown>[] = []

      /* 1. 订阅源与索引 */
      writes.push(fs.writeFile(path.join(outDir, 'feed.xml'), buildFeed(zhItems, 'zh', 'feed.xml'), 'utf-8'))
      writes.push(
        fs.writeFile(path.join(outDir, 'feed-en.xml'), buildFeed(enItems, 'en', 'feed-en.xml'), 'utf-8'),
      )
      writes.push(fs.writeFile(path.join(outDir, 'briefs.xml'), buildBriefFeed(briefs), 'utf-8'))
      writes.push(fs.writeFile(path.join(outDir, 'llms.txt'), buildLlms(catalog, briefs), 'utf-8'))
      writes.push(fs.writeFile(path.join(outDir, 'sitemap.xml'), buildSitemap(catalog, briefs, today), 'utf-8'))
      writes.push(
        fs.writeFile(
          path.join(outDir, 'robots.txt'),
`User-agent: *
Allow: /

# 中英文双语内容，全站允许抓取
# 海外 AI 检索/问答入口也放行（内容即个人 IP 资产，宁可被引用也不要被抓不到）
User-agent: Googlebot
Allow: /
User-agent: Bingbot
Allow: /
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml

Crawl-delay: 1
`,
          'utf-8',
        ),
      )

      /* 1b. 主要页面的 head 外壳（SPA 路由直链也能给出正确的 title / OG） */
      const pageShells: { dir: string; title: string; desc: string; path: string }[] = [
        { dir: 'about', title: '关于我', desc: `${SITE_DESCRIPTION_ZH}。Full-stack developer based in Guiyang, building AI-era tooling.`, path: '/about/' },
        { dir: 'daily-brief', title: '每日早参', desc: '每交易日早晨的信息速览：政策 × 产业 × 科技 × 市场。Subscribe: /briefs.xml', path: '/daily-brief/' },
        { dir: 'services', title: 'AI 编码服务', desc: 'AI coding workflow optimization and AI-generated code security audit & remediation — diagnose first, quote after.', path: '/services/' },
        { dir: 'slides', title: '演示文稿', desc: '视觉表达与深度演示 · Slides and talks', path: '/slides/' },
      ]
      for (const page of pageShells) {
        const dir = path.join(outDir, page.dir)
        writes.push(
          fs.mkdir(dir, { recursive: true }).then(() =>
            fs.writeFile(
              path.join(dir, 'index.html'),
              listHtml(shell, `${page.title}`, page.desc, `${SITE_URL}${page.path}`),
              'utf-8',
            ),
          ),
        )
      }

      /* 2. 博客列表页外壳 */
      writes.push(
        fs
          .mkdir(path.join(outDir, 'blog'), { recursive: true })
          .then(() =>
            fs.writeFile(
              path.join(outDir, 'blog', 'index.html'),
              listHtml(
                shell,
                '博客',
                `${SITE_DESCRIPTION_ZH}。Personal blog of Hao Zhang — AI-era engineering, product notes. English feed: /feed-en.xml`,
                `${SITE_URL}/blog/`,
              ),
              'utf-8',
            ),
          ),
      )

      /* 3. 每篇文章独立 head（用作者原文语言，保证 title / og:locale 与正文一致） */
      const emitted = new Set<string>()
      let rendered = 0
      for (const post of catalog.map((item) => localizePost(item, item.primary.bodyLang))) {
        if (post.externalUrl || emitted.has(post.slug)) continue
        emitted.add(post.slug)
        const dir = path.join(outDir, post.path)
        writes.push(
          (async () => {
            const tagline =
              post.bodyLang === 'en'
                ? `Hao Zhang · hao430.cn · ${post.readingMinutes} min read`
                : `张豪 · hao430.cn · 阅读约 ${post.readingMinutes} 分钟`
            const image = await renderOgImage(outDir, post.slug, post.title, SITE_NAME_EN, tagline)
            if (image) rendered += 1
            await fs.mkdir(dir, { recursive: true })
            await fs.writeFile(path.join(dir, 'index.html'), postHtml(shell, post, image ?? undefined), 'utf-8')
          })(),
        )
      }

      /* 3b. 旧的独立 HTML 文章：补 canonical，权重归并到 /blog/<slug>/ */
      for (const post of catalog) {
        for (const alias of post.legacy) {
          const target = path.join(outDir, alias.replace(/^\//, ''))
          writes.push(
            fs
              .readFile(target, 'utf-8')
              .then((source) => {
                if (/<link rel="canonical"/i.test(source)) return
                return fs.writeFile(target, appendHead(source, `<link rel="canonical" href="${SITE_URL}${post.path}">`), 'utf-8')
              })
              .catch(() => undefined),
          )
        }
      }

      /* 4. 每日早参：ASCII 路径副本 + 中文原件补 canonical */
      for (const brief of briefs) {
        try {
          const source = await fs.readFile(path.join(outDir, brief.legacyFile), 'utf-8')
          writes.push(
            fs
              .mkdir(path.join(outDir, 'briefs', brief.date), { recursive: true })
              .then(() =>
                fs.writeFile(
                  path.join(outDir, 'briefs', brief.date, 'index.html'),
                  briefHtml(source, brief),
                  'utf-8',
                ),
              ),
            fs.writeFile(path.join(outDir, brief.legacyFile), briefHtml(source, brief), 'utf-8'),
          )
        } catch {
          /* 源文件缺失则跳过 */
        }
      }

      await Promise.all(writes)
      this.info(
        `静态可发现性资产：${catalog.length} 篇文章（中文 ${zhItems.length} / 英文 ${enItems.length}）· ${briefs.length} 期早参 → feed.xml · feed-en.xml · briefs.xml · sitemap.xml · 预渲染 head（${
          Date.now() - startedAt
        }ms）· 专属分享图 ${rendered} 张`,
      )
    },
  }
}
