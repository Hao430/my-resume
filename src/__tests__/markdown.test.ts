import { describe, expect, it } from 'vitest'
import {
  buildToc,
  detectBodyLang,
  parseFrontmatter,
  pathToSlug,
  readingMinutes,
  renderMarkdown,
  slugifyHeading,
  toISODate,
  toPlainText,
} from '../utils/markdown'

describe('parseFrontmatter', () => {
  it('解析完整 frontmatter（snake_case + 内联数组）', () => {
    const { frontmatter, content } = parseFrontmatter(`---
title: 我的文章
title_en: My Post
description: 摘要
date: 2026-09-05
tags: [AI, 开发工具]
lang: both
draft: false
cover: /images/x.png
---
正文内容`)
    expect(frontmatter.title).toBe('我的文章')
    expect(frontmatter.titleEn).toBe('My Post')
    expect(frontmatter.description).toBe('摘要')
    expect(frontmatter.date).toBe('2026-09-05')
    expect(frontmatter.tags).toEqual(['AI', '开发工具'])
    expect(frontmatter.lang).toBe('both')
    expect(frontmatter.draft).toBe(false)
    expect(frontmatter.cover).toBe('/images/x.png')
    expect(content).toBe('正文内容')
  })

  it('兼容 camelCase 别名和 desc/summary 别名', () => {
    const { frontmatter } = parseFrontmatter(`---
title: T
titleEn: TE
descriptionEn: DE
desc: D
---`)
    expect(frontmatter.titleEn).toBe('TE')
    expect(frontmatter.descriptionEn).toBe('DE')
    expect(frontmatter.description).toBe('D')
  })

  it('多行数组语法', () => {
    const { frontmatter } = parseFrontmatter(`---
title: T
tags:
  - AI
  - 开发
legacy:
  - /旧页面.html
---`)
    expect(frontmatter.tags).toEqual(['AI', '开发'])
    expect(frontmatter.legacy).toEqual(['/旧页面.html'])
  })

  it('无 frontmatter 时返回空默认值', () => {
    const { frontmatter, content } = parseFrontmatter('只有正文')
    expect(frontmatter.title).toBe('')
    expect(frontmatter.lang).toBe('both')
    expect(frontmatter.draft).toBe(false)
    expect(content).toBe('只有正文')
  })

  it('draft 布尔解析：true/1/yes/空 均为真', () => {
    for (const v of ['true', '1', 'yes', '']) {
      const { frontmatter } = parseFrontmatter(`---\ntitle: T\ndraft: ${v}\n---`)
      expect(frontmatter.draft).toBe(true)
    }
    const { frontmatter } = parseFrontmatter(`---\ntitle: T\ndraft: false\n---`)
    expect(frontmatter.draft).toBe(false)
  })

  it('lang 只接受 zh/en，其余归为 both', () => {
    expect(parseFrontmatter(`---\ntitle: T\nlang: zh\n---`).frontmatter.lang).toBe('zh')
    expect(parseFrontmatter(`---\ntitle: T\nlang: en\n---`).frontmatter.lang).toBe('en')
    expect(parseFrontmatter(`---\ntitle: T\nlang: fr\n---`).frontmatter.lang).toBe('both')
  })
})

describe('pathToSlug', () => {
  it('从路径提取 slug', () => {
    expect(pathToSlug('content/posts/my-post.md')).toBe('my-post')
    expect(pathToSlug('content/posts/我的文章.md')).toBe('我的文章')
  })
})

describe('detectBodyLang', () => {
  it('CJK 占比高判为 zh，否则 en', () => {
    expect(detectBodyLang('这是一段中文正文内容，用于测试语言检测。')).toBe('zh')
    expect(detectBodyLang('This is an English paragraph for language detection.')).toBe('en')
    expect(detectBodyLang('中英 mixed text 混合')).toBe('zh')
  })
})

describe('readingMinutes', () => {
  it('中文按 400 字/分钟，英文按 220 词/分钟，下限 1', () => {
    expect(readingMinutes('短')).toBe(1)
    expect(readingMinutes('a '.repeat(300))).toBe(1) // 300 词 / 220 ≈ 1.36 → 1
    const cjkMin = readingMinutes('字'.repeat(600))
    expect(cjkMin).toBe(2) // 600/400 = 1.5 → round = 2
  })
})

describe('slugifyHeading', () => {
  it('CJK 标题保留汉字，空格转短横线，去掉符号', () => {
    expect(slugifyHeading('Hello World')).toBe('hello-world')
    expect(slugifyHeading('AI 时代')).toBe('ai-时代')
    expect(slugifyHeading('a/b & c')).toBe('ab--c') // 移除符号后保留空格转换的短横线
  })
})

describe('renderMarkdown', () => {
  it('标题自动加锚点 id（含中文）', () => {
    const html = renderMarkdown('## 我的标题')
    expect(html).toContain('<h2 id="我的标题">我的标题</h2>')
  })

  it('外链自动补 target=_blank 与 rel', () => {
    const html = renderMarkdown('[链接](https://example.com)')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('内链不加 target（站内导航）', () => {
    const html = renderMarkdown('[站内](/blog/foo/)')
    expect(html).not.toContain('target="_blank"')
  })

  it('内嵌 HTML 被禁用（html: false）', () => {
    const html = renderMarkdown('<script>alert(1)</script>')
    expect(html).not.toContain('<script>')
  })

  it('图片自动懒加载', () => {
    const html = renderMarkdown('![图](/images/a.png)')
    expect(html).toContain('loading="lazy"')
  })
})

describe('buildToc', () => {
  it('只收 h2/h3，忽略 h1 与 h4+', () => {
    const toc = buildToc(`# H1
## 第一节
### 1.1 小节
#### 太深
## 第二节`)
    expect(toc).toEqual([
      { id: '第一节', text: '第一节', level: 2 },
      { id: '11-小节', text: '1.1 小节', level: 3 },
      { id: '第二节', text: '第二节', level: 2 },
    ])
  })

  it('去 markdown 强调符号', () => {
    const toc = buildToc('## *斜体* 与 **粗体**')
    expect(toc[0]?.text).toBe('斜体 与 粗体')
  })
})

describe('toPlainText', () => {
  it('剥掉链接、图片、代码块、标题符号', () => {
    const text = toPlainText(
      '# 标题\n正文 [链接](https://x.com) ![图](/a.png) `code` 结尾',
    )
    expect(text).not.toContain('#')
    expect(text).not.toContain('](')
    expect(text).not.toContain('`')
    expect(text).toContain('链接')
  })
})

describe('toISODate', () => {
  it('归一化紧凑/斜杠日期，非法返回空串', () => {
    expect(toISODate('20260905')).toBe('2026-09-05')
    expect(toISODate('2026/09/05')).toBe('2026-09-05')
    expect(toISODate('2026-09-05T10:00:00Z')).toBe('2026-09-05')
    expect(toISODate('not-a-date')).toBe('')
    expect(toISODate('')).toBe('')
    expect(toISODate('', '2026-01-01')).toBe('2026-01-01')
  })
})
