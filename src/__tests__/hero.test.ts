import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import Hero from '../components/Hero.vue'
import { makeI18n, resetDom } from './helpers'

/**
 * 首页 h1 的护栏
 * ------------------------------------------------------------
 * 2026-09-15 SEO/GEO 审计报「缺少 h1 标记」（静态 HTML 里根本没有，兜底见
 * build/static-site.ts 的 injectNoScriptFallback）与「标题太短」。
 * 顺带发现：能跑 JS 的抓取器拿到的 h1 只有字号「墨砚斋」3 个字，不含任何
 * 可读信息。这里锁住「Hero 内只有一个 h1，且必须带姓名与定位」。
 */
function mountHero(locale: 'zh' | 'en' = 'zh') {
  const { i18n } = makeI18n(locale)
  return mount(Hero, {
    global: { plugins: [i18n], stubs: { RouterLink: RouterLinkStub } },
  })
}

describe('首页 Hero 的 h1', () => {
  it('Hero 内只有一个 h1', () => {
    resetDom()
    const wrapper = mountHero()
    expect(wrapper.findAll('h1')).toHaveLength(1)
    wrapper.unmount()
  })

  it('中文 h1 同时含品牌、姓名与定位，而不是只有「墨砚斋」', () => {
    resetDom()
    const wrapper = mountHero('zh')
    const text = wrapper.find('h1').text()
    expect(text).toContain('墨砚斋')
    expect(text).toContain('张豪')
    expect(text).toContain('技术顾问')
    wrapper.unmount()
  })

  it('英文站同样给出带姓名的描述性 h1', () => {
    resetDom()
    const wrapper = mountHero('en')
    const text = wrapper.find('h1').text()
    expect(text).toContain('Hao430')
    expect(text).toContain('Hao Zhang')
    wrapper.unmount()
  })
})
