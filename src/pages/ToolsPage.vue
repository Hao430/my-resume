<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { TOOLS, toolPath } from '../data/tools'

const { t } = useI18n()

/** 三态各自对应独立的文案键——此前 planned 会错误地显示成「实验构建中」 */
const STATUS_LABEL_KEY: Record<(typeof TOOLS)[number]['status'], string> = {
  active: 'tools.statusActive',
  wip: 'tools.statusWip',
  planned: 'tools.statusPlanned',
}

interface ExternalLink {
  /** i18n 叶子键，对应 tools.links.<i18nKey>.title / .desc */
  i18nKey: string
  url: string
  category: string
}

// 自研工具清单在 src/data/tools.ts（单一事实来源：卡片 + 预渲染外壳 + sitemap）

// 精选外链与数字资产（文案走 i18n，勿硬编码）
const externalLinks: ExternalLink[] = [
  { i18nKey: 'repos', url: 'https://github.com/hao430', category: 'Code & Repos' },
  { i18nKey: 'research', url: '/blog', category: 'Research' },
  { i18nKey: 'advisory', url: '/services', category: 'Advisory' },
]
</script>

<template>
  <div class="tools-page">
    <!-- Header -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-header__title animate-fadeInUp">
          <span class="page-header__accent">·</span>
          {{ t('tools.pageTitle') }}
        </h1>
        <p class="page-header__subtitle animate-fadeInUp delay-200">
          {{ t('tools.pageSubtitle') }}
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <main class="container tools-page__main">
      <!-- Section 1: In-House Tools & Lab -->
      <section class="tools-section">
        <div class="section-head section-head--split">
          <div>
            <p class="eyebrow section-head__eyebrow">{{ t('tools.craftsEyebrow') }}</p>
            <h2 class="section-head__title">{{ t('tools.craftsTitle') }}</h2>
          </div>
        </div>
        <p class="section-subtext">{{ t('tools.craftsDesc') }}</p>

        <div class="tools-grid">
          <article
            v-for="tool in TOOLS"
            :key="tool.slug"
            class="card tool-card animate-fadeInUp"
          >
            <div class="tool-card__header">
              <span class="badge" :class="tool.status === 'active' ? 'badge--jade' : 'badge--neutral'">
                {{ t(STATUS_LABEL_KEY[tool.status]) }}
              </span>
              <span class="tool-card__id mono">#{{ tool.slug }}</span>
            </div>

            <h3 class="tool-card__title">{{ t(`tools.items.${tool.i18nKey}.title`) }}</h3>
            <p class="tool-card__desc">{{ t(`tools.items.${tool.i18nKey}.desc`) }}</p>

            <div class="tool-card__tags">
              <span v-for="tag in tool.tags" :key="tag" class="badge badge--inset mono">
                {{ tag }}
              </span>
            </div>

            <div class="tool-card__footer">
              <RouterLink
                v-if="tool.status === 'active'"
                :to="toolPath(tool)"
                class="tool-card__action btn btn--outline"
              >
                {{ t('tools.visit') }} →
              </RouterLink>
              <span v-else class="tool-card__pending mono">
                {{ t('tools.comingSoon') }}
              </span>
            </div>
          </article>
        </div>
      </section>

      <!-- Section 2: Radar & External Links -->
      <section class="tools-section">
        <div class="section-head section-head--split">
          <div>
            <p class="eyebrow section-head__eyebrow">{{ t('tools.linksEyebrow') }}</p>
            <h2 class="section-head__title">{{ t('tools.linksTitle') }}</h2>
          </div>
        </div>
        <p class="section-subtext">{{ t('tools.linksDesc') }}</p>

        <div class="links-grid">
          <a
            v-for="link in externalLinks"
            :key="link.i18nKey"
            :href="link.url"
            :target="link.url.startsWith('http') ? '_blank' : '_self'"
            :rel="link.url.startsWith('http') ? 'noopener noreferrer' : undefined"
            class="card link-card animate-fadeInUp"
          >
            <div class="link-card__top">
              <span class="badge badge--vermilion">{{ link.category }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="link-card__arrow">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </div>
            <h3 class="link-card__title">{{ t(`tools.links.${link.i18nKey}.title`) }}</h3>
            <p class="link-card__desc">{{ t(`tools.links.${link.i18nKey}.desc`) }}</p>
          </a>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.tools-page {
  padding-bottom: var(--space-16);
}

.page-header {
  padding-bottom: var(--space-8);
}

.page-header__subtitle {
  font-size: var(--text-lg);
  color: var(--color-vermilion);
  letter-spacing: var(--tracking-wide);
}

.tools-page__main {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.tools-section {
  display: flex;
  flex-direction: column;
}

.section-subtext {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-top: calc(-1 * var(--space-2));
  margin-bottom: var(--space-6);
  max-width: 60ch;
}

/* Tools Grid */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

.tool-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  transition: transform var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base);
}

.tool-card:hover {
  transform: translateY(-4px);
  border-color: rgba(201, 79, 61, 0.4);
  box-shadow: var(--shadow-hover);
}

.tool-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.tool-card__id {
  font-size: var(--text-xs);
  color: var(--color-text-faint);
}

.tool-card__title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin: 0 0 var(--space-2);
  color: var(--color-text);
}

.tool-card__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--space-4);
  flex: 1;
}

.tool-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}

.tool-card__footer {
  padding-top: var(--space-4);
  border-top: 1px solid var(--hairline);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tool-card__pending {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  letter-spacing: 0.05em;
}

/* Links Grid */
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-5);
}

.link-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-5) var(--space-6);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base);
}

.link-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-vermilion);
  box-shadow: var(--shadow-card);
}

.link-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.link-card__arrow {
  color: var(--color-text-tertiary);
  transition: color var(--transition-fast), transform var(--transition-fast);
}

.link-card:hover .link-card__arrow {
  color: var(--color-vermilion);
  transform: translate(2px, -2px);
}

.link-card__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  margin: 0 0 var(--space-2);
  color: var(--color-text);
}

.link-card__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}
</style>
