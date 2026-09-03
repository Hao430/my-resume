import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import ServicesPage from '../pages/ServicesPage.vue'
import { makeI18n, resetDom } from './helpers'

async function mountServices(locale: 'zh' | 'en' = 'zh') {
  const { i18n, composer } = makeI18n(locale)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/services', name: 'services', component: ServicesPage }],
  })
  router.push('/services')
  await router.isReady()
  const wrapper = mount(ServicesPage, {
    global: { plugins: [i18n, router] },
  })
  return { wrapper, i18n, composer }
}

describe('ServicesPage（服务落地页）', () => {
  it('渲染两项服务卡片（01 / 02）', async () => {
    resetDom()
    const { wrapper } = await mountServices()
    const cards = wrapper.findAll('.service-card')
    expect(cards).toHaveLength(2)
    expect(wrapper.find('.service-card__head .badge--vermilion').text()).toBe('01')
    expect(wrapper.find('.service-card__head .badge--jade').text()).toBe('02')
    wrapper.unmount()
  })

  it('CTA 按钮构造正确的 mailto（带主题模板，中文）', async () => {
    resetDom()
    const { wrapper, composer } = await mountServices('zh')
    const cta = wrapper.find('a.btn--primary')
    const subject = composer.t('services.mailSubject')
    expect(cta.attributes('href')).toBe(
      `mailto:fervent430@163.com?subject=${encodeURIComponent(subject)}`,
    )
    expect(cta.text()).toBe('发邮件预约')
    wrapper.unmount()
  })

  it('服务卖点不泄漏裸 i18n key（2026-09-05 修复：aPoints/bPoints 拆键）', async () => {
    resetDom()
    const { wrapper, composer } = await mountServices('zh')
    const lis = wrapper.findAll('.service-card__points li')
    expect(lis).toHaveLength(6)
    const texts = lis.map((li) => li.text())
    expect(texts.some((t) => t.startsWith('services.') || t.includes(' aPoints'))).toBe(false)
    expect(texts[0]).toBe(composer.t('services.aPoints1'))
    expect(texts[3]).toBe(composer.t('services.bPoints1'))
    wrapper.unmount()
  })

  it('英文环境下 CTA 标题与主题均切换为英文', async () => {
    resetDom()
    const { wrapper, composer } = await mountServices('en')
    const cta = wrapper.find('a.btn--primary')
    const subject = composer.t('services.mailSubject')
    expect(cta.attributes('href')).toContain(encodeURIComponent(subject))
    expect(cta.text()).toBe('Email to book')
    expect(wrapper.find('.page-header__title').text()).toBe(composer.t('services.title'))
    wrapper.unmount()
  })

  it('SEO：写入页面 title 与 canonical（带尾斜杠）', async () => {
    resetDom()
    const { wrapper, composer } = await mountServices('zh')
    const site = '张豪 | 技术人文空间'
    expect(document.title).toBe(`${composer.t('seo.services')} | ${site}`)
    const canonical = document.head.querySelector('link[rel="canonical"]')
    expect(canonical?.getAttribute('href')).toBe('https://hao430.cn/services/')
    wrapper.unmount()
  })
})
