/**
 * AI 输出清理（纯函数，零依赖）
 * ------------------------------------------------------------
 * 处理对象是「从 ChatGPT / Claude / Notion 等复制出来的富文本或 Markdown」，
 * 目标是转成能直接贴进公众号、知乎、Word、邮件编辑器的干净文本。
 *
 * 全部为同步纯函数：便于单测，也保证工具页可以完全离线运行（无任何网络请求）。
 */

const CJK_RANGE = '\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff'

/** 全角 ASCII（U+FF01 ！ 到 U+FF5E ～）与半角 ASCII（! 到 ~）的码位差 */
const FULLWIDTH_OFFSET = 0xfee0

/** 去掉 Markdown 语法，只保留可读文本（链接留文字、图片留 alt、代码块留内容） */
export function stripMarkdown(input: string): string {
  let out = input

  // 代码块围栏 ```lang / ``` —— 只去围栏，保留代码内容
  out = out.replace(/^[ \t]*```[^\n]*$/gm, '')
  // 行内代码
  out = out.replace(/`([^`\n]+)`/g, '$1')
  // 图片 ![alt](url) → alt
  out = out.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
  // 链接 [text](url) → text
  out = out.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  // 引用块
  out = out.replace(/^[ \t]*>[ \t]?/gm, '')
  // ATX 标题
  out = out.replace(/^[ \t]*#{1,6}[ \t]+/gm, '')
  // 水平线（须在无序列表之前处理，否则 --- 会被当成列表项）
  out = out.replace(/^[ \t]*([-*_])[ \t]*(?:\1[ \t]*){2,}$/gm, '')
  // 无序列表
  out = out.replace(/^[ \t]*[-*+][ \t]+/gm, '')
  // 有序列表
  out = out.replace(/^[ \t]*\d+[.)][ \t]+/gm, '')
  // 粗体 / 删除线先于斜体，避免 ** 被拆成两个 *
  out = out.replace(/(\*\*|__)(?=\S)([\s\S]*?\S)\1/g, '$2')
  out = out.replace(/~~(?=\S)([\s\S]*?\S)~~/g, '$1')
  // 斜体：* 任意位置，_ 仅在词边界（避免破坏 snake_case 这类标识符）
  out = out.replace(/\*(?=\S)([^*\n]*?\S)\*/g, '$1')
  out = out.replace(/(?<![A-Za-z0-9_])_(?=\S)([^_\n]*?\S)_(?![A-Za-z0-9_])/g, '$1')
  // 表格分隔行 |---|---|
  out = out.replace(/^[ \t]*\|?[ \t]*:?-{2,}:?[ \t]*(?:\|[ \t]*:?-{2,}:?[ \t]*)*\|?[ \t]*$/gm, '')
  // 表格数据行：管道换成两个空格
  out = out.replace(/^[ \t]*\|(.+)\|[ \t]*$/gm, (_m, row: string) =>
    row
      .split('|')
      .map((cell) => cell.trim())
      .join('  '),
  )
  // 反转义
  out = out.replace(/\\([\\`*_{}[\]()#+\-.!|>~])/g, '$1')

  return out
}

/** 去掉 emoji（含肤色修饰、变体选择符与零宽连接符） */
export function removeEmoji(input: string): string {
  return input
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '')
    .replace(/[︎️‍]/g, '')
}

/** 去掉 HTML 标签与常见实体；块级标签转为换行 */
export function stripHtmlTags(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|tr|blockquote|section|article)\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&')
}

/** 压缩连续空行：maxBlank 为允许保留的最大连续空行数 */
export function collapseBlankLines(input: string, maxBlank = 1): string {
  const limit = Math.max(0, maxBlank)
  return input.replace(/\n{3,}/g, '\n'.repeat(limit + 1))
}

/** 去每行首尾空白，并去掉整段首尾空行（缩进对纯文本无意义） */
export function trimLines(input: string): string {
  return input
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/^\n+|\n+$/g, '')
}

/** 全角 → 半角（主要用于 AI 输出的全角数字/字母，如 １２３ ＡＢＣ） */
export function toHalfWidth(input: string): string {
  return input.replace(/[！-～]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - FULLWIDTH_OFFSET),
  ).replace(/　/g, ' ')
}

/** 半角 → 全角（同上，反向） */
export function toFullWidth(input: string): string {
  return input.replace(/[!-~]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + FULLWIDTH_OFFSET),
  ).replace(/ /g, '　')
}

/**
 * 中文标点规范化：仅当半角标点**紧跟在中日韩字符之后**时才转全角。
 * 这样英文句子里的逗号句号不受影响，而「你好,世界.」会变成「你好，世界。」
 */
export function normalizeCjkPunctuation(input: string): string {
  const map: Record<string, string> = {
    ',': '，',
    '.': '。',
    '?': '？',
    '!': '！',
    ':': '：',
    ';': '；',
  }
  return input.replace(
    new RegExp(`([${CJK_RANGE}])[ \\t]*([,.?!:;])`, 'g'),
    (_m, cjk: string, punct: string) => cjk + (map[punct] ?? punct),
  )
}

/* ---------------- HTML → Markdown ---------------- */

/**
 * 依赖浏览器原生 DOMParser（测试环境由 happy-dom 提供），因此本模块其余部分虽是
 * 纯函数，这一个例外需要 DOM。只在浏览器侧调用，构建期不碰。
 */
function serializeNode(node: Node, listDepth = 0): string {
  if (node.nodeType === 3 /* text */) return (node.textContent ?? '').replace(/\s+/g, ' ')
  if (node.nodeType !== 1 /* element */) return ''

  const el = node as Element
  const tag = el.tagName.toLowerCase()
  const inner = () =>
    Array.from(el.childNodes)
      .map((child) => serializeNode(child, listDepth))
      .join('')

  switch (tag) {
    case 'script':
    case 'style':
    case 'noscript':
      return ''
    case 'br':
      return '\n'
    case 'hr':
      return '\n\n---\n\n'
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return `\n\n${'#'.repeat(Number(tag[1]))} ${inner().trim()}\n\n`
    case 'p':
    case 'div':
    case 'section':
    case 'article':
      return `\n\n${inner().trim()}\n\n`
    case 'strong':
    case 'b':
      return inner().trim() ? `**${inner().trim()}**` : ''
    case 'em':
    case 'i':
      return inner().trim() ? `*${inner().trim()}*` : ''
    case 'del':
    case 's':
      return inner().trim() ? `~~${inner().trim()}~~` : ''
    case 'code':
      return el.closest('pre') ? el.textContent ?? '' : `\`${el.textContent ?? ''}\``
    case 'pre': {
      const code = el.textContent ?? ''
      return `\n\n\`\`\`\n${code.replace(/\n+$/, '')}\n\`\`\`\n\n`
    }
    case 'a': {
      const text = inner().trim()
      const href = el.getAttribute('href') ?? ''
      if (!href || href.startsWith('#')) return text
      return text ? `[${text}](${href})` : ''
    }
    case 'img': {
      const alt = el.getAttribute('alt') ?? ''
      const src = el.getAttribute('src') ?? ''
      return src ? `![${alt}](${src})` : ''
    }
    case 'ul':
    case 'ol': {
      const ordered = tag === 'ol'
      let index = 1
      const items = Array.from(el.children)
        .filter((child) => child.tagName.toLowerCase() === 'li')
        .map((li) => {
          const marker = ordered ? `${index++}. ` : '- '
          const body = serializeNode(li, listDepth + 1).trim().replace(/\n/g, '\n  ')
          return `${'  '.repeat(listDepth)}${marker}${body}`
        })
      return `\n\n${items.join('\n')}\n\n`
    }
    case 'blockquote':
      return `\n\n${inner()
        .trim()
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n')}\n\n`
    case 'tr': {
      const cells = Array.from(el.children).map((cell) => serializeNode(cell, listDepth).trim())
      return `| ${cells.join(' | ')} |\n`
    }
    case 'thead':
    case 'tbody':
      return inner()
    case 'table': {
      const rows = Array.from(el.querySelectorAll('tr')).map((tr) =>
        Array.from(tr.children).map((cell) => serializeNode(cell, listDepth).trim().replace(/\n/g, ' ')),
      )
      const head = rows[0]
      if (!head) return ''
      const sep = head.map(() => '---')
      const fmt = (cells: string[]) => `| ${cells.join(' | ')} |`
      return `\n\n${[fmt(head), fmt(sep), ...rows.slice(1).map(fmt)].join('\n')}\n\n`
    }
    default:
      return inner()
  }
}

/** 把 HTML 片段转成 Markdown（覆盖标题、段落、强调、代码、链接、图片、列表、引用、表格） */
export function htmlToMarkdown(html: string): string {
  if (typeof DOMParser === 'undefined') return stripHtmlTags(html)
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return serializeNode(doc.body)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export interface CleanOptions {
  /** 去掉 Markdown 语法 */
  stripMarkdown: boolean
  /** 去掉 emoji */
  removeEmoji: boolean
  /** 去掉 HTML 标签 */
  stripHtml: boolean
  /** 压缩连续空行 */
  collapseBlankLines: boolean
  /** 去每行首尾空白 */
  trimLines: boolean
  /** 中文标点规范化（半角→全角） */
  normalizeCjkPunctuation: boolean
  /** 全角英数与字母 → 半角 */
  halfWidthAscii: boolean
}

export const DEFAULT_CLEAN_OPTIONS: CleanOptions = {
  stripMarkdown: true,
  removeEmoji: true,
  stripHtml: false,
  collapseBlankLines: true,
  trimLines: true,
  normalizeCjkPunctuation: false,
  halfWidthAscii: false,
}

/**
 * 按选项顺序执行清理。顺序有意为之：
 * 先剥 HTML 再剥 Markdown（AI 输出常是 HTML 里嵌 Markdown），
 * 标点规范化放在末尾，避免中间步骤产生的符号被二次转换。
 */
export function cleanText(input: string, options: Partial<CleanOptions> = {}): string {
  const opts = { ...DEFAULT_CLEAN_OPTIONS, ...options }
  let out = input
  if (opts.stripHtml) out = stripHtmlTags(out)
  if (opts.stripMarkdown) out = stripMarkdown(out)
  if (opts.removeEmoji) out = removeEmoji(out)
  if (opts.halfWidthAscii) out = toHalfWidth(out)
  if (opts.normalizeCjkPunctuation) out = normalizeCjkPunctuation(out)
  if (opts.trimLines) out = trimLines(out)
  if (opts.collapseBlankLines) out = collapseBlankLines(out)
  return out
}
