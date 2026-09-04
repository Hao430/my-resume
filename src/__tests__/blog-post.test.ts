import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import BlogPostPage from '../pages/BlogPostPage.vue'
import { makeI18n } from './helpers'

/**
 * 文末 CTA 卡片（2026-09-05 新增）：
 * 文章页底部必须出现「预约诊断 / 去服务页」转化入口，与 Services 页文案保持一致。
 * 同时验证 SPA 导航时 article-ld JSON-LD 被 upsert 到 head。
 */
async function mountPost(locale: 'zh' | 'en' = 'zh', slug = 'ai-agent-permission-management') {
  setActivePinia(createPinia())
  const { i18n } = makeI18n(locale)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/services', name: 'services', component: { template: '<div />' } },
      { path: '/blog/:slug', name: 'blog-post', component: BlogPostPage },
    ],
  })
  router.push(`/blog/${slug}`)
  await router.isReady()
  const wrapper = mount(BlogPostPage, {
    global: { plugins: [i18n, router] },
  })
  await wrapper.vm.$nextTick()
  await wrapper.vm.$nextTick()
  return { wrapper, router }
}

describe('BlogPostPage 文末 CTA（获客转化入口）', () => {
  it('正文之后渲染 .post-cta 卡片，标题复用 services.ctaTitle', async () => {
    const { wrapper } = await mountPost('zh')
    const cta = wrapper.find('.post-cta')
    expect(cta.exists()).toBe(true)
    expect(cta.find('.post-cta__title').text()).toBe('预约 30 分钟免费诊断')
    wrapper.unmount()
  })

  it('CTA 的 mailto 按钮带预约主题，且提供 /services 内链', async () => {
    const { wrapper } = await mountPost('zh')
    const mail = wrapper.find('.post-cta a.btn--primary')
    expect(mail.attributes('href')).toBe(
      'mailto:fervent430@163.com?subject=' + encodeURIComponent('AI 编码服务诊断预约'),
    )
    expect(mail.text()).toBe('发邮件预约')
    const serviceLink = wrapper.find('.post-cta a[href="/services"]')
    expect(serviceLink.exists()).toBe(true)
    expect(serviceLink.text()).toBe('服务')
    wrapper.unmount()
  })

  it('英文环境下 CTA 文案与主题切为英文', async () => {
    const { wrapper } = await mountPost('en')
    const mail = wrapper.find('.post-cta a.btn--primary')
    expect(mail.attributes('href')).toContain(encodeURIComponent('AI Coding Services'))
    expect(mail.text()).toBe('Email to book')
    wrapper.unmount()
  })

  it('SPA 导航后 head 中 article-ld JSON-LD 与当前文章一致', async () => {
    const { wrapper } = await mountPost('zh', 'ai-agent-permission-management')
    const el = document.head.querySelector('script#article-ld')
    expect(el).not.toBeNull()
    const data = JSON.parse(el?.textContent ?? '{}')
    expect(data['@type']).toBe('BlogPosting')
    expect(data.url).toContain('/blog/ai-agent-permission-management/')
    expect(data.inLanguage).toBe('zh-CN')
    wrapper.unmount()
  })
})