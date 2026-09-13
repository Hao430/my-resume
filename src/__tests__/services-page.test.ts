import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import ServicesPage from '../pages/ServicesPage.vue'
import { makeI18n, resetDom } from './helpers'

async function mountServices(locale: 'zh' | 'en' = 'zh') {
  const { i18n, composer } = makeI18n(locale)
  const stub = { template: '<div />' }
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/services', name: 'services', component: ServicesPage },
      { path: '/tools', name: 'tools', component: stub },
      { path: '/blog', name: 'blog', component: stub },
      { path: '/about', name: 'about', component: stub },
    ],
  })
  router.push('/services')
  await router.isReady()
  const wrapper = mount(ServicesPage, {
    global: { plugins: [i18n, router] },
  })
  return { wrapper, i18n, composer }
}

describe('ServicesPage（服务落地页）', () => {
  it('渲染服务重构提示与咨询卡片', async () => {
    resetDom()
    const { wrapper, composer } = await mountServices()
    expect(wrapper.find('.status-card').exists()).toBe(true)
    expect(wrapper.find('.status-card .badge--vermilion').text()).toBe(composer.t('services.status'))
    expect(wrapper.find('.inquiry-card').exists()).toBe(true)
    expect(wrapper.find('.inquiry-card__title').text()).toBe(composer.t('services.inquiryTitle'))
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

  it('SEO：结构化数据不再声明服务套餐（2026-09-13 服务线暂停）', async () => {
    resetDom()
    const { composer } = await mountServices('zh')
    const el = document.head.querySelector('script[type="application/ld+json"][id="services-ld"]')
    expect(el).not.toBeNull()
    const data = JSON.parse(el!.textContent || '{}')
    expect(data['@type']).toBe('ProfessionalService')
    // 标记必须与页面可见内容一致：页面已写明旧版套餐暂停，就不允许再出现套餐/报价
    expect(data).not.toHaveProperty('hasOfferCatalog')
    expect(data).not.toHaveProperty('offers')
    expect(data).not.toHaveProperty('priceSpecification')
    expect(data).not.toHaveProperty('serviceType')
    expect(data.description).toBe(composer.t('services.subtitle'))
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
