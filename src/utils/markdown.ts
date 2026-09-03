import MarkdownIt from 'markdown-it'

/* ============================================================
 * 文章（Markdown）解析工具 —— 纯静态
 * 构建期由 Vite 读入 content/posts/*.md，无后端依赖。
 * 该文件被浏览器端（stores/blog.ts）与 Node 构建脚本
 * （scripts/gen-seo.mjs、scripts/new-post.mjs）共用，保持单一事实来源。
 * ============================================================ */

/** 支持的语言范围 */
export type Lang = 'zh' | 'en' | 'both'

/** Frontmatter（作者在 md 头部书写的元数据） */
export interface PostFrontmatter {
  title: string
  titleEn: string
  titleZh: string
  description: string
  descriptionEn: string
  descriptionZh: string
  date: string
  updated: string
  tags: string[]
  tagsEn: string[]
  tagsZh: string[]
  lang: Lang
  externalUrl: string | null
  cover: string | null
  draft: boolean
  /** 旧的独立 HTML 页面路径：构建时给它们补 canonical，避免与 /blog/<slug> 抢权重 */
  legacy: string[]
}

/** 解析结果 */
export interface ParsedPost {
  frontmatter: PostFrontmatter
  content: string
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

/** md 字段名 → 内部驼峰字段（同时兼容 snake_case / camelCase 写法） */
const KEY_MAP: Record<string, keyof PostFrontmatter> = {
  title: 'title',
  title_en: 'titleEn',
  titleEn: 'titleEn',
  title_zh: 'titleZh',
  titleZh: 'titleZh',
  description: 'description',
  desc: 'description',
  summary: 'description',
  description_en: 'descriptionEn',
  descriptionEn: 'descriptionEn',
  description_zh: 'descriptionZh',
  descriptionZh: 'descriptionZh',
  date: 'date',
  updated: 'updated',
  lastmod: 'updated',
  tags: 'tags',
  tags_en: 'tagsEn',
  tagsEn: 'tagsEn',
  tags_zh: 'tagsZh',
  tagsZh: 'tagsZh',
  lang: 'lang',
  language: 'lang',
  external_url: 'externalUrl',
  externalUrl: 'externalUrl',
  url: 'externalUrl',
  cover: 'cover',
  image: 'cover',
  draft: 'draft',
  legacy: 'legacy',
  legacy_paths: 'legacy',
}

const LIST_KEYS: readonly (keyof PostFrontmatter)[] = ['tags', 'tagsEn', 'tagsZh', 'legacy']

function unquote(value: string): string {
  return value.replace(/^["'](.*)["']$/s, '$1').trim()
}

function parseInlineArray(value: string): string[] {
  return value
    .slice(1, -1)
    .split(',')
    .map((item) => unquote(item.trim()))
    .filter(Boolean)
}

function toBool(value: string): boolean {
  return ['true', '1', 'yes', 'on', ''].includes(value.trim().toLowerCase())
}

/** 空 frontmatter 默认值 */
export function emptyFrontmatter(): PostFrontmatter {
  return {
    title: '',
    titleEn: '',
    titleZh: '',
    description: '',
    descriptionEn: '',
    descriptionZh: '',
    date: '',
    updated: '',
    tags: [],
    tagsEn: [],
    tagsZh: [],
    lang: 'both',
    externalUrl: null,
    cover: null,
    draft: false,
    legacy: [],
  }
}

/** 解析 YAML frontmatter（轻量实现，不引入 js-yaml，浏览器与 Node 通用） */
export function parseFrontmatter(raw: string): ParsedPost {
  const fm = emptyFrontmatter()
  const match = FRONTMATTER_RE.exec(raw)
  if (!match) {
    return { frontmatter: fm, content: raw.trim() }
  }

  const yamlBlock = match[1] ?? ''
  const content = (match[2] ?? '').trim()

  let currentListKey: keyof PostFrontmatter | null = null

  for (const rawLine of yamlBlock.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    // 多行数组项：`  - 标签`
    if (line.startsWith('- ') && currentListKey) {
      const target = fm[currentListKey]
      if (Array.isArray(target)) target.push(unquote(line.slice(2)))
      continue
    }

    const colonIdx = line.indexOf(':')
    if (colonIdx <= 0) continue

    const rawKey = line.slice(0, colonIdx).trim()
    const value = line.slice(colonIdx + 1).trim()
    const key = KEY_MAP[rawKey]
    if (!key) continue

    currentListKey = null

    if (LIST_KEYS.includes(key)) {
      if (value.startsWith('[') && value.endsWith(']')) {
        (fm[key] as string[]) = parseInlineArray(value)
      } else if (value === '') {
        (fm[key] as string[]) = []
        currentListKey = key
      } else {
        (fm[key] as string[]) = [unquote(value)]
      }
      continue
    }

    if (key === 'draft') {
      fm.draft = toBool(value)
      continue
    }

    if (key === 'lang') {
      const v = unquote(value).toLowerCase()
      fm.lang = v === 'zh' || v === 'en' ? v : 'both'
      continue
    }

    const v = unquote(value)
    if (!v) continue
    if (key === 'externalUrl' || key === 'cover') {
      fm[key] = v
    } else {
      (fm[key] as string) = v
    }
  }

  return { frontmatter: fm, content }
}

/** 从文件路径提取 slug：content/posts/my-post.md → my-post */
export function pathToSlug(path: string): string {
  const file = path.split('/').pop() ?? ''
  return file.replace(/\.md$/, '')
}

/** 正文语言判断（CJK 字符占比），用于给英文界面读者提示原文语言 */
export function detectBodyLang(text: string): 'zh' | 'en' {
  const cjk = (text.match(/[\u3400-\u9fff\u3040-\u30ff]/g) ?? []).length
  const latin = (text.match(/[a-zA-Z]/g) ?? []).length
  if (cjk === 0 && latin === 0) return 'zh'
  return cjk > latin * 0.35 ? 'zh' : 'en'
}

/** 阅读时长（分钟）：中文按字数、英文按词数 */
export function readingMinutes(text: string): number {
  const cjk = (text.match(/[\u3400-\u9fff]/g) ?? []).length
  const words = (text.match(/[a-zA-Z]+/g) ?? []).length
  const minutes = cjk / 400 + words / 220
  return Math.max(1, Math.round(minutes))
}

/** 标题锚点 id（CJK 友好） */
export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
}

/** 去掉 markdown 语法取纯文本（摘要 / RSS description / 站内搜索） */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[>\-*+]\s+/gm, '')
    .replace(/[*_~]/g, '')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
  breaks: false,
})

/** 标题自动加 id，便于深链 */
md.renderer.rules.heading_open = (tokens, idx, options, _env, self) => {
  const token = tokens[idx]
  const children = tokens[idx + 1]?.children
  const text = children
    ? children
        .filter((t) => t.type === 'text' || t.type === 'code_inline')
        .map((t) => t.content)
        .join('')
    : ''
  if (token && text) token.attrSet('id', slugifyHeading(text))
  return self.renderToken(tokens, idx, options)
}

/** 外链新窗口打开并补 rel */
md.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
  const token = tokens[idx]
  const href = String(token?.attrGet('href') ?? '')
  if (token && /^https?:\/\//i.test(href)) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }
  return self.renderToken(tokens, idx, options)
}

/** 图片懒加载 */
md.renderer.rules.image = (tokens, idx, options, _env, self) => {
  tokens[idx]?.attrSet('loading', 'lazy')
  return self.renderToken(tokens, idx, options)
}

/** 渲染 Markdown 为 HTML */
export function renderMarkdown(content: string): string {
  return md.render(content)
}

/** 目录条目（仅 h2 / h3） */
export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

/** 从 markdown 正文生成目录 */
export function buildToc(content: string): TocItem[] {
  const items: TocItem[] = []
  for (const line of content.split(/\r?\n/)) {
    const m = /^(#{2,3})\s+(.*)$/.exec(line.trim())
    if (!m) continue
    const hashes = m[1] ?? ''
    const text = (m[2] ?? '').replace(/[*_`]/g, '').trim()
    if (!text) continue
    items.push({ id: slugifyHeading(text), text, level: hashes.length === 2 ? 2 : 3 })
  }
  return items
}

/** 日期归一化为 YYYY-MM-DD（RSS pubDate / sitemap lastmod 用），不做时区换算 */
export function toISODate(date: string, fallback?: string): string {
  const raw = (date || fallback || '').trim()
  const compact = /^(\d{4})(\d{2})(\d{2})$/.exec(raw)
  const normalized = compact
    ? `${compact[1]}-${compact[2]}-${compact[3]}`
    : raw.replace(/\//g, '-').slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return ''
  if (Number.isNaN(new Date(`${normalized}T00:00:00Z`).getTime())) return ''
  return normalized
}
