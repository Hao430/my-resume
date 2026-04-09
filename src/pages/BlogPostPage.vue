<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const slug = route.params.slug as string
</script>

<template>
  <div class="blog-post">
    <section class="page-header">
      <div class="container container--narrow">
        <button class="back-btn" @click="router.back()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回
        </button>
        <h1 class="page-header__title">{{ slug }}</h1>
        <p class="page-header__subtitle">文章加载中...</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.blog-post {
  padding-top: var(--header-height);
}

/* Page Header - 使用 global.css 公共样式 */
/* BlogPostPage 布局特殊，不需要 header 偏移 */

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
</style>
