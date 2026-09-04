import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from '../components/Footer.vue'
import { makeI18n, resetDom } from './helpers'

function mountFooter(locale: 'zh' | 'en' = 'zh') {
  const { i18n } = makeI18n(locale)
  const wrapper = mount(Footer, { global: { plugins: [i18n] } })
  return wrapper
}

describe('Footer（页脚）', () => {
  it('包含指向 /privacy/ 的隐私政策链接', () => {
    resetDom()
    const wrapper = mountFooter()
    const privacyLink = wrapper.findAll('a').find((a) => a.attributes('href') === '/privacy/')
    expect(privacyLink).toBeTruthy()
    expect(privacyLink!.text()).toContain('隐私政策')
    wrapper.unmount()
  })

  it('英文环境下隐私链接文案为 Privacy', () => {
    resetDom()
    const wrapper = mountFooter('en')
    const privacyLink = wrapper.findAll('a').find((a) => a.attributes('href') === '/privacy/')
    expect(privacyLink!.text()).toBe('Privacy')
    wrapper.unmount()
  })
})
