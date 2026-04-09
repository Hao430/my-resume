<script setup lang="ts">
import { ref } from 'vue'

// 示例演示文稿数据
const slides = ref([
  {
    id: 'xin-fazhan-linian',
    title: '新发展理念的个人视角',
    description: '以创新、协调、绿色、开放、共享五大理念为框架，探讨个人成长与时代发展的同频共振。',
    slides: 8,
    date: '2026-04-09'
  }
])
</script>

<template>
  <div class="slides-page">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-header__title animate-fadeInUp">
          <span class="page-header__accent">·</span>
          演示文稿
        </h1>
        <p class="page-header__subtitle animate-fadeInUp delay-200">
          视觉表达 · 深度思考 · 演示分享
        </p>
      </div>
    </section>

    <!-- Slides Grid -->
    <section class="section">
      <div class="container">
        <div v-if="slides.length > 0" class="slides-grid">
          <article
            v-for="(slide, index) in slides"
            :key="slide.id"
            class="slide-card card card--glow animate-fadeInUp"
            :class="`delay-${(index % 3) * 100}`"
          >
            <!-- Preview Area -->
            <div class="slide-card__preview">
              <div class="slide-card__preview-bg">
                <div class="slide-card__preview-lines">
                  <span></span><span></span><span></span>
                  <span></span><span></span><span></span>
                </div>
              </div>
              <div class="slide-card__preview-overlay">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
              <span class="slide-card__count">{{ slide.slides }} 页</span>
            </div>

            <!-- Content -->
            <div class="slide-card__content">
              <h2 class="slide-card__title">{{ slide.title }}</h2>
              <p class="slide-card__description">{{ slide.description }}</p>
              <div class="slide-card__footer">
                <span class="slide-card__date">{{ slide.date }}</span>
                <router-link
                  :to="`/slides/${slide.id}`"
                  class="slide-card__link btn btn--primary"
                >
                  观看演示
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </router-link>
              </div>
            </div>
          </article>
        </div>
        <div v-else class="empty-state">
          <svg class="empty-state__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          <p class="empty-state__text">暂无演示文稿</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Page Header */
.page-header {
  padding: calc(var(--header-height) + var(--space-12)) 0 var(--space-8);
  text-align: center;
}

.page-header__title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.page-header__accent {
  color: var(--color-vermilion);
  font-size: var(--text-5xl);
  line-height: 1;
}

.page-header__subtitle {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

/* Slides Grid */
.slides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: var(--space-8);
}

/* Slide Card */
.slide-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}

/* Preview Area */
.slide-card__preview {
  position: relative;
  aspect-ratio: 16 / 9;
  background-color: var(--color-ink);
  cursor: pointer;
  overflow: hidden;
}

.slide-card__preview-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-ink-light) 0%, var(--color-ink) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-card__preview-lines {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
  padding: var(--space-4);
  opacity: 0.3;
}

.slide-card__preview-lines span {
  height: 8px;
  background-color: var(--color-ink-border);
  border-radius: 2px;
}

.slide-card__preview-lines span:nth-child(3n) {
  background-color: var(--color-vermilion-muted);
}

.slide-card__preview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(10, 10, 11, 0.6);
  color: var(--color-text);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.slide-card__preview:hover .slide-card__preview-overlay {
  opacity: 1;
}

.slide-card__preview-overlay svg {
  width: 64px;
  height: 64px;
  padding: var(--space-4);
  background-color: var(--color-vermilion);
  border-radius: 50%;
}

.slide-card__count {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-text);
  background-color: rgba(10, 10, 11, 0.8);
  border-radius: var(--radius-sm);
}

/* Content */
.slide-card__content {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.slide-card__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin: 0;
  transition: color var(--transition-fast);
}

.slide-card:hover .slide-card__title {
  color: var(--color-vermilion);
}

.slide-card__description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slide-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-ink-border);
  margin-top: auto;
}

.slide-card__date {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

.slide-card__link {
  font-size: var(--text-sm);
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

  .slides-grid {
    grid-template-columns: 1fr;
  }
}
</style>
