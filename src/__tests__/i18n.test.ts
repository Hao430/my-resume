import { describe, expect, it } from 'vitest'
import zh from '../i18n/locales/zh.json'
import en from '../i18n/locales/en.json'

/** 递归取扁平键（与站点运行时的展示路径一致） */
function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenKeys(value as Record<string, unknown>, path)
    }
    return [path]
  })
}

describe('i18n 双语键一致性（规则 #6）', () => {
  it('zh 与 en 键完全一一对应，无缺键', () => {
    const zhKeys = flattenKeys(zh as unknown as Record<string, unknown>).sort()
    const enKeys = flattenKeys(en as unknown as Record<string, unknown>).sort()
    expect(zhKeys).toEqual(enKeys)
  })

  it('语言切换依赖的核心键不为空', () => {
    for (const key of [
      'nav.home',
      'nav.about',
      'nav.blog',
      'nav.services',
      'nav.dailyBrief',
      'nav.contact',
      'nav.menu',
      'services.mailSubject',
      'services.ctaButton',
      'seo.home',
      'seo.services',
    ]) {
      const zhValue = key.split('.').reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], zh)
      const enValue = key.split('.').reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], en)
      expect(String(zhValue), `zh.${key}`).not.toBe('')
      expect(String(enValue), `en.${key}`).not.toBe('')
    }
  })

  it('站点名不带裸 |（vue-i18n 复数分隔符陷阱，规则 #5）', () => {
    // 站点名通过 site.ts 常量拼接，i18n 文件里不应出现裸 |
    const zhRaw = JSON.stringify(zh)
    const enRaw = JSON.stringify(en)
    // 允许的 | 仅在确实需要竖线的文案里；当前站点名不在此列
    expect(zhRaw).not.toMatch(/\|[^|]+\|/)
    expect(enRaw).not.toMatch(/\|[^|]+\|/)
  })
})
