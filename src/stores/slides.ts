import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { slidesData, type Slide } from '../data/slides'

/**
 * 演示文稿 store —— 纯静态数据源（src/data/slides.ts），不再依赖后端 API。
 */
export const useSlidesStore = defineStore('slides', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const slides = computed<Slide[]>(() =>
    [...slidesData].sort((a, b) => (a.date < b.date ? 1 : -1)),
  )

  function fetchSlides() {
    loading.value = false
    error.value = null
  }

  function getSlideById(id: string): Slide | undefined {
    return slides.value.find((s) => s.id === id)
  }

  return { slides, loading, error, fetchSlides, getSlideById }
})
