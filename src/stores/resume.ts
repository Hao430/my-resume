import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '../api'
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
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchResume }
})
