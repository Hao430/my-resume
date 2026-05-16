import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '../api'
import type { SlideListItem } from '../api'

// 保持对外接口兼容
export interface Slide extends SlideListItem {
  id: string   // 等同于 slug
  slides: number  // 等同于 page_count
  url: string     // 旧版 url 字段
}

export const useSlidesStore = defineStore('slides', () => {
  const slides = ref<Slide[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSlides() {
    loading.value = true
    error.value = null
    try {
      const data = await api.getSlides()
      slides.value = data.map(s => ({
        ...s,
        id: s.slug,
        slides: s.page_count,
        url: `/${s.slug}.html`,
      }))
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  function getSlideById(id: string): Slide | undefined {
    return slides.value.find(s => s.id === id)
  }

  async function addSlide() {
    throw new Error('Adding slides via API is not yet supported')
  }

  return { slides, loading, error, fetchSlides, getSlideById, addSlide }
})
