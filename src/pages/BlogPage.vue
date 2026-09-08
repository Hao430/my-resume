<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBlogStore } from '@/stores/blog'
import { formatDate } from '@/utils/format'

const { t, locale } = useI18n()
const blogStore = useBlogStore()

type FilterId = 'all' | 'article' | 'external'

interface Card {
  slug: string
  title: string
  excerpt: string
  type: FilterId
  externalUrl: string | null
  path: string
  date: string
  rawDate: string
  tags: string[]
  readingTime: string
  hint: string
}

const cards = computed<Card[]>(() => {
  const loc = locale.value.startsWith('en') ? 'en' : 'zh'
  return blogStore.list(loc).map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.description,
    type: post.externalUrl ? 'external' : 'article',
    externalUrl: post.externalUrl,
    path: post.externalUrl || `/blog/${post.slug}/`,
    date: formatDate(post.date, loc),
    rawDate: post.date,
    tags: post.tags,
    readingTime: t('blog.minutes', { n: post.readingMinutes }),
    hint:
      post.bodyLang !== loc
        ? t(post.bodyLang === 'zh' ? 'blog.originalZh' : 'blog.originalEn')
        : '',
  }))
})

const activeFilter = ref<FilterId>('all')
const activeTag = ref('all')

const filters = computed(() => [
  { id: 'all', label: t('blog.filters.all') },
  { id: 'article', label: t('blog.filters.article') },
  { id: 'external', label: t('blog.filters.external') },
])

const tags = computed(() => ['all', ...blogStore.tags(locale.value)])

const filteredPosts = computed(() =>
  cards.value.filter((post) => {
    if (activeFilter.value !== 'all' && post.type !== activeFilter.value) return false
    if (activeTag.value !== 'all' && !post.tags.includes(activeTag.value)) return false
    return true
  }),
)

const getTypeLabel = (type: FilterId) =>
  type === 'external' ? t('blog.type.external') : t('blog.type.article')

const getTypeBadgeClass = (type: FilterId) =>
  type === 'external' ? 'badge--gold' : 'badge--vermilion'

const isExternalLink = (url: string | null): url is string => !!url && /^https?:\/\//i.test(url)
</script>

<template>
  <div class="blog">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <p class="eyebrow page-header__eyebrow">{{ t('blog.eyebrow') || 'Journal' }}</p>
        <h1 class="page-header__title">
          <span class="page-header__accent" aria-hidden="true">·</span>
          {{ t('blog.pageTitle') }}
        </h1>
        <p class="page-header__subtitle">{{ t('blog.pageSubtitle') }}</p>
        <p class="page-header__feed">
          <a href="/feed.xml" class="feed-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" />
            </svg>
            {{ t('blog.subscribe') }}
          </a>
        </p>
      </div>
    </section>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <div class="container">
        <div class="filter-tabs__list">
          <button
            v-for="filter in filters"
            :key="filter.id"
            :class="['filter-tabs__item', { 'filter-tabs__item--active': activeFilter === filter.id }]"
            @click="activeFilter = filter.id as FilterId"
          >
            {{ filter.label }}
          </button>
        </div>
        <div v-if="tags.length > 1" class="tag-filter">
          <button
            :class="['tag-filter__item', { 'tag-filter__item--active': activeTag === 'all' }]"
            @click="activeTag = 'all'"
          >{{ t('blog.allTags') }}</button>
          <button
            v-for="tag in tags.slice(1)"
            :key="tag"
            :class="['tag-filter__item', { 'tag-filter__item--active': activeTag === tag }]"
            @click="activeTag = tag"
          >{{ tag }}</button>
        </div>
      </div>
    </div>

    <!-- Posts Grid -->
    <section class="section">
      <div class="container">
        <div v-if="filteredPosts.length > 0" class="posts-grid">
          <article
            v-for="(post, index) in filteredPosts"
            :key="post.slug"
            class="card card--glow post-card animate-fadeInUp"
            :class="`delay-${(index % 3) * 100}`"
          >
            <div class="post-card__meta">
              <span :class="['badge', getTypeBadgeClass(post.type)]">{{ getTypeLabel(post.type) }}</span>
              <time class="post-card__date mono" :datetime="post.rawDate">{{ post.date }}</time>
            </div>
            <h2 class="post-card__title">{{ post.title }}</h2>
            <p class="post-card__excerpt">{{ post.excerpt }}</p>
            <div class="post-card__footer">
              <div class="post-card__tags">
                <span v-for="tag in post.tags" :key="tag" class="post-card__tag">{{ tag }}</span>
              </div>
              <span class="post-card__reading-time mono">{{ post.readingTime }}</span>
            </div>
            <p v-if="post.hint" class="post-card__hint">{{ post.hint }}</p>
            <a
              v-if="isExternalLink(post.externalUrl)"
              :href="post.externalUrl ?? undefined"
              target="_blank"
              rel="noopener"
              class="post-card__link"
            >
              <span>{{ t('blog.readMore') }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <router-link v-else :to="post.path" class="post-card__link">
              <span>{{ t('blog.readMore') }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </router-link>
          </article>
        </div>
        <div v-else class="empty-state">
          <svg class="empty-state__icon" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <p class="empty-state__text">{{ t('blog.empty') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 眉题 */
.page-header__eyebrow {
  margin-bottom: var(--space-4);
  justify-content: center;
}

/* 订阅入口 */
.page-header__feed { margin-top: var(--space-5); }

.feed-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  border: 1px solid var(--color-ink-muted);
  border-radius: var(--radius-full);
  padding: 0.42rem 1rem;
  font-family: var(--font-fallback);
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.feed-link:hover {
  color: var(--color-vermilion);
  border-color: rgba(201, 79, 61, 0.5);
}

/* Filter Tabs */
.filter-tabs {
  padding: var(--space-3) 0;
  border-top: 1px solid var(--hairline);
  border-bottom: 1px solid var(--hairline);
  background: rgba(255, 255, 255, 0.015);
  position: sticky;
  top: var(--header-height);
  z-index: var(--z-sticky);
  backdrop-filter: blur(10px);
}

.filter-tabs__list {
  display: flex;
  gap: var(--space-2);
}

.filter-tabs__item {
  padding: 0.42rem 1rem;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-fallback);
}

.filter-tabs__item:hover {
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.04);
}

.filter-tabs__item--active {
  color: var(--color-text);
  background: var(--color-vermilion-muted);
  border-color: rgba(201, 79, 61, 0.35);
}

/* 标签筛选 */
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--hairline);
}

.tag-filter__item {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  background: transparent;
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-full);
  padding: 0.25rem 0.7rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-fallback);
}

.tag-filter__item:hover,
.tag-filter__item--active {
  color: var(--color-vermilion);
  border-color: rgba(201, 79, 61, 0.5);
}

/* Posts Grid */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: clamp(1rem, 2.4vw, 1.5rem);
}

/* Post Card */
.post-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
  position: relative;
}

.post-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.post-card__date { font-size: var(--text-xs); color: var(--color-text-tertiary); }

.post-card__title {
  font-size: 1.25rem;
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  margin: 0;
  transition: color var(--transition-fast);
}

.post-card:hover .post-card__title { color: var(--color-vermilion-bright); }

.post-card__excerpt {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-3);
  border-top: 1px solid var(--hairline);
}

.post-card__tags { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.post-card__tag { font-size: var(--text-xs); color: var(--color-text-tertiary); }
.post-card__tag:not(:last-child)::after { content: '\00b7'; margin-left: var(--space-2); }
.post-card__reading-time { font-size: var(--text-xs); color: var(--color-text-tertiary); }

.post-card__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-vermilion);
  text-decoration: none;
  margin-top: auto;
  transition: gap var(--transition-fast);
}

.post-card__link:hover { gap: var(--space-3); }
.post-card__link svg { transition: transform var(--transition-fast); }
.post-card__link:hover svg { transform: translateX(3px); }

.post-card__hint {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16) var(--space-4);
  text-align: center;
}

.empty-state__icon { color: var(--color-text-tertiary); margin-bottom: var(--space-4); }
.empty-state__text { font-size: var(--text-lg); color: var(--color-text-tertiary); margin: 0; }

/* Responsive */
@media (max-width: 768px) {
  .page-header { padding-top: calc(var(--header-height) + var(--space-10)); }
  .page-header__title { font-size: var(--text-3xl); }
  .posts-grid { grid-template-columns: 1fr; }
  .filter-tabs { position: static; }
}
</style>
