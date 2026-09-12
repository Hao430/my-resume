import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ToolsPage from '../pages/ToolsPage.vue'
import { makeI18n, resetDom } from './helpers'

function mountTools(locale: 'zh' | 'en' = 'zh') {
  const { i18n, composer } = makeI18n(locale)
  const wrapper = mount(ToolsPage, { global: { plugins: [i18n] } })
  return { wrapper, composer }
}

/** CJK 统一表意文字：英文页面里出现即说明文案被硬编码进了组件 */
const CJK = /[一-鿿]/

describe('ToolsPage（工具页）', () => {
  it('工具标题与描述来自 i18n', () => {
    resetDom()
    const { wrapper, composer } = mountTools('zh')
    const titles = wrapper.findAll('.tool-card__title').map((n) => n.text())
    expect(titles).toEqual([
      composer.t('tools.items.agentContext.title'),
      composer.t('tools.items.codeSecurityChecker.title'),
      composer.t('tools.items.markdownCleaner.title'),
    ])
    wrapper.unmount()
  })

  it('英文环境下整页不含中文（回归：此前文案硬编码在组件里）', () => {
    resetDom()
    const { wrapper } = mountTools('en')
    expect(CJK.test(wrapper.find('.tools-page').text())).toBe(false)
    wrapper.unmount()
  })

  it('三态状态各自有独立文案，planned 不再冒充「实验构建中」', () => {
    resetDom()
    const { wrapper, composer } = mountTools('zh')
    expect(composer.t('tools.statusPlanned')).not.toBe(composer.t('tools.statusWip'))
    const statuses = wrapper.findAll('.tool-card__header .badge').map((n) => n.text())
    expect(statuses).toEqual([
      composer.t('tools.statusWip'),
      composer.t('tools.statusPlanned'),
      composer.t('tools.statusPlanned'),
    ])
    wrapper.unmount()
  })

  it('外链卡片与 eyebrow 文案走 i18n', () => {
    resetDom()
    const { wrapper, composer } = mountTools('en')
    const linkTitles = wrapper.findAll('.link-card__title').map((n) => n.text())
    expect(linkTitles).toEqual([
      composer.t('tools.links.repos.title'),
      composer.t('tools.links.research.title'),
      composer.t('tools.links.advisory.title'),
    ])
    const eyebrows = wrapper.findAll('.section-head__eyebrow').map((n) => n.text())
    expect(eyebrows).toEqual([composer.t('tools.craftsEyebrow'), composer.t('tools.linksEyebrow')])
    wrapper.unmount()
  })
})
