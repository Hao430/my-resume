import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api, type BlogPostListItem as BlogPost } from '../api'

export type { BlogPost }

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPosts() {
    loading.value = true
    error.value = null
    try {
      posts.value = await api.getPosts()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  function getPostBySlug(slug: string): BlogPost | undefined {
    return posts.value.find(p => p.slug === slug)
  }

  async function addPost(post: { title: string; description: string; date: string; tags: string[] }) {
    // 写接口暂未开放
    throw new Error('Adding posts via API is not yet supported')
  }

  return { posts, loading, error, fetchPosts, getPostBySlug, addPost }
})
