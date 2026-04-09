import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  externalUrl?: string
}

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>([
    {
      slug: 'xin-fazhan-linian',
      title: '新发展理念的个人视角',
      description: '以创新、协调、绿色、开放、共享五大理念为框架，探讨个人成长与时代发展的同频共振。',
      date: '2026-04-09',
      tags: ['思想', '发展'],
      externalUrl: '/新发展理念的个人视角.html'
    }
  ])

  function getPostBySlug(slug: string): BlogPost | undefined {
    return posts.value.find(post => post.slug === slug)
  }

  function addPost(post: Omit<BlogPost, 'slug'>): void {
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '')
    posts.value.push({ ...post, slug })
  }

  return { posts, getPostBySlug, addPost }
})
