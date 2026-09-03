import {
  buildToc,
  detectBodyLang,
  parseFrontmatter,
  pathToSlug,
  readingMinutes,
  renderMarkdown,
  toISODate,
  toPlainText,
  type Lang,
  type TocItem,
} from './markdown'

/**
 * 文章目录构建（单一事实来源）
 * ------------------------------------------------------------
 * 浏览器端（src/stores/blog.ts）与构建脚本（build/static-site.ts）
 * 共用同一份逻辑，避免「站内看到 4 篇、RSS 里却是 3 篇」这类漂移。
 *
 * 双语约定：
 *   - 一个 slug = 一个 URL（/blog/<slug>/），多语言正文共用
 *   - `foo.md` 是原始语言版本；`foo.en.md` / `foo.zh.md` 是对应语种的译文
 *   - frontmatter 的 `lang: zh|en|both` 控制出现在哪种语言的列表里
 *   - 只有元数据翻译时（`title_en` / `title_zh` 等）不必建伴生文件
 */

export type PostLocale = 'zh' | 'en'

/** 某一语言版本 */
export interface PostVersion {
  title: string
  description: string
  tags: string[]
  contentHtml: string
  plain: string
  readingMinutes: number
  toc: TocItem[]
  /** 正文实际语言（用于「原文为中文」提示） */
  bodyLang: 'zh' | 'en'
}

export interface BlogPost {
  slug: string
  date: string
  updated: string
  lang: Lang
  externalUrl: string | null
  cover: string | null
  /** 作者原始版本 */
  primary: PostVersion
  /** 仅有元数据翻译（没有另一语种正文）时使用，让列表标题/摘要按访客语言显示 */
  altMeta: { title: string; description: string; tags: string[] }
  /** 可用语言版本 */
  locales: Partial<Record<PostLocale, PostVersion>>
  /** 站内路径（外链文章直接指向 public 下的 html） */
  path: string
  /** 旧的独立 HTML（构建时补 canonical 指向本篇） */
  legacy: string[]
}

/** 按语言解析后的视图（组件层直接用 title / description / contentHtml） */
export interface LocalizedPost extends BlogPost {
  locale: PostLocale
  title: string
  description: string
  tags: string[]
  contentHtml: string
  plain: string
  readingMinutes: number
  toc: TocItem[]
  bodyLang: 'zh' | 'en'
  /** 该语言没有独立译文，回退到原文 */
  translationMissing: boolean
}

/**
 * 没有另一语种正文时，用 frontmatter 里的 `*_en` / `*_zh` 兜住列表页与 RSS 的标题语言。
 * 正文语言为 zh → 取 title_en；为 en → 取 title_zh。
 */
function altMetaFor(
  bodyLang: 'zh' | 'en',
  fm: ReturnType<typeof parseFrontmatter>['frontmatter'],
): { title: string; description: string; tags: string[] } {
  return bodyLang === 'zh'
    ? { title: fm.titleEn, description: fm.descriptionEn, tags: fm.tagsEn }
    : { title: fm.titleZh, description: fm.descriptionZh, tags: fm.tagsZh }
}

export function normalizeLocale(locale: string): PostLocale {
  return locale.startsWith('en') ? 'en' : 'zh'
}

/** 正文首个 H1 与标题重复时去掉：页面已经渲染了 <h1>，避免一篇文章两个 H1 */
function stripLeadingH1(body: string, title: string): string {
  const lines = body.split(/\r?\n/)
  const first = lines.findIndex((l) => l.trim() !== '')
  if (first < 0) return body
  const match = /^#\s+(.*)$/.exec(lines[first]!.trim())
  if (!match) return body
  const heading = match[1]!.trim().replace(/[*_`]/g, '')
  if (heading !== title.trim()) return body
  return lines.slice(first + 1).join('\n').trim()
}

function toVersion(
  title: string,
  description: string,
  tags: string[],
  body: string,
  fallbackTitle: string,
): PostVersion {
  const content = stripLeadingH1(body, title || fallbackTitle)
  const plain = toPlainText(content)
  const html = renderMarkdown(content)
  return {
    title: title || fallbackTitle,
    description: description || plain.slice(0, 140),
    tags,
    contentHtml: html,
    plain,
    readingMinutes: readingMinutes(plain),
    toc: buildToc(content),
    bodyLang: detectBodyLang(plain),
  }
}

function sortPosts(posts: BlogPost[]): BlogPost[] {
  return posts.sort((a, b) =>
    a.date === b.date ? a.slug.localeCompare(b.slug) : a.date < b.date ? 1 : -1,
  )
}

/** 把 { 路径: markdown 原文 } 编译成文章目录（已按日期倒序，草稿已剔除） */
export function buildCatalog(files: Record<string, string>): BlogPost[] {
  const originals: BlogPost[] = []
  const translations: { slug: string; locale: PostLocale; post: BlogPost }[] = []

  for (const [filePath, raw] of Object.entries(files)) {
    const { frontmatter, content } = parseFrontmatter(raw)
    if (frontmatter.draft) continue

    const withoutExt = filePath.replace(/\.md$/, '')
    const companion = /\.(en|zh)$/.exec(withoutExt)
    const isEnFile = companion?.[1] === 'en'
    const isZhFile = companion?.[1] === 'zh'
    const isCompanion = Boolean(companion)
    const slug = pathToSlug(isCompanion ? withoutExt.replace(/\.(en|zh)$/, '') : withoutExt)
    const fallbackTitle = frontmatter.title || slug
    // 伴生文件优先取「与本文件语种一致」的字段，其次取普通字段
    const version = toVersion(
      isEnFile
        ? frontmatter.titleEn || frontmatter.title
        : isZhFile
          ? frontmatter.titleZh || frontmatter.title
          : frontmatter.title,
      isEnFile
        ? frontmatter.descriptionEn || frontmatter.description
        : isZhFile
          ? frontmatter.descriptionZh || frontmatter.description
          : frontmatter.description,
      isEnFile && frontmatter.tagsEn.length
        ? frontmatter.tagsEn
        : isZhFile && frontmatter.tagsZh.length
          ? frontmatter.tagsZh
          : frontmatter.tags,
      content,
      fallbackTitle,
    )
    const date = toISODate(frontmatter.date, filePath)
    const updated = toISODate(frontmatter.updated) || date

    if (isCompanion) {
      translations.push({
        slug,
        locale: isEnFile ? 'en' : 'zh',
        post: {
          slug,
          date,
          updated,
          lang: frontmatter.lang,
          externalUrl: frontmatter.externalUrl,
          cover: frontmatter.cover,
          legacy: frontmatter.legacy,
          primary: version,
          altMeta: { title: '', description: '', tags: [] },
          locales: { [isEnFile ? 'en' : 'zh']: version },
          path: frontmatter.externalUrl || `/blog/${slug}/`,
        },
      })
      continue
    }

    originals.push({
      slug,
      date,
      updated,
      lang: frontmatter.lang,
      externalUrl: frontmatter.externalUrl,
      cover: frontmatter.cover,
      legacy: frontmatter.legacy,
      primary: version,
      altMeta: altMetaFor(version.bodyLang, frontmatter),
      locales: { [version.bodyLang]: version },
      path: frontmatter.externalUrl || `/blog/${slug}/`,
    })
  }

  const bySlug = new Map(originals.map((post) => [post.slug, post]))

  for (const { slug, locale: companionLocale, post: companion } of translations) {
    const version = companion.primary
    const target = bySlug.get(slug)
    if (!target) {
      // 只有伴生文件：照样发布，另一语言回退到这份正文
      bySlug.set(slug, {
        ...companion,
        lang: 'both',
        locales: { zh: version, en: version, [companionLocale]: version },
      })
      continue
    }
    target.locales[companionLocale] = version
    if (target.updated < companion.updated) target.updated = companion.updated
    if (!target.date) target.date = companion.date
    if (!target.cover && companion.cover) target.cover = companion.cover
    if (target.lang !== 'both') target.lang = 'both'
  }

  return sortPosts([...bySlug.values()])
}

/** 某个语言下应该出现的文章（lang 过滤 + 版本解析） */
export function listForLocale(catalog: BlogPost[], locale: string): LocalizedPost[] {
  const loc = normalizeLocale(locale)
  return catalog
    .filter((post) => post.lang === 'both' || post.lang === loc)
    .map((post) => localizePost(post, loc))
}

export function localizePost(post: BlogPost, locale: PostLocale): LocalizedPost {
  const version = post.locales[locale] ?? post.primary
  const translatedMeta = post.locales[locale] ? null : post.altMeta
  return {
    ...post,
    locale,
    title: translatedMeta?.title || version.title,
    description: translatedMeta?.description || version.description,
    tags: translatedMeta?.tags.length ? translatedMeta.tags : version.tags,
    contentHtml: version.contentHtml,
    plain: version.plain,
    readingMinutes: version.readingMinutes,
    toc: version.toc,
    bodyLang: version.bodyLang,
    translationMissing: !post.locales[locale],
  }
}

export function findPost(
  catalog: BlogPost[],
  slug: string,
  locale: string,
): LocalizedPost | undefined {
  const post = catalog.find((item) => item.slug === slug)
  return post ? localizePost(post, normalizeLocale(locale)) : undefined
}

/** 上一篇 / 下一篇（同一语言列表内相邻） */
export function adjacentPosts(
  catalog: BlogPost[],
  slug: string,
  locale: string,
): { prev: LocalizedPost | null; next: LocalizedPost | null } {
  const items = listForLocale(catalog, locale)
  const idx = items.findIndex((item) => item.slug === slug)
  if (idx < 0) return { prev: null, next: null }
  return {
    prev: idx > 0 ? (items[idx - 1] ?? null) : null,
    next: idx < items.length - 1 ? (items[idx + 1] ?? null) : null,
  }
}

export function tagCloud(catalog: BlogPost[], locale: string): string[] {
  const set = new Set<string>()
  for (const post of listForLocale(catalog, locale)) {
    for (const tag of post.tags) set.add(tag)
  }
  return [...set]
}
