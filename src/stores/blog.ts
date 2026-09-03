import { computed } from 'vue'
import { defineStore } from 'pinia'
import {
  adjacentPosts,
  buildCatalog,
  findPost,
  listForLocale,
  tagCloud,
  type BlogPost,
  type LocalizedPost,
} from '../utils/post-catalog'

export * from '../utils/site'
export type { BlogPost, LocalizedPost } from '../utils/post-catalog'

/** Vite 构建期读入全部 markdown（纯静态，运行时零请求） */
const POST_MODULES = import.meta.glob('/content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

/**
 * 博客 store：数据来自 content/posts/*.md，
 * 语言解析、上下篇、标签云等逻辑与构建脚本共用 src/utils/post-catalog.ts。
 */
export const useBlogStore = defineStore('blog', () => {
  const catalog = computed<BlogPost[]>(() => buildCatalog(POST_MODULES))

  const list = (locale: string): LocalizedPost[] => listForLocale(catalog.value, locale)
  const latest = (locale: string, count = 3): LocalizedPost[] => list(locale).slice(0, count)
  const bySlug = (slug: string, locale: string) => findPost(catalog.value, slug, locale)
  const siblings = (slug: string, locale: string) => adjacentPosts(catalog.value, slug, locale)
  const tags = (locale: string) => tagCloud(catalog.value, locale)

  return { catalog, list, latest, bySlug, siblings, tags }
})
