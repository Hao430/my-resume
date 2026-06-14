import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '../api'
import { resumeData as localResumeData } from '../data/resume'
import type { ResumeData } from '../types/resume'

export const useResumeStore = defineStore('resume', () => {
  const data = ref<ResumeData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchResume() {
    loading.value = true
    error.value = null
    try {
      data.value = (await api.getResume()) as unknown as ResumeData
    } catch (e) {
      // 无后端时降级到本地数据
      console.warn('API 不可用，使用本地数据:', e instanceof Error ? e.message : '')
      data.value = localResumeData
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchResume }
})
