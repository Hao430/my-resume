import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Slide {
  id: string
  title: string
  description: string
  slides: number
  date: string
  url: string
}

export const useSlidesStore = defineStore('slides', () => {
  const slides = ref<Slide[]>([
    {
      id: 'xin-fazhan-linian',
      title: '新发展理念的个人视角',
      description: '以创新、协调、绿色、开放、共享五大理念为框架，探讨个人成长与时代发展的同频共振。',
      slides: 8,
      date: '2026-04-09',
      url: '/新发展理念的个人视角.html'
    }
  ])

  function getSlideById(id: string): Slide | undefined {
    return slides.value.find(slide => slide.id === id)
  }

  function addSlide(slide: Omit<Slide, 'id'>): void {
    const id = slide.title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '')
    slides.value.push({ ...slide, id })
  }

  return { slides, getSlideById, addSlide }
})
