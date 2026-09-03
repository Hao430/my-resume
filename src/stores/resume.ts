import { ref, watch, computed } from 'vue'
import { defineStore } from 'pinia'
import i18n from '../i18n'
import { resumeData as resumeDataZh } from '../data/resume'
import type { ResumeData } from '../types/resume'

/**
 * 简历数据 store —— 纯静态。
 *
 * 注意：这里**不使用** `useI18n()`。Pinia store 的 setup 可能在组件之外被调用
 * （例如 main.ts 预热），那时没有组件实例，`useI18n()` 会抛
 * "Must be called at the top of a setup function" 并让整页白屏
 * （英文访客曾因此看到空白站）。改用 `i18n.global` 即可安全读取语言。
 */
export const useResumeStore = defineStore('resume', () => {
  const locale = computed(() => (i18n.global.locale.value === 'en' ? 'en' : 'zh'))
  const data = ref<ResumeData>(resumeDataZh)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadLocale(next: 'zh' | 'en'): Promise<void> {
    if (next === 'zh') {
      data.value = resumeDataZh
      error.value = null
      return
    }
    loading.value = true
    try {
      const en = await import('../i18n/locales/resume-en.json')
      data.value = en.default as unknown as ResumeData
      error.value = null
    } catch (e) {
      console.warn('英文简历数据加载失败，回退中文:', e instanceof Error ? e.message : e)
      data.value = resumeDataZh
      error.value = 'resume-en load failed'
    } finally {
      loading.value = false
    }
  }

  /** 兼容旧调用点：数据随语言自动切换，这里只触发一次同步 */
  function fetchResume(): void {
    void loadLocale(locale.value)
  }

  watch(locale, (next) => void loadLocale(next), { immediate: true })

  return { data, loading, error, locale, fetchResume }
})
