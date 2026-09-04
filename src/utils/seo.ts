/**
 * 运行时 SEO 同步
 * ------------------------------------------------------------
 * 站点是 SPA：/blog/xxx 这类未被预渲染的路径会回落到 index.html 外壳，
 * 若不动态修正 canonical / og 标签，Google 会把文章页判成首页的重复页。
 * 因此每次路由切换都按「统一带尾斜杠」的规范修正 head。
 */
import { escapeXml } from './format'

export const SITE_ORIGIN = 'https://hao430.cn'

/** 统一 URL 规范：路径结尾带斜杠 */
export function canonicalUrl(path: string): string {
  const clean = path === '/' ? '' : path.replace(/\/+$/, '')
  return `${SITE_ORIGIN}${clean}/`
}

function upsertMeta(attr: 'name' | 'property', key: string, value: string): void {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** 注入 / 更新一段 JSON-LD（按 id 定向：预渲染外壳已带 id 时更新内容，而非重复追加） */
export function upsertJsonLd(id: string, data: Record<string, unknown>): void {
  const selector = `script[type="application/ld+json"][id="${id}"]`
  let el = document.head.querySelector<HTMLScriptElement>(selector)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/** 设置 canonical + og:url */
export function setCanonical(path: string): void {
  const url = canonicalUrl(path)
  upsertLink('canonical', url)
  upsertMeta('property', 'og:url', url)
}

/** 设置 title / description / og / twitter 摘要 */
export function setPageMeta(options: {
  title: string
  description?: string
  image?: string
  type?: 'website' | 'article'
}): void {
  document.title = options.title
  if (options.description) {
    upsertMeta('name', 'description', options.description)
    upsertMeta('property', 'og:description', options.description)
    upsertMeta('name', 'twitter:description', options.description)
  }
  const safeTitle = escapeXml(options.title)
  upsertMeta('property', 'og:title', safeTitle)
  upsertMeta('name', 'twitter:title', safeTitle)
  upsertMeta('property', 'og:type', options.type ?? 'website')
  if (options.image) {
    upsertMeta('property', 'og:image', options.image)
    upsertMeta('name', 'twitter:image', options.image)
  }
}
