import { createRouter, createWebHistory } from 'vue-router'

/** 默认页面标题后缀 */
const SITE_TITLE = '张豪 | 技术人文空间'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue'),
      meta: { title: SITE_TITLE }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/AboutPage.vue'),
      meta: { title: `关于我 - ${SITE_TITLE}` }
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../pages/BlogPage.vue'),
      meta: { title: `博客 - ${SITE_TITLE}` }
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('../pages/BlogPostPage.vue'),
      meta: { title: `文章 - ${SITE_TITLE}` }
    },
    {
      path: '/slides',
      name: 'slides',
      component: () => import('../pages/SlidesPage.vue'),
      meta: { title: `演示文稿 - ${SITE_TITLE}` }
    },
    {
      path: '/slides/:id',
      name: 'slide-viewer',
      component: () => import('../pages/SlideViewerPage.vue'),
      meta: { title: `演示 - ${SITE_TITLE}` }
    },
    {
      path: '/read',
      name: 'blog-reader',
      component: () => import('../pages/BlogReaderPage.vue'),
      meta: { title: `阅读 - ${SITE_TITLE}` }
    },
    {
      path: '/daily-brief',
      name: 'daily-brief',
      component: () => import('../pages/DailyBriefPage.vue'),
      meta: { title: `每日早参 - ${SITE_TITLE}` }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局路由守卫：动态设置页面标题
router.beforeEach((to) => {
  const title = to.meta.title as string | undefined
  if (title) {
    document.title = title
  }
})

export default router
