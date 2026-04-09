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
      externalUrl: '/read?file=新发展理念的个人视角.html'
    },
    {
      slug: 'harness-gong-ju-tuijian',
      title: 'Harness开发范式的工具推荐',
      description: '分享我在日常开发中使用的效率工具，从AI助手到部署平台，构建个人工具链。',
      date: '2026-04-09',
      tags: ['工具', '效率', 'AI'],
      externalUrl: '/read?file=Harness开发范式的工具推荐.html'
    },
    {
      slug: 'workbuddy-esa-jianshan',
      title: '我是如何用WorkBuddy结合ESA开发本网站的',
      description: '从需求分析到自动部署，完整记录AI辅助开发简历网站的全过程。',
      date: '2026-04-09',
      tags: ['开发', 'AI', 'WorkBuddy'],
      externalUrl: '/read?file=WorkBuddy结合ESA开发网站实战.html'
    },
    {
      slug: 'faxian-shenghuo-xuqiu',
      title: '如何发现生活中的需求',
      description: '分享4种需求发现方法：痛点驱动、角色代入、数据挖掘、跨界借鉴。',
      date: '2026-04-09',
      tags: ['产品', '思考', '方法论'],
      externalUrl: '/read?file=如何发现生活中的需求.html'
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
