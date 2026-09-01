import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import { api } from '../api'
import { resumeData as localResumeDataZh } from '../data/resume'
import type { ResumeData } from '../types/resume'

export const useResumeStore = defineStore('resume', () => {
  const data = ref<ResumeData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { locale } = useI18n()

  async function fetchResume() {
    loading.value = true
    error.value = null
    try {
      data.value = (await api.getResume()) as unknown as ResumeData
    } catch (e) {
      // 无后端时降级到本地数据
      console.warn('API 不可用，使用本地数据:', e instanceof Error ? e.message : '')
      data.value = localResumeDataZh
    } finally {
      loading.value = false
    }
  }

  // 语言切换时重新加载数据
  watch(locale, async (newLocale) => {
    if (newLocale === 'en') {
      try {
        const enData = await import('../i18n/locales/resume-en.json')
        data.value = enData.default as ResumeData
      } catch (e) {
        console.warn('英文数据加载失败:', e)
        data.value = localResumeDataZh
      }
    } else {
      data.value = localResumeDataZh
    }
  })

  return { data, loading, error, fetchResume }
})
