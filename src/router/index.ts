import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/AboutPage.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../pages/BlogPage.vue')
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('../pages/BlogPostPage.vue')
    },
    {
      path: '/slides',
      name: 'slides',
      component: () => import('../pages/SlidesPage.vue')
    },
    {
      path: '/slides/:id',
      name: 'slide-viewer',
      component: () => import('../pages/SlideViewerPage.vue')
    },
    {
      path: '/read',
      name: 'blog-reader',
      component: () => import('../pages/BlogReaderPage.vue')
    },
    {
      path: '/daily-brief',
      name: 'daily-brief',
      component: () => import('../pages/DailyBriefPage.vue')
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

export default router
