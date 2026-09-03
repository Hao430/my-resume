import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import { makeI18n, resetDom } from './helpers'

describe('LanguageSwitcher（语言切换按钮）', () => {
  it('初始中文：显示 EN，点击后切英文并同步 html lang + localStorage', async () => {
    resetDom()
    const { i18n, composer } = makeI18n('zh')
    const wrapper = mount(LanguageSwitcher, { global: { plugins: [i18n] } })

    // 初始 zh
    expect(wrapper.find('.lang-switcher__text').text()).toBe('EN')

    await wrapper.find('button').trigger('click')

    expect(composer.locale.value).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem('locale')).toBe('en')
    expect(wrapper.find('.lang-switcher__text').text()).toBe('中')

    wrapper.unmount()
  })

  it('初始英文：切回中文并同步 zh-CN 与 localStorage', async () => {
    resetDom()
    const { i18n, composer } = makeI18n('en')
    const wrapper = mount(LanguageSwitcher, { global: { plugins: [i18n] } })

    expect(wrapper.find('.lang-switcher__text').text()).toBe('中')

    await wrapper.find('button').trigger('click')

    expect(composer.locale.value).toBe('zh')
    expect(document.documentElement.lang).toBe('zh-CN')
    expect(localStorage.getItem('locale')).toBe('zh')

    wrapper.unmount()
  })
})
