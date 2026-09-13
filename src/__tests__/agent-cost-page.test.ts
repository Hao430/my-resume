import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import AgentCostPage from '../pages/tools/AgentCostPage.vue'
import { PRICING_AS_OF } from '../utils/agent-cost'
import { makeI18n, resetDom } from './helpers'

const CJK = /[一-鿿]/

async function mountPage(locale: 'zh' | 'en' = 'zh') {
  const { i18n, composer } = makeI18n(locale)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/tools', name: 'tools', component: { template: '<div />' } },
      { path: '/tools/agent-cost', name: 'agent-cost', component: AgentCostPage },
    ],
  })
  router.push('/tools/agent-cost')
  await router.isReady()
  const wrapper = mount(AgentCostPage, { global: { plugins: [i18n, router] } })
  return { wrapper, composer }
}

/** .field__control 里第 0 个是模型下拉，随后依次是各数字输入 */
function numberInput(wrapper: ReturnType<typeof mount>, index: number) {
  const input = wrapper.findAll('input[type="number"]')[index]
  if (!input) throw new Error(`缺少第 ${index} 个数字输入`)
  return input
}

describe('Agent 成本计算器页面', () => {
  it('默认参数下给出不缓存与开缓存两个总价', async () => {
    resetDom()
    const { wrapper } = await mountPage()
    const values = wrapper.findAll('.result__value').map((n) => n.text())
    expect(values.length).toBeGreaterThanOrEqual(2)
    expect(values[0]).toMatch(/^\$\d+\.\d{4}$/)
    wrapper.unmount()
  })

  it('缓存生效时展示节省金额与百分比', async () => {
    resetDom()
    const { wrapper, composer } = await mountPage()
    expect(wrapper.text()).toContain(composer.t('tools.cost.saved'))
    expect(wrapper.find('.result__item--highlight').exists()).toBe(true)
    wrapper.unmount()
  })

  it('切到「不开启」后不再展示节省', async () => {
    resetDom()
    const { wrapper } = await mountPage()
    await wrapper.findAll('.mode input')[0]?.setValue(true)
    expect(wrapper.find('.result__item--highlight').exists()).toBe(false)
    wrapper.unmount()
  })

  it('提示单轮必然更贵、第几轮起回本', async () => {
    resetDom()
    const { wrapper } = await mountPage()
    const text = wrapper.find('.break-even').text()
    // 官方算法：5 分钟 TTL 两轮回本
    expect(text).toContain('2')
    expect(text).toContain('第 1 轮')
    wrapper.unmount()
  })
})

describe('静默失效必须直说，且不得展示虚假收益', () => {
  it('前缀低于该模型最低可缓存长度时给出警告，并且不显示任何节省', async () => {
    resetDom()
    const { wrapper } = await mountPage()
    // 默认前缀 2000，切到 Haiku 4.5（最低 4096）
    await wrapper.find('select').setValue('claude-haiku-4-5')

    expect(wrapper.find('.warnings').exists()).toBe(true)
    const warning = wrapper.find('.warning').text()
    expect(warning).toContain('2000')
    expect(warning).toContain('4096')

    // 关键：不能一边说缓存不生效、一边又显示省了钱
    expect(wrapper.find('.result__item--highlight').exists()).toBe(false)
    expect(wrapper.find('.break-even').exists()).toBe(false)
    wrapper.unmount()
  })

  it('每轮耗时超过 TTL 时给出过期警告', async () => {
    resetDom()
    const { wrapper } = await mountPage()
    // 第 5 个数字输入是「每轮耗时」，默认 TTL 为 5 分钟 = 300 秒
    await numberInput(wrapper, 4).setValue(400)
    expect(wrapper.find('.warning').text()).toContain('400')
    wrapper.unmount()
  })

  it('两个条件同时不满足时两条警告都出现', async () => {
    resetDom()
    const { wrapper } = await mountPage()
    await wrapper.find('select').setValue('claude-haiku-4-5')
    await numberInput(wrapper, 4).setValue(400)
    expect(wrapper.findAll('.warning')).toHaveLength(2)
    wrapper.unmount()
  })
})

describe('逐轮明细', () => {
  it('展示轮次与两种模式下的成本', async () => {
    resetDom()
    const { wrapper } = await mountPage()
    const rows = wrapper.findAll('.breakdown tbody tr')
    expect(rows.length).toBeGreaterThan(0)
    expect(rows[0]?.findAll('td')).toHaveLength(3)
    wrapper.unmount()
  })

  it('轮数很多时抽样展示，不会把页面撑爆', async () => {
    resetDom()
    const { wrapper } = await mountPage()
    await numberInput(wrapper, 0).setValue(200)
    const rows = wrapper.findAll('.breakdown tbody tr')
    expect(rows.length).toBeLessThanOrEqual(8)
    expect(rows.length).toBeGreaterThan(0)
    wrapper.unmount()
  })
})

describe('免责与溯源（算钱的工具，说清楚比算得准更重要）', () => {
  it('标注价格表快照日期', async () => {
    resetDom()
    const { wrapper } = await mountPage()
    expect(wrapper.find('.disclaimer').text()).toContain(PRICING_AS_OF)
    wrapper.unmount()
  })

  it('明说是估算、以 API 的 usage 为准，且不出现「精确」这类承诺', async () => {
    resetDom()
    const { wrapper } = await mountPage()
    const disclaimer = wrapper.find('.disclaimer').text()
    expect(disclaimer).toContain('估算')
    expect(disclaimer).toContain('usage')
    expect(wrapper.text()).not.toContain('精确')
    wrapper.unmount()
  })

  it('说明 token 数由用户提供，本工具不解析文本', async () => {
    resetDom()
    const { wrapper } = await mountPage()
    expect(wrapper.find('.hint').text()).toContain('token')
    wrapper.unmount()
  })
})

describe('i18n 与环境', () => {
  it('英文环境下整页不含中文', async () => {
    resetDom()
    const { wrapper } = await mountPage('en')
    expect(CJK.test(wrapper.find('.cost-page').text())).toBe(false)
    wrapper.unmount()
  })

  it('标注纯本地计算', async () => {
    resetDom()
    const { wrapper } = await mountPage()
    expect(wrapper.find('.offline-note').exists()).toBe(true)
    wrapper.unmount()
  })
})
