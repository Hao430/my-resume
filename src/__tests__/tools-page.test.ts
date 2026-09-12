import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import ToolsPage from '../pages/ToolsPage.vue'
import { TOOLS, LIVE_TOOLS, toolPath } from '../data/tools'
import { makeI18n, resetDom } from './helpers'

function mountTools(locale: 'zh' | 'en' = 'zh') {
  const { i18n, composer } = makeI18n(locale)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/tools', name: 'tools', component: ToolsPage },
      { path: '/tools/:slug', name: 'tool', component: { template: '<div />' } },
    ],
  })
  const wrapper = mount(ToolsPage, { global: { plugins: [i18n, router] } })
  return { wrapper, composer }
}

/** 卡片顺序必须与 src/data/tools.ts 一致，避免两处清单漂移 */
const ORDER = TOOLS.map((tool) => tool.i18nKey)

/** 独立于组件维护一份三态映射：否则组件写错键、测试也跟着错 */
const STATUS_KEY: Record<(typeof TOOLS)[number]['status'], string> = {
  active: 'tools.statusActive',
  wip: 'tools.statusWip',
  planned: 'tools.statusPlanned',
}

/** CJK 统一表意文字：英文页面里出现即说明文案被硬编码进了组件 */
const CJK = /[一-鿿]/

describe('ToolsPage（工具页）', () => {
  it('工具标题与描述来自 i18n，且顺序与 tools.ts 一致', () => {
    resetDom()
    const { wrapper, composer } = mountTools('zh')
    const titles = wrapper.findAll('.tool-card__title').map((n) => n.text())
    expect(titles).toEqual(ORDER.map((key) => composer.t(`tools.items.${key}.title`)))
    wrapper.unmount()
  })

  it('已上线的工具给出可点链接，未上线的显示「即将上线」', () => {
    resetDom()
    const { wrapper, composer } = mountTools('zh')
    const cards = wrapper.findAll('.tool-card')
    expect(cards).toHaveLength(TOOLS.length)
    expect(LIVE_TOOLS.length).toBeGreaterThan(0)

    cards.forEach((card, index) => {
      const tool = TOOLS[index]
      if (!tool) throw new Error(`缺少第 ${index} 个工具的元数据`)
      const link = card.find('.tool-card__action')
      if (tool.status === 'active') {
        expect(link.attributes('href')).toBe(toolPath(tool))
      } else {
        expect(link.exists()).toBe(false)
        expect(card.find('.tool-card__pending').text()).toBe(composer.t('tools.comingSoon'))
      }
    })
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
    expect(statuses).toEqual(TOOLS.map((tool) => composer.t(STATUS_KEY[tool.status])))
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
