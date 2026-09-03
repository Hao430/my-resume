import { describe, expect, it } from 'vitest'
import {
  adjacentPosts,
  buildCatalog,
  findPost,
  listForLocale,
  localizePost,
  tagCloud,
} from '../utils/post-catalog'

/** 测试夹具：foo.md（英文原文）+ foo.zh.md（中文译文） */
const FILES = {
  'content/posts/foo.md': `---
title: Foo Post
title_zh: Foo 文章
description: English summary
description_zh: 中文摘要
date: 2026-09-01
tags: [AI]
tags_zh: [人工智能]
lang: both
---
# Foo Post
English body with keyword.
## Section One
Some more text here.
`,
  'content/posts/foo.zh.md': `---
title: Foo 文章
description: 中文摘要
date: 2026-09-01
tags: [人工智能]
---
# Foo 文章
中文正文。
## 第一节
更多中文。
`,
  'content/posts/bar.md': `---
title: Bar 中文原文
title_en: Bar Post
description: 中文摘要
description_en: English summary
date: 2026-09-02
lang: zh
tags: [工具]
---
# Bar 中文原文
这是中文原文，没有英文翻译。
`,
  'content/posts/draft.md': `---
title: Draft Post
date: 2026-08-01
draft: true
---
草稿内容
`,
  'content/posts/orphan.en.md': `---
title_en: Orphan Post
title: Orphan
description_en: Orphan only
date: 2026-08-15
---
Orphan companion body.
`,
}

const catalog = buildCatalog(FILES)

describe('buildCatalog', () => {
  it('草稿被剔除', () => {
    expect(catalog.some((p) => p.slug === 'draft')).toBe(false)
  })

  it('伴生文件合并到同一 slug，不产生重复 URL', () => {
    const slugs = catalog.map((p) => p.slug)
    expect(slugs.filter((s) => s === 'foo').length).toBe(1)
    const foo = catalog.find((p) => p.slug === 'foo')
    expect(foo?.locales.zh?.title).toBe('Foo 文章')
    expect(foo?.locales.en?.title).toBe('Foo Post')
    expect(foo?.lang).toBe('both')
    expect(foo?.path).toBe('/blog/foo/')
  })

  it('只有伴生文件也能发布，另一语言回退到这份正文', () => {
    const orphan = catalog.find((p) => p.slug === 'orphan')
    expect(orphan).toBeDefined()
    expect(orphan?.locales.en?.title).toBe('Orphan Post')
    // 无中文译文：zh 回退到 en 正文
    expect(orphan?.locales.zh?.title).toBe('Orphan Post')
  })

  it('按日期倒序排序，同日按 slug', () => {
    const dates = catalog.map((p) => p.date)
    expect(dates).toEqual([...dates].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0)))
  })
})

describe('localizePost / listForLocale', () => {
  it('zh 列表包含 both 与 zh 文章，排除纯 en', () => {
    const zhList = listForLocale(catalog, 'zh')
    const slugs = zhList.map((p) => p.slug)
    expect(slugs).toContain('foo')
    expect(slugs).toContain('bar')
    expect(slugs).toContain('orphan') // 只有伴生文件时 lang 提升为 both，zh 列表可见
  })

  it('foo 的 zh 视图取译文，英文视图取原文', () => {
    const zh = findPost(catalog, 'foo', 'zh')
    expect(zh?.title).toBe('Foo 文章')
    expect(zh?.contentHtml).toContain('中文正文')
    expect(zh?.locales.zh?.title).toBe('Foo 文章')

    const en = findPost(catalog, 'foo', 'en')
    expect(en?.title).toBe('Foo Post')
    expect(en?.contentHtml).toContain('English body')
  })

  it('正文首个 H1 与标题重复时被剥离（避免页面两个 H1）', () => {
    const en = findPost(catalog, 'foo', 'en')
    expect(en?.contentHtml.match(/<h1/g)).toBeNull()
    expect(en?.contentHtml).toContain('<h2 id="section-one">Section One</h2>')
  })

  it('没有译文时 translationMissing 为 true，标题回退 altMeta', () => {
    const barZh = findPost(catalog, 'bar', 'zh')
    expect(barZh?.translationMissing).toBe(false)
    // bar 是中文原文，无英文译文：en 视图 translationMissing
    const barEn = localizePost(barZh as NonNullable<typeof barZh>, 'en')
    expect(barEn.translationMissing).toBe(true)
    expect(barEn.title).toBe('Bar Post') // altMeta（title_en）兜底
  })
})

describe('adjacentPosts', () => {
  it('按语言列表返回相邻文章', () => {
    const zhList = listForLocale(catalog, 'zh').map((p) => p.slug)
    const idx = zhList.indexOf('foo')
    const { prev, next } = adjacentPosts(catalog, 'foo', 'zh')
    expect(prev?.slug).toBe(zhList[idx - 1])
    expect(next?.slug).toBe(zhList[idx + 1])
  })

  it('不存在的 slug 返回双 null', () => {
    expect(adjacentPosts(catalog, 'nope', 'zh')).toEqual({ prev: null, next: null })
  })
})

describe('tagCloud', () => {
  it('zh 列表聚合标签', () => {
    const tags = tagCloud(catalog, 'zh')
    expect(tags).toContain('人工智能')
    expect(tags).toContain('工具')
  })
})
