import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export type ThemePreference = 'system' | 'dark' | 'light'
export type ActiveTheme = 'dark' | 'light'

const STORAGE_KEY = 'theme'

function getInitialPreference(): ThemePreference {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'system'
  }
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light' || stored === 'system') {
    return stored
  }
  return 'system'
}

function getSystemTheme(): ActiveTheme {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'dark'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const preference = ref<ThemePreference>(getInitialPreference())
  const systemTheme = ref<ActiveTheme>(getSystemTheme())

  const activeTheme = computed<ActiveTheme>(() => {
    if (preference.value === 'system') {
      return systemTheme.value
    }
    return preference.value
  })

  const isDark = computed<boolean>(() => activeTheme.value === 'dark')

  function applyThemeToDom(theme: ActiveTheme): void {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')

    // 同步浏览器标签栏与状态栏主题色
    let metaThemeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.setAttribute('name', 'theme-color')
      document.head.appendChild(metaThemeColor)
    }
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#0b0b0d' : '#f7f6f2')
  }

  function setPreference(mode: ThemePreference): void {
    preference.value = mode
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, mode)
    }
    applyThemeToDom(activeTheme.value)
  }

  /**
   * 便捷切换：在 dark 和 light 之间直接切换，
   * 并将显式偏好固化（下次如需跟随系统可调用 setPreference('system') 或 cyclePreference）
   */
  function toggleTheme(): void {
    const next: ActiveTheme = activeTheme.value === 'dark' ? 'light' : 'dark'
    setPreference(next)
  }

  /**
   * 循环切换：跟随系统 -> 浅色 -> 深色 -> 跟随系统
   */
  function cyclePreference(): void {
    if (preference.value === 'system') {
      setPreference('light')
    } else if (preference.value === 'light') {
      setPreference('dark')
    } else {
      setPreference('system')
    }
  }

  // 监听系统主题偏好变化（OS / 浏览器切换）
  let mediaQuery: MediaQueryList | null = null
  let mediaListener: ((e: MediaQueryListEvent) => void) | null = null

  function initSystemListener(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return

    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemTheme.value = mediaQuery.matches ? 'dark' : 'light'

    mediaListener = (e: MediaQueryListEvent) => {
      systemTheme.value = e.matches ? 'dark' : 'light'
      if (preference.value === 'system') {
        applyThemeToDom(systemTheme.value)
      }
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', mediaListener)
    } else if ('addListener' in mediaQuery) {
      // 兼容早期 Safari 等老引擎
      (mediaQuery as unknown as { addListener: (cb: unknown) => void }).addListener(mediaListener)
    }
  }

  // 初始化 DOM 属性与系统监听
  initSystemListener()
  applyThemeToDom(activeTheme.value)

  watch(activeTheme, (next) => {
    applyThemeToDom(next)
  })

  return {
    preference,
    systemTheme,
    activeTheme,
    isDark,
    setPreference,
    toggleTheme,
    cyclePreference,
    applyThemeToDom,
  }
})
