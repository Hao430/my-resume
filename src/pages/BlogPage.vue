<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()

// 将 store 数据转换为页面所需格式（添加 type 字段用于区分）
const posts = computed(() =>
  blogStore.posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.description,
    type: post.externalUrl ? 'slides' : 'article',
    date: post.date,
    tags: post.tags,
    readingTime: '5分钟'
  }))
)

const activeFilter = ref('all')

const filteredPosts = computed(() => {
  if (activeFilter.value === 'all') {
    return posts.value
  }
  return posts.value.filter(post => post.type === activeFilter.value)
})

const filters = [
  { id: 'all', label: '全部' },
  { id: 'article', label: '文章' },
  { id: 'slides', label: '演示' }
]

const getTypeLabel = (type: string) => {
  return type === 'slides' ? '演示' : '文章'
}

const getTypeBadgeClass = (type: string) => {
  return type === 'slides' ? 'badge--gold' : 'badge--vermilion'
}
</script>

<template>
  <div class="blog">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-header__title animate-fadeInUp">
          <span class="page-header__accent">·</span>
          博客
        </h1>
        <p class="page-header__subtitle animate-fadeInUp delay-200">
          思考沉淀 · 技术分享 · 成长记录
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
            @click="activeFilter = filter.id"
          >
            {{ filter.label }}
          </button>
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
            class="post-card card card--glow animate-fadeInUp"
            :class="`delay-${(index % 3) * 100}`"
          >
            <div class="post-card__meta">
              <span :class="['badge', getTypeBadgeClass(post.type)]">
                {{ getTypeLabel(post.type) }}
              </span>
              <span class="post-card__date">{{ post.date }}</span>
            </div>
            <h2 class="post-card__title">{{ post.title }}</h2>
            <p class="post-card__excerpt">{{ post.excerpt }}</p>
            <div class="post-card__footer">
              <div class="post-card__tags">
                <span v-for="tag in post.tags" :key="tag" class="post-card__tag">
                  {{ tag }}
                </span>
              </div>
              <span class="post-card__reading-time">{{ post.readingTime }}</span>
            </div>
            <router-link
              :to="post.externalUrl"
              class="post-card__link"
            >
              <span>阅读</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </router-link>
          </article>
        </div>
        <div v-else class="empty-state">
          <svg class="empty-state__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <p class="empty-state__text">暂无文章</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Page Header - 使用 global.css 公共样式 */
/* 保留响应式调整 */

@media (max-width: 768px) {
  .page-header {
    padding-top: calc(var(--header-height) + var(--space-8));
  }

  .page-header__title {
    font-size: var(--text-3xl);
  }
}

/* Filter Tabs */
.filter-tabs {
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-ink-border);
}

.filter-tabs__list {
  display: flex;
  gap: var(--space-2);
}

.filter-tabs__item {
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: none;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-tabs__item:hover {
  color: var(--color-text);
  background-color: var(--color-ink-light);
}

.filter-tabs__item--active {
  color: var(--color-vermilion);
  background-color: var(--color-vermilion-muted);
  border-color: var(--color-vermilion-muted);
}

/* Posts Grid */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-6);
}

/* Post Card */
.post-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  position: relative;
}

.post-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.post-card__date {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

.post-card__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  margin: 0;
  transition: color var(--transition-fast);
}

.post-card:hover .post-card__title {
  color: var(--color-vermilion);
}

.post-card__excerpt {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-ink-border);
}

.post-card__tags {
  display: flex;
  gap: var(--space-2);
}

.post-card__tag {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.post-card__tag:not(:last-child)::after {
  content: '·';
  margin-left: var(--space-2);
}

.post-card__reading-time {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.post-card__link {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-text);
  background-color: rgba(10, 10, 11, 0.9);
  opacity: 0;
  border-radius: var(--radius-lg);
  transition: opacity var(--transition-base);
}

.post-card:hover .post-card__link {
  opacity: 1;
}

.post-card__link span,
.post-card__link svg {
  position: relative;
  z-index: 1;
}

.post-card__link svg {
  transition: transform var(--transition-fast);
}

.post-card__link:hover svg {
  transform: translateX(4px);
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

.empty-state__icon {
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-4);
}

.empty-state__text {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--color-text-tertiary);
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding-top: calc(var(--header-height) + var(--space-8));
  }

  .page-header__title {
    font-size: var(--text-3xl);
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .post-card__link {
    opacity: 1;
    position: static;
    background: none;
    padding-top: var(--space-3);
    border-top: none;
    justify-content: flex-start;
    color: var(--color-vermilion);
  }
}
</style>
