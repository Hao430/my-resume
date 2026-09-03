import { createRouter, createWebHistory } from 'vue-router'
import i18n from '../i18n'
import { setCanonical } from '../utils/seo'
import { SITE_NAME_ZH, SITE_NAME_EN } from '../utils/site'

/**
 * 页面标题走 i18n：中英访客看到各自语言的 title（海外 SEO 关键）。
 * 站点名用常量拼接，避免 i18n 文案里出现裸 `|`（vue-i18n 会当复数分隔符）。
 */
const routes = [
  { path: '/', name: 'home', component: () => import('../pages/HomePage.vue'), meta: { titleKey: 'seo.home' } },
  { path: '/about', name: 'about', component: () => import('../pages/AboutPage.vue'), meta: { titleKey: 'seo.about' } },
  { path: '/blog', name: 'blog', component: () => import('../pages/BlogPage.vue'), meta: { titleKey: 'seo.blog' } },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: () => import('../pages/BlogPostPage.vue'),
    meta: { titleKey: 'seo.post' },
  },
  { path: '/slides', name: 'slides', component: () => import('../pages/SlidesPage.vue'), meta: { titleKey: 'seo.slides' } },
  {
    path: '/slides/:id',
    name: 'slide-viewer',
    component: () => import('../pages/SlideViewerPage.vue'),
    meta: { titleKey: 'seo.slides' },
  },
  // 兼容早期分享出去的 /read?file=xxx.html 链接
  { path: '/read', name: 'blog-reader', component: () => import('../pages/BlogReaderPage.vue'), meta: { titleKey: 'seo.reader' } },
  {
    path: '/daily-brief',
    name: 'daily-brief',
    component: () => import('../pages/DailyBriefPage.vue'),
    meta: { titleKey: 'seo.dailyBrief' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

/** 组装「页面名 | 站点名」；文章页会在组件内覆盖为文章标题 */
export function applyDocumentTitle(titleKey: string | undefined, locale: string): void {
  const english = locale === 'en'
  const site = english ? SITE_NAME_EN : SITE_NAME_ZH
  const { t } = i18n.global
  const page = titleKey ? t(titleKey) : ''
  document.title = page && page !== site ? `${page} | ${site}` : site
}

router.beforeEach((to) => {
  const locale = i18n.global.locale.value === 'en' ? 'en' : 'zh'
  applyDocumentTitle(to.meta.titleKey as string | undefined, locale)
  // 未被预渲染的路径回落到 SPA 外壳时，也要给出正确的 canonical
  setCanonical(to.path)
})

export default router
