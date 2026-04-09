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
