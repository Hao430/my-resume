import { describe, expect, it } from 'vitest'
import {
  cleanText,
  collapseBlankLines,
  htmlToMarkdown,
  normalizeCjkPunctuation,
  removeEmoji,
  stripHtmlTags,
  stripMarkdown,
  toFullWidth,
  toHalfWidth,
  trimLines,
} from '../utils/text-clean'

describe('stripMarkdown', () => {
  it('去掉标题、引用与列表标记，保留文字', () => {
    expect(stripMarkdown('# 标题\n> 引用\n- 项目一\n1. 项目二')).toBe('标题\n引用\n项目一\n项目二')
  })

  it('去掉粗体、斜体与删除线', () => {
    expect(stripMarkdown('**粗** 与 *斜* 与 ~~删~~')).toBe('粗 与 斜 与 删')
  })

  it('链接保留文字，图片保留 alt', () => {
    expect(stripMarkdown('见 [文档](https://a.com) 与 ![图示](https://b.com/x.png)')).toBe(
      '见 文档 与 图示',
    )
  })

  it('代码块只去围栏，保留内容', () => {
    // stripMarkdown 只负责去语法：围栏行留下的空行归 trimLines / collapseBlankLines 处理
    expect(stripMarkdown('```ts\nconst a = 1\n```')).toBe('\nconst a = 1\n')
    expect(stripMarkdown('行内 `code` 保留')).toBe('行内 code 保留')
  })

  it('代码块经完整管线后得到干净的代码文本', () => {
    expect(cleanText('```ts\nconst a = 1\n```')).toBe('const a = 1')
  })

  it('不破坏 snake_case 与文件名这类下划线标识符', () => {
    expect(stripMarkdown('变量 user_id 与 file_name.txt 应原样保留')).toBe(
      '变量 user_id 与 file_name.txt 应原样保留',
    )
  })

  it('水平线整行移除，不被误当成列表项', () => {
    expect(stripMarkdown('上文\n\n---\n\n下文')).toBe('上文\n\n\n\n下文')
  })

  it('表格去掉分隔行并把管道换成空格', () => {
    expect(stripMarkdown('| 名称 | 值 |\n|---|---|\n| a | 1 |')).toBe('名称  值\n\na  1')
  })

  it('还原转义字符', () => {
    expect(stripMarkdown('字面量 \\* 不是斜体')).toBe('字面量 * 不是斜体')
  })
})

describe('removeEmoji', () => {
  it('去掉常见 emoji 与变体选择符', () => {
    expect(removeEmoji('完成 ✅ 啦 🎉')).toBe('完成  啦 ')
  })

  it('去掉带肤色修饰与零宽连接符的组合 emoji', () => {
    expect(removeEmoji('a 👍🏽 b 👨👩👧 c')).toBe('a  b  c')
  })

  it('保留中日韩文字与普通符号', () => {
    expect(removeEmoji('中文（括号）与 — 破折号 100%')).toBe('中文（括号）与 — 破折号 100%')
  })
})

describe('stripHtmlTags', () => {
  it('块级标签转换行，行内标签直接去掉', () => {
    expect(stripHtmlTags('<p>第一段</p><p>第二段</p>')).toBe('第一段\n第二段\n')
    expect(stripHtmlTags('<strong>粗</strong>体')).toBe('粗体')
  })

  it('丢弃 script 与 style 内容，并解码实体', () => {
    expect(stripHtmlTags('<script>bad()</script><style>.a{}</style>a &amp; b &lt;c&gt;')).toBe(
      'a & b <c>',
    )
  })
})

describe('空白处理', () => {
  it('压缩连续空行到指定的最大数量', () => {
    expect(collapseBlankLines('a\n\n\n\n\nb')).toBe('a\n\nb')
    expect(collapseBlankLines('a\n\n\n\nb', 0)).toBe('a\nb')
  })

  it('trimLines 去行首尾空白与整段首尾空行', () => {
    expect(trimLines('\n\n  a  \n   b\t\n\n')).toBe('a\nb')
  })
})

describe('标点与全半角', () => {
  it('半角标点仅在中日韩字符之后才转全角', () => {
    expect(normalizeCjkPunctuation('你好,世界.')).toBe('你好，世界。')
    expect(normalizeCjkPunctuation('我说:好的!')).toBe('我说：好的！')
  })

  it('英文句子里的半角标点不受影响', () => {
    expect(normalizeCjkPunctuation('Hello, world. It works!')).toBe('Hello, world. It works!')
  })

  it('全角与半角互转', () => {
    expect(toHalfWidth('ＡＢＣ１２３')).toBe('ABC123')
    expect(toFullWidth('ABC123')).toBe('ＡＢＣ１２３')
  })
})

describe('htmlToMarkdown', () => {
  it('标题、段落与行内强调', () => {
    expect(htmlToMarkdown('<h2>标题</h2><p>正文 <strong>粗</strong> 与 <em>斜</em></p>')).toBe(
      '## 标题\n\n正文 **粗** 与 *斜*',
    )
  })

  it('链接、图片与行内代码', () => {
    expect(htmlToMarkdown('<a href="https://a.com">文档</a> <code>x=1</code>')).toBe(
      '[文档](https://a.com) `x=1`',
    )
    expect(htmlToMarkdown('<img src="/a.png" alt="图">')).toBe('![图](/a.png)')
  })

  it('代码块保留缩进与换行', () => {
    expect(htmlToMarkdown('<pre><code>a\n  b</code></pre>')).toBe('```\na\n  b\n```')
  })

  it('有序与无序列表', () => {
    expect(htmlToMarkdown('<ul><li>甲</li><li>乙</li></ul>')).toBe('- 甲\n- 乙')
    expect(htmlToMarkdown('<ol><li>甲</li><li>乙</li></ol>')).toBe('1. 甲\n2. 乙')
  })

  it('表格生成表头分隔行', () => {
    expect(htmlToMarkdown('<table><tr><th>a</th><th>b</th></tr><tr><td>1</td><td>2</td></tr></table>')).toBe(
      '| a | b |\n| --- | --- |\n| 1 | 2 |',
    )
  })

  it('丢弃 script/style，纯锚点不产生链接', () => {
    expect(htmlToMarkdown('<script>bad()</script><p>ok</p>')).toBe('ok')
    expect(htmlToMarkdown('<a href="#s">跳转</a>')).toBe('跳转')
  })

  it('与 stripMarkdown 互为逆向：HTML → MD → 纯文本', () => {
    const html = '<h1>标题</h1><p>见 <a href="https://a.com">文档</a></p>'
    expect(stripMarkdown(htmlToMarkdown(html))).toBe('标题\n\n见 文档')
  })
})

describe('cleanText 组合清理', () => {
  it('按默认选项清理一段典型的 AI 输出', () => {
    const input = '## 结论 🎉\n\n\n\n1. **要点**：见 [文档](https://a.com)\n\n\n'
    expect(cleanText(input)).toBe('结论\n\n要点：见 文档')
  })

  it('先剥 HTML 再剥 Markdown（AI 输出常是 HTML 里嵌 Markdown）', () => {
    const input = '<p>## 标题</p><p>正文 <code>**未闭合</code></p>'
    expect(cleanText(input, { stripHtml: true })).toBe('标题\n正文 **未闭合')
  })

  it('标点规范化在末尾执行，不会与其它步骤互相干扰', () => {
    expect(cleanText('你好,世界.', { normalizeCjkPunctuation: true })).toBe('你好，世界。')
  })

  it('选项可单独关闭', () => {
    expect(cleanText('**粗** 🎉', { removeEmoji: false })).toBe('粗 🎉')
    expect(cleanText('**粗** 🎉', { stripMarkdown: false, removeEmoji: false })).toBe('**粗** 🎉')
  })
})
