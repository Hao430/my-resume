<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { dailyBriefs, type DailyBrief } from '../data/dailyBriefs'

const { t } = useI18n()

/** 纯静态：早参列表在构建期由 scripts/sync-daily-briefs.cjs 生成，无 API 依赖 */
const briefs = computed<DailyBrief[]>(() => dailyBriefs)
const latestBrief = computed<DailyBrief | null>(() => briefs.value[0] ?? null)

const currentUrl = ref<string | null>(null)

/**
 * 开发环境读 public/每日早参/ 下的原始中文路径；
 * 生产环境使用构建期生成的 ASCII 路径（对海外链接分享 / 爬虫更友好）。
 */
function briefUrl(brief: DailyBrief): string {
  return import.meta.env.DEV ? `/${brief.file}` : brief.url
}

const openBrief = (brief: DailyBrief) => {
  currentUrl.value = briefUrl(brief)
}
</script>

<template>
  <div class="daily-brief">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-header__title animate-fadeInUp">
          <span class="page-header__accent">·</span>
          {{ t('dailyBrief.pageTitle') }}
        </h1>
        <p class="page-header__subtitle animate-fadeInUp delay-200">
          {{ t('dailyBrief.pageSubtitle') }}
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="section">
      <div class="container">
        <!-- Latest Brief -->
        <div v-if="latestBrief" class="latest-brief animate-fadeInUp">
          <div class="latest-brief__badge">{{ t('dailyBrief.today') }}</div>
          <h2 class="latest-brief__title">{{ latestBrief.title }}</h2>
          <div class="latest-brief__meta">{{ latestBrief.displayDate }}</div>
          <button class="btn btn--primary" @click="openBrief(latestBrief)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            {{ t('dailyBrief.readAll') }}
          </button>
        </div>

        <!-- History -->
        <div v-if="briefs.length > 1" class="history-section">
          <h3 class="history-section__title">
            <span class="section-title__accent">·</span>
            {{ t('dailyBrief.history') }}
          </h3>
          <div class="briefs-list">
            <article
              v-for="(brief, index) in briefs.slice(1)"
              :key="brief.date"
              class="brief-card card card--glow animate-fadeInUp"
              :class="`delay-${(index % 3) * 100}`"
            >
              <time class="brief-card__date" :datetime="brief.date">{{ brief.displayDate }}</time>
              <h4 class="brief-card__title">{{ brief.title }}</h4>
              <div class="brief-card__actions">
                <button class="brief-card__link" @click="openBrief(brief)">
                  {{ t('dailyBrief.read') }}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                <a class="brief-card__external" :href="briefUrl(brief)" target="_blank" rel="noopener">
                  {{ t('dailyBrief.openNew') }}
                </a>
              </div>
            </article>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="briefs.length === 0" class="empty-state">
          <svg class="empty-state__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <p class="empty-state__text">{{ t('dailyBrief.empty') }}</p>
          <p class="empty-state__hint">{{ t('dailyBrief.emptyHint') }}</p>
        </div>
      </div>
    </section>

    <!-- Reader Modal -->
    <Teleport to="body">
      <div v-if="currentUrl" class="reader-modal" @click.self="currentUrl = null">
        <button class="reader-modal__close" @click="currentUrl = null">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
        <iframe :src="currentUrl" class="reader-modal__iframe" frameborder="0" />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>

.brief-card__actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.brief-card__external {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-bottom: 1px dashed var(--color-ink-border);
}

.brief-card__external:hover {
  color: var(--color-vermilion);
}

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
