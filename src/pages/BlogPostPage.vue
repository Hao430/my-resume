<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBlogStore, SITE_URL, SITE_NAME_ZH, SITE_NAME_EN } from '../stores/blog'
import { SITE_EMAIL } from '../utils/site'
import { setCanonical, setPageMeta, upsertJsonLd } from '../utils/seo'
import { formatDate } from '../utils/format'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const blogStore = useBlogStore()

const slug = computed(() => String(route.params.slug ?? ''))
const post = computed(() => blogStore.bySlug(slug.value, locale.value))
const siblings = computed(() => blogStore.siblings(slug.value, locale.value))
const notFound = computed(() => !post.value)
const loc = computed(() => (locale.value.startsWith('en') ? 'en' : 'zh'))

const updatedLabel = computed(() => {
  const current = post.value
  if (!current || !current.updated || current.updated === current.date) return ''
  return `${t('blog.post.updatedAt')} ${formatDate(current.updated, loc.value)}`
})

const dateLabel = computed(() => (post.value ? formatDate(post.value.date, loc.value) : ''))

const mailHref = computed(() => {
  const subject = t('services.mailSubject')
  return `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(subject)}`
})

const originalHint = computed(() => {
  const current = post.value
  if (!current) return ''
  return current.bodyLang !== loc.value
    ? t(current.bodyLang === 'zh' ? 'blog.originalZh' : 'blog.originalEn')
    : ''
})

/* 文章 head 同步：标题 / 摘要 / canonical（SPA 内导航与直链都要正确） */
watchEffect(() => {
  const current = post.value
  if (!current) return
  const site = loc.value === 'en' ? SITE_NAME_EN : SITE_NAME_ZH
  setPageMeta({
    title: `${current.title} | ${site}`,
    description: current.description,
    image: current.cover ? `${SITE_URL}${current.cover}` : undefined,
    type: 'article',
  })
  setCanonical(route.path)
  /* 预渲染外壳已带 article-ld（BlogPosting）；SPA 内导航后按当前文章更新，避免错位 */
  upsertJsonLd('article-ld', {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: current.title,
    description: current.description,
    inLanguage: loc.value === 'en' ? 'en' : 'zh-CN',
    image: current.cover
      ? `${SITE_URL}${current.cover}`
      : `${SITE_URL}/${current.bodyLang === 'en' ? 'og-image-en.png' : 'og-image.png'}`,
    datePublished: current.date,
    dateModified: current.updated || current.date,
    articleSection: current.tags.join(', '),
    keywords: current.tags.join(', '),
    wordCount: current.plain.length,
    url: `${SITE_URL}${current.path}`,
    author: { '@type': 'Person', name: '张豪 (Hao430)', url: `${SITE_URL}/about/` },
    publisher: { '@type': 'Person', name: '张豪 (Hao430)', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${current.path}` },
  })
})
</script>

<template>
  <div class="blog-post">
    <section class="page-header">
      <div class="container container--narrow">
        <button class="back-btn" @click="router.back()">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {{ t('blog.post.back') }}
        </button>

        <div v-if="notFound" class="error-state">
          <p>{{ t('blog.post.notFound') }}</p>
          <router-link to="/blog" class="btn btn--primary">{{ t('blog.pageTitle') }}</router-link>
        </div>

        <template v-else-if="post">
          <h1 class="page-header__title">{{ post.title }}</h1>
          <p class="page-header__subtitle">{{ post.description }}</p>
          <div class="post-meta">
            <time :datetime="post.date">{{ dateLabel }}</time>
            <span v-if="updatedLabel"> · {{ updatedLabel }}</span>
            <span class="post-meta__dot">·</span>
            <span>{{ t('blog.minutes', { n: post.readingMinutes }) }}</span>
            <span v-for="tag in post.tags" :key="tag" class="badge badge--vermilion">
              {{ tag }}
            </span>
          </div>
          <p v-if="originalHint" class="post-lang-hint">{{ originalHint }}</p>

          <nav v-if="post.toc.length > 2" class="post-toc" :aria-label="t('blog.post.toc')">
            <p class="post-toc__title">{{ t('blog.post.toc') }}</p>
            <ul>
              <li v-for="item in post.toc" :key="item.id" :class="`post-toc__item--${item.level}`">
                <a :href="`#${item.id}`">{{ item.text }}</a>
              </li>
            </ul>
          </nav>

          <!-- Markdown 渲染内容 -->
          <div class="post-content">
            <MarkdownRenderer :html="post.contentHtml" />
          </div>

          <a
            v-if="post.externalUrl"
            :href="post.externalUrl"
            target="_blank"
            rel="noopener"
            class="btn btn--primary mt-8"
          >
            {{ t('blog.post.readFull') }}
          </a>

          <!-- 文末 CTA：把读者导向服务落地页（复用 services.* 文案，一处维护） -->
          <aside class="post-cta" aria-label="services">
            <h2 class="post-cta__title">{{ t('services.ctaTitle') }}</h2>
            <p class="post-cta__body">{{ t('services.ctaBody') }}</p>
            <div class="post-cta__actions">
              <a :href="mailHref" class="btn btn--primary">{{ t('services.ctaButton') }}</a>
              <router-link to="/services" class="btn btn--outline">{{ t('nav.services') }}</router-link>
            </div>
            <p class="post-cta__fineprint">{{ t('services.fineprint') }}</p>
          </aside>

          <!-- 上一篇 / 下一篇 -->
          <nav class="post-nav" :aria-label="t('blog.post.nav')">
            <router-link
              v-if="siblings.prev"
              :to="siblings.prev.path"
              class="post-nav__link post-nav__link--prev"
            >
              <span class="post-nav__label">{{ t('blog.post.prev') }}</span>
              <span class="post-nav__title">{{ siblings.prev.title }}</span>
            </router-link>
            <router-link
              v-if="siblings.next"
              :to="siblings.next.path"
              class="post-nav__link post-nav__link--next"
            >
              <span class="post-nav__label">{{ t('blog.post.next') }}</span>
              <span class="post-nav__title">{{ siblings.next.title }}</span>
            </router-link>
          </nav>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>

.post-meta time {
  color: inherit;
}

.post-lang-hint {
  margin: var(--space-3) 0 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.post-toc {
  max-width: 640px;
  margin: var(--space-8) auto;
  padding: var(--space-4) var(--space-5);
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-ink-light);
}

.post-toc__title {
  margin: 0 0 var(--space-2);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.post-toc ul {
  margin: 0;
  padding-left: var(--space-4);
  list-style: none;
}

.post-toc li {
  margin-bottom: var(--space-1);
  font-size: var(--text-sm);
}

.post-toc__item--3 {
  padding-left: var(--space-4);
  opacity: 0.85;
}

.post-nav {
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-12);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-ink-border);
}

.post-nav__link {
  flex: 1 1 240px;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-4);
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: border-color var(--transition-fast);
}

.post-nav__link:hover {
  border-color: var(--color-vermilion);
}

.post-nav__link--next {
  text-align: right;
}

.post-nav__label {
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.post-nav__title {
  font-family: var(--font-display);
  color: var(--color-text);
}

.blog-post {
  padding-top: var(--header-height);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  background: none;
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  margin-bottom: var(--space-6);
  transition: all var(--transition-fast);
}

.back-btn:hover {
  color: var(--color-vermilion);
  border-color: var(--color-vermilion);
}

.loading-state,
.error-state {
  padding: var(--space-8) 0;
  text-align: center;
  color: var(--color-text-secondary);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-4);
  margin-bottom: var(--space-8);
}

.post-meta__date {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

.post-content {
  max-width: 640px;
  margin: 0 auto;
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-ink-border);
}

/* 文末 CTA 卡片：与正文同宽，视觉上区分于正文 */
.post-cta {
  max-width: 640px;
  margin: var(--space-12) auto 0;
  padding: var(--space-8);
  background-color: var(--color-ink-light);
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-lg);
  text-align: left;
}

.post-cta__title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-3);
  color: var(--color-text);
}

.post-cta__body {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}

.post-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.post-cta__fineprint {
  margin-top: var(--space-6);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}
</style>
