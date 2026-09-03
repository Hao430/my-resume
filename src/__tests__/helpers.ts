import { createI18n } from 'vue-i18n'
import type { Ref } from 'vue'
import zh from '../i18n/locales/zh.json'
import en from '../i18n/locales/en.json'

/**
 * 每次测试独立 i18n 实例，避免 locale 状态在用例间泄漏。
 * 返回 { i18n, composer }：
 *  - i18n 传给组件 global.plugins
 *  - composer 给断言用（t/locale），避开 vue-i18n 复杂泛型的联合类型
 */
export function makeI18n(locale: 'zh' | 'en' = 'zh') {
  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'zh',
    messages: { zh, en },
  })
  return {
    i18n,
    composer: {
      t: (key: string) => String(i18n.global.t(key)),
      locale: i18n.global.locale as unknown as Ref<string>,
    },
  }
}

export function resetDom(): void {
  document.documentElement.lang = 'zh-CN'
  localStorage.clear()
  document.title = ''
  document.head
    .querySelectorAll(
      'meta[name="description"], meta[property="og:description"], meta[name="twitter:description"], meta[property="og:title"], meta[property="og:url"], link[rel="canonical"]',
    )
    .forEach((el) => el.remove())
}
