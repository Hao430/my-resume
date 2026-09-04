import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import PrivacyPage from '../pages/PrivacyPage.vue'
import { makeI18n, resetDom } from './helpers'

async function mountPrivacy(locale: 'zh' | 'en' = 'zh') {
  const { i18n, composer } = makeI18n(locale)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/privacy', name: 'privacy', component: PrivacyPage }],
  })
  router.push('/privacy')
  await router.isReady()
  const wrapper = mount(PrivacyPage, {
    global: { plugins: [i18n, router] },
  })
  return { wrapper, i18n, composer }
}

describe('PrivacyPage（隐私政策页）', () => {
  it('渲染 9 个政策章节 + intro', async () => {
    resetDom()
    const { wrapper } = await mountPrivacy()
    expect(wrapper.findAll('.privacy-section')).toHaveLength(9)
    expect(wrapper.find('.privacy-body__intro').exists()).toBe(true)
    wrapper.unmount()
  })

  it('正文不泄漏裸 i18n key（数组拆键模式生效）', async () => {
    resetDom()
    const { wrapper, composer } = await mountPrivacy('zh')
    const texts = wrapper.findAll('.privacy-section__body').map((el) => el.text())
    expect(texts.length).toBeGreaterThan(0)
    expect(texts.some((t) => t.startsWith('privacy.') || t.includes(' sec'))).toBe(false)
    // 第一节标题应渲染为翻译文案而非键名
    expect(wrapper.find('.privacy-section__title').text()).toBe(composer.t('privacy.sec1Title'))
    wrapper.unmount()
  })

  it('英文环境下标题与正文切换为英文', async () => {
    resetDom()
    const { wrapper, composer } = await mountPrivacy('en')
    expect(wrapper.find('.page-header__title').text()).toContain(composer.t('privacy.pageTitle'))
    expect(wrapper.find('.privacy-section__title').text()).toBe(composer.t('privacy.sec1Title'))
    wrapper.unmount()
  })

  it('SEO：写入页面 title 与 canonical（带尾斜杠 /privacy/）', async () => {
    resetDom()
    const { wrapper, composer } = await mountPrivacy('zh')
    const site = '张豪 | 技术人文空间'
    expect(document.title).toBe(`${composer.t('seo.privacy')} | ${site}`)
    const canonical = document.head.querySelector('link[rel="canonical"]')
    expect(canonical?.getAttribute('href')).toBe('https://hao430.cn/privacy/')
    wrapper.unmount()
  })
})
