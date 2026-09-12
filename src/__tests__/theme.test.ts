import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useThemeStore } from '../stores/theme'
import ThemeSwitcher from '../components/ThemeSwitcher.vue'
import { makeI18n, makePinia, resetDom } from './helpers'

describe('useThemeStore 全局状态管理', () => {
  beforeEach(() => {
    resetDom()
    makePinia()
  })

  it('初始状态默认跟随系统，并读取初始偏好', () => {
    const store = useThemeStore()
    expect(store.preference).toBe('system')
    expect(['dark', 'light']).toContain(store.activeTheme)
    // 检查 DOM 是否已同步
    expect(document.documentElement.getAttribute('data-theme')).toBe(store.activeTheme)
    expect(document.documentElement.classList.contains(store.activeTheme)).toBe(true)
  })

  it('setPreference 能够显式设置主题并持久化至 localStorage', () => {
    const store = useThemeStore()

    store.setPreference('light')
    expect(store.preference).toBe('light')
    expect(store.activeTheme).toBe('light')
    expect(store.isDark).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // 检查 meta theme-color 同步
    const meta = document.querySelector('meta[name="theme-color"]')
    expect(meta?.getAttribute('content')).toBe('#f7f6f2')

    store.setPreference('dark')
    expect(store.preference).toBe('dark')
    expect(store.activeTheme).toBe('dark')
    expect(store.isDark).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(meta?.getAttribute('content')).toBe('#0b0b0d')
  })

  it('cyclePreference 能够在 系统 -> 浅色 -> 深色 -> 系统 间循环', () => {
    const store = useThemeStore()
    expect(store.preference).toBe('system')

    store.cyclePreference()
    expect(store.preference).toBe('light')

    store.cyclePreference()
    expect(store.preference).toBe('dark')

    store.cyclePreference()
    expect(store.preference).toBe('system')
  })

  it('toggleTheme 可以在深色与浅色间直接反转', () => {
    const store = useThemeStore()
    store.setPreference('dark')

    store.toggleTheme()
    expect(store.activeTheme).toBe('light')

    store.toggleTheme()
    expect(store.activeTheme).toBe('dark')
  })
})

describe('ThemeSwitcher 组件', () => {
  beforeEach(() => {
    resetDom()
  })

  it('渲染主题切换按钮并正确反映初始状态', () => {
    const pinia = makePinia()
    const { i18n } = makeI18n('zh')
    const wrapper = mount(ThemeSwitcher, {
      global: {
        plugins: [pinia, i18n],
      },
    })

    const button = wrapper.find('button.theme-switcher')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('系统')

    wrapper.unmount()
  })

  it('点击按钮时循环切换主题偏好', async () => {
    const pinia = makePinia()
    const { i18n } = makeI18n('zh')
    const wrapper = mount(ThemeSwitcher, {
      global: {
        plugins: [pinia, i18n],
      },
    })
    const store = useThemeStore()

    const button = wrapper.find('button.theme-switcher')
    await button.trigger('click')
    expect(store.preference).toBe('light')
    expect(button.text()).toContain('浅色')

    await button.trigger('click')
    expect(store.preference).toBe('dark')
    expect(button.text()).toContain('深色')

    wrapper.unmount()
  })
})
