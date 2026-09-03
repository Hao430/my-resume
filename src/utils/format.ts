/** 日期 / 文本展示格式化工具（浏览器与 Node 共用） */

function normalizeLocale(locale: string): 'zh' | 'en' {
  return locale.startsWith('en') ? 'en' : 'zh'
}

/** YYYY-MM-DD → 本地化日期；解析失败时原样返回 */
export function formatDate(date: string, locale = 'zh'): string {
  if (!date) return ''
  const parsed = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat(normalizeLocale(locale) === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: normalizeLocale(locale) === 'zh' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parsed)
}

/** RFC 822 时间（RSS pubDate） */
export function toRfc822(date: string): string {
  const parsed = new Date(`${date}T12:00:00+08:00`)
  if (Number.isNaN(parsed.getTime())) return new Date().toUTCString()
  return parsed.toUTCString()
}

/** XML 转义 */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** HTML 属性转义（head meta 注入用） */
export function escapeAttr(value: string): string {
  return escapeXml(value)
}
