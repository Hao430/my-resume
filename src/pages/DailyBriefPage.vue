<script setup lang="ts">
import { ref, computed } from 'vue'
import { dailyBriefs } from '@/data/dailyBriefs'

const currentFile = ref<string | null>(null)

const latestBrief = computed(() => dailyBriefs.length > 0 ? dailyBriefs[0] : null)

const openBrief = (file: string) => {
  currentFile.value = file
}
</script>

<template>
  <div class="daily-brief">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-header__title animate-fadeInUp">
          <span class="page-header__accent">·</span>
          每日早参
        </h1>
        <p class="page-header__subtitle animate-fadeInUp delay-200">
          每交易日早晨 8:30 推送 · 信息差 · 政策 × 产业 × 科技 × 市场
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="section">
      <div class="container">
        <!-- 今日速览 -->
        <div v-if="latestBrief" class="latest-brief animate-fadeInUp">
          <div class="latest-brief__badge">今日</div>
          <h2 class="latest-brief__title">{{ latestBrief.title }}</h2>
          <div class="latest-brief__meta">{{ latestBrief.displayDate }}</div>
          <button class="btn btn--primary" @click="openBrief(latestBrief.file)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            阅读全文
          </button>
        </div>

        <!-- 历史早参 -->
        <div v-if="dailyBriefs.length > 1" class="history-section">
          <h3 class="history-section__title">
            <span class="section-title__accent">·</span>
            历史早参
          </h3>
          <div class="briefs-list">
            <article
              v-for="(brief, index) in dailyBriefs.slice(1)"
              :key="brief.date"
              class="brief-card card card--glow animate-fadeInUp"
              :class="`delay-${(index % 3) * 100}`"
            >
              <div class="brief-card__date">{{ brief.displayDate }}</div>
              <h4 class="brief-card__title">{{ brief.title }}</h4>
              <button class="brief-card__link" @click="openBrief(brief.file)">
                阅读
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </article>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="dailyBriefs.length === 0" class="empty-state">
          <svg class="empty-state__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <p class="empty-state__text">暂无早参内容</p>
          <p class="empty-state__hint">每天早上 8:30 更新</p>
        </div>
      </div>
    </section>

    <!-- Reader Modal -->
    <Teleport to="body">
      <div v-if="currentFile" class="reader-modal" @click.self="currentFile = null">
        <button class="reader-modal__close" @click="currentFile = null">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
        <iframe
          :src="`/${currentFile}`"
          class="reader-modal__iframe"
          frameborder="0"
        />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* Page Header */
.page-header {
  padding-top: calc(var(--header-height) + var(--space-12));
  padding-bottom: var(--space-8);
  background: linear-gradient(135deg, rgba(7, 193, 96, 0.08), transparent);
  border-bottom: 1px solid var(--color-ink-border);
}

.page-header__title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
}

.page-header__accent {
  color: var(--color-vermilion);
  font-size: var(--text-4xl);
  line-height: 1;
}

.page-header__subtitle {
  margin-top: var(--space-3);
  font-size: var(--text-base);
  color: var(--color-text-secondary);
}

/* Latest Brief */
.latest-brief {
  position: relative;
  padding: var(--space-8);
  background: linear-gradient(135deg, var(--color-ink-light), var(--color-ink));
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-10);
}

.latest-brief__badge {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-vermilion);
  background: rgba(237, 28, 36, 0.1);
  border: 1px solid rgba(237, 28, 36, 0.2);
  border-radius: var(--radius-sm);
}

.latest-brief__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin: 0 0 var(--space-3);
  max-width: 80%;
}

.latest-brief__meta {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-6);
}

/* History Section */
.history-section {
  margin-top: var(--space-8);
}

.history-section__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.section-title__accent {
  color: var(--color-vermilion);
  font-size: var(--text-2xl);
  line-height: 1;
}

.briefs-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.brief-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  position: relative;
}

.brief-card__date {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

.brief-card__title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  margin: 0;
  flex: 1;
}

.brief-card__link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-vermilion);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-top: auto;
  transition: gap var(--transition-fast);
}

.brief-card__link:hover {
  gap: var(--space-3);
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

.empty-state__hint {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-top: var(--space-2);
}

/* Reader Modal */
.reader-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(10, 10, 11, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
}

.reader-modal__close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  padding: var(--space-2);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.reader-modal__close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-vermilion);
}

.reader-modal__iframe {
  width: 100%;
  max-width: 900px;
  height: 90vh;
  border: none;
  border-radius: var(--radius-lg);
  background: white;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding-top: calc(var(--header-height) + var(--space-8));
  }

  .page-header__title {
    font-size: var(--text-2xl);
  }

  .latest-brief {
    padding: var(--space-6);
  }

  .latest-brief__title {
    font-size: var(--text-lg);
    max-width: 100%;
  }

  .briefs-list {
    grid-template-columns: 1fr;
  }

  .reader-modal {
    padding: 0;
  }

  .reader-modal__iframe {
    height: 100vh;
    border-radius: 0;
  }
}
</style>
