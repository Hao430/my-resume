<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, type BlogPostDetail } from '../api'

const route = useRoute()
const router = useRouter()

const slug = route.params.slug as string
const post = ref<BlogPostDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    post.value = await api.getPost(slug)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '文章加载失败'
  } finally {
    loading.value = false
  }
})
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

        <div v-if="loading" class="loading-state">
          <p>文章加载中...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
        </div>

        <template v-else-if="post">
          <h1 class="page-header__title">{{ post.title }}</h1>
          <p class="page-header__subtitle">{{ post.description }}</p>
          <div class="post-meta">
            <span class="post-meta__date">{{ post.date }}</span>
            <span v-for="tag in post.tags" :key="tag" class="badge badge--vermilion">
              {{ tag }}
            </span>
          </div>
          <a
            v-if="post.external_url"
            :href="post.external_url"
            target="_blank"
            rel="noopener"
            class="btn btn--primary"
          >
            阅读全文
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>
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
}

.post-meta__date {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}
</style>
