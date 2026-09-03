import { createI18n } from 'vue-i18n'
import zh from './locales/zh.json'
import en from './locales/en.json'

/** 自动检测语言：localStorage → 浏览器语言 → 默认中文 */
function detectLocale(): string {
  // 1. 用户之前手动选择的语言
  const saved = localStorage.getItem('locale')
  if (saved && ['zh', 'en'].includes(saved)) {
    return saved
  }

  // 2. 浏览器语言
  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || ''
  if (browserLang.startsWith('en')) {
    return 'en'
  }

  // 3. 默认中文
  return 'zh'
}

const locale = detectLocale()

// 同步设置 HTML lang 属性
document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'zh',
  messages: {
    zh,
    en,
  },
})

export default i18n
