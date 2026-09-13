import { describe, expect, it } from 'vitest'
import { STATIC_PAGES } from '../data/site-pages'
import zh from '../i18n/locales/zh.json'

describe('静态页清单（预渲染外壳的单一事实来源）', () => {
  const services = STATIC_PAGES.find((p) => p.dir === 'services')

  it('服务页存在且生成外壳', () => {
    expect(services).toBeDefined()
    expect(services!.emitShell).toBe(true)
    expect(services!.path).toBe('/services/')
  })

  it('服务页结构化数据与「服务暂停」的页面文案一致，不含任何套餐', () => {
    const ld = services!.jsonLd as Record<string, unknown>
    expect(ld['@type']).toBe('ProfessionalService')
    expect(ld.name).toBe(zh.services.title)
    expect(ld.description).toBe(zh.services.subtitle)
    expect(ld).not.toHaveProperty('hasOfferCatalog')
    expect(ld).not.toHaveProperty('offers')
    expect(ld).not.toHaveProperty('serviceType')
    // 序列化后不得出现被删掉的套餐文案
    const serialized = JSON.stringify(ld)
    expect(serialized).not.toContain('OfferCatalog')
    expect(serialized).not.toContain('minPrice')
  })

  it('服务页 meta description 不再宣传已暂停的套餐', () => {
    expect(services!.desc).not.toContain('diagnose first')
    expect(services!.desc).toContain('暂停')
  })
})
