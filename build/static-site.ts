import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { buildCatalog, listForLocale, type LocalizedPost } from '../src/utils/post-catalog'
import { escapeXml, toRfc822 } from '../src/utils/format'
import {
  SITE_URL,
  SITE_NAME_ZH,
  SITE_NAME_EN,
  SITE_DESCRIPTION_ZH,
  SITE_DESCRIPTION_EN,
} from '../src/utils/site'

function loadPosts(contentDir: string): Record<string, string> {
  const files: Record<string, string> = {}
  if (!existsSync(contentDir)) return files
  for (const name of readdirSync(contentDir)) {
    if (!name.endsWith('.md')) continue
    files[name] = readFileSync(path.join(contentDir, name), 'utf-8')
  }
  return files
}

function loadDailyBriefs(briefsDir: string): Array<{ date: string; title: string; file: string; url: string }> {
  if (!existsSync(briefsDir)) return []
  const files = readdirSync(briefsDir)
    .filter((file) => file.endsWith('.html') && /^article_\d{8}\.html$/.test(file))
    .sort()
    .reverse()

  return files.map((file) => {
    const match = file.match(/article_(\d{4})(\d{2})(\d{2})\.html$/)
    const date = match ? `${match[1]}-${match[2]}-${match[3]}` : ''
    const content = readFileSync(path.join(briefsDir, file), 'utf-8')
    const titleMatch = content.match(/<title>(.*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : file.replace('.html', '')
    return {
      date,
      title,
      file: `每日早参/${file}`,
      url: `/briefs/${date}/`,
    }
  })
}

function generateRss(
  title: string,
  description: string,
  feedPath: string,
  posts: LocalizedPost[],
  lang = 'zh-CN',
  siteUrl = SITE_URL
) {
  const itemsXml = posts
    .filter((p) => !p.externalUrl)
    .map((p) => {
      const link = `${siteUrl}${p.path}`
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(p.description || '')}</description>
      <pubDate>${toRfc822(p.date)}</pubDate>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(description)}</description>
    <atom:link href="${siteUrl}${feedPath}" rel="self" type="application/rss+xml"/>
    <language>${lang}</language>
${itemsXml}
  </channel>
</rss>
`
}

function generateBriefsRss(
  briefs: Array<{ date: string; title: string; url: string }>,
  siteUrl = SITE_URL
) {
  const itemsXml = briefs
    .map((b) => {
      const link = `${siteUrl}${b.url}`
      return `    <item>
      <title>${escapeXml(b.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${toRfc822(b.date)}</pubDate>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>每日早参 - 张豪</title>
    <link>${siteUrl}/briefs</link>
    <description>张豪的每日早参精选</description>
    <atom:link href="${siteUrl}/briefs.xml" rel="self" type="application/rss+xml"/>
    <language>zh-CN</language>
${itemsXml}
  </channel>
</rss>
`
}

function generateSitemap(urls: string[]) {
  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${escapeXml(url)}</loc>
    <changefreq>weekly</changefreq>
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`
}

export function staticSitePlugin(): Plugin {
  return {
    name: 'static-site-generator',
    closeBundle() {
      const rootDir = process.cwd()
      const contentDir = path.join(rootDir, 'content/posts')
      const briefsDir = path.join(rootDir, 'public/每日早参')
      const distDir = path.join(rootDir, 'dist')

      if (!existsSync(distDir)) return

      const postFiles = loadPosts(contentDir)
      const catalog = buildCatalog(postFiles)
      const zhPosts = listForLocale(catalog, 'zh')
      const enPosts = listForLocale(catalog, 'en')
      const briefs = loadDailyBriefs(briefsDir)

      // 1. feed.xml (Chinese RSS)
      const feedZh = generateRss(SITE_NAME_ZH, SITE_DESCRIPTION_ZH, '/feed.xml', zhPosts, 'zh-CN')
      writeFileSync(path.join(distDir, 'feed.xml'), feedZh, 'utf-8')

      // 2. feed-en.xml (English RSS)
      const feedEn = generateRss(SITE_NAME_EN, SITE_DESCRIPTION_EN, '/feed-en.xml', enPosts, 'en-US')
      writeFileSync(path.join(distDir, 'feed-en.xml'), feedEn, 'utf-8')

      // 3. briefs.xml
      const briefsFeed = generateBriefsRss(briefs)
      writeFileSync(path.join(distDir, 'briefs.xml'), briefsFeed, 'utf-8')

      // 4. sitemap.xml
      const staticPages = [
        `${SITE_URL}/`,
        `${SITE_URL}/about/`,
        `${SITE_URL}/blog/`,
        `${SITE_URL}/slides/`,
        `${SITE_URL}/services/`,
        `${SITE_URL}/privacy/`,
        `${SITE_URL}/briefs/`,
      ]
      const postUrls = catalog
        .filter((p) => !p.externalUrl)
        .map((p) => `${SITE_URL}${p.path}`)
      const briefUrls = briefs.map((b) => `${SITE_URL}${b.url}`)

      const allUrls = Array.from(new Set([...staticPages, ...postUrls, ...briefUrls]))
      const sitemap = generateSitemap(allUrls)
      writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf-8')

      // 5. Generate briefs HTML redirects/wrappers
      for (const b of briefs) {
        const briefOutDir = path.join(distDir, 'briefs', b.date)
        if (!existsSync(briefOutDir)) {
          mkdirSync(briefOutDir, { recursive: true })
        }
        const srcHtml = path.join(rootDir, 'public', b.file)
        if (existsSync(srcHtml)) {
          copyFileSync(srcHtml, path.join(briefOutDir, 'index.html'))
        }
      }
    },
  }
}
