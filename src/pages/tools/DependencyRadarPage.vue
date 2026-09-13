<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import indexData from '../../data/deps/index.json'

const { t } = useI18n()

// 索引只有摘要（约 5 KB gzip），可以直接进 bundle；漏洞明细按包动态加载
const allPackages = indexData.packages
const fetchedAt = indexData.fetchedAt
const seedSize = indexData.seedSize

const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return allPackages
  return allPackages.filter(
    (pkg) => pkg.name.toLowerCase().includes(q) || pkg.slug.includes(q),
  )
})

const groups = computed(() => [
  { key: 'npm', label: 'npm', items: filtered.value.filter((pkg) => pkg.system === 'npm') },
  { key: 'pypi', label: 'PyPI', items: filtered.value.filter((pkg) => pkg.system === 'pypi') },
])

/** 严重度 → 徽章配色。CRITICAL/HIGH 用朱红，MODERATE 用金，其余中性 */
function severityClass(severity: string | null): string {
  if (severity === 'CRITICAL' || severity === 'HIGH') return 'badge--vermilion'
  if (severity === 'MODERATE') return 'badge--gold'
  return 'badge--neutral'
}

function formatDate(iso: string): string {
  return iso.slice(0, 10)
}
</script>

<template>
  <div class="radar-page">
    <section class="page-header">
      <div class="container">
        <p class="eyebrow page-header__eyebrow">
          <RouterLink to="/tools/">{{ t('tools.pageTitle') }}</RouterLink>
        </p>
        <h1 class="page-header__title animate-fadeInUp">
          <span class="page-header__accent">·</span>
          {{ t('tools.items.codeSecurityChecker.title') }}
        </h1>
        <p class="page-header__subtitle animate-fadeInUp delay-200">
          {{ t('tools.radar.pageSubtitle') }}
        </p>
      </div>
    </section>

    <main class="container radar-page__main">
      <!-- 收录范围必须说清楚：这是精选子集，不是全量索引 -->
      <p class="coverage-note">{{ t('tools.radar.coverageNote', { count: allPackages.length, seed: seedSize }) }}</p>

      <section class="card panel">
        <div class="panel__head">
          <input
            v-model="query"
            type="search"
            class="filter"
            :placeholder="t('tools.radar.filterPlaceholder')"
          />
          <span class="panel__stats mono">
            {{ t('tools.radar.filterCount', { shown: filtered.length, total: allPackages.length }) }}
          </span>
        </div>
      </section>

      <p v-if="filtered.length === 0" class="empty">{{ t('tools.radar.noMatch') }}</p>

      <section v-for="group in groups" v-show="group.items.length" :key="group.key" class="radar-group">
        <h2 class="radar-group__title">
          {{ group.label }}
          <span class="mono radar-group__count">{{ group.items.length }}</span>
        </h2>
        <ul class="pkg-list">
          <li v-for="pkg in group.items" :key="pkg.path" class="pkg-row">
            <RouterLink :to="pkg.path" class="pkg-row__name mono">{{ pkg.name }}</RouterLink>
            <span class="pkg-row__latest mono">{{ pkg.latest }}</span>
            <span class="pkg-row__license">{{ pkg.licenses.join(' · ') || '—' }}</span>
            <span class="pkg-row__flags">
              <span v-if="pkg.deprecated" class="badge badge--neutral">
                {{ t('tools.radar.deprecatedBadge') }}
              </span>
              <span v-if="pkg.latestAffected" class="badge badge--vermilion">
                {{ t('tools.radar.affectedBadge') }}
              </span>
              <span
                v-if="pkg.vulnerabilityCount > 0"
                class="badge"
                :class="severityClass(pkg.highestSeverity)"
              >
                {{ t('tools.radar.vulnCount', { count: pkg.vulnerabilityCount }) }}
              </span>
              <span v-else class="pkg-row__clean">{{ t('tools.radar.vulnNone') }}</span>
            </span>
          </li>
        </ul>
      </section>

      <p class="disclaimer">{{ t('tools.radar.disclaimer', { date: formatDate(fetchedAt) }) }}</p>
    </main>
  </div>
</template>

<style scoped>
.radar-page {
  padding-bottom: var(--space-16);
}

.page-header {
  padding-bottom: var(--space-8);
}

.page-header__eyebrow a {
  color: inherit;
  text-decoration: none;
}

.page-header__eyebrow a:hover {
  color: var(--color-vermilion);
}

.page-header__subtitle {
  font-size: var(--text-lg);
  color: var(--color-vermilion);
  letter-spacing: var(--tracking-wide);
}

.radar-page__main {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.coverage-note {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  max-width: 75ch;
}

.panel {
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-lg);
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.panel__stats {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.filter {
  flex: 1;
  min-width: 200px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--color-text);
  font-size: var(--text-sm);
}

.filter:focus {
  outline: none;
  border-color: var(--color-vermilion);
}

.radar-group__title {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin: 0 0 var(--space-3);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
}

.radar-group__count {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.pkg-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--hairline);
}

.pkg-row {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1.2fr) minmax(0, 1.6fr);
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--hairline);
  font-size: var(--text-sm);
}

.pkg-row__name {
  color: var(--color-text);
  text-decoration: none;
  overflow-wrap: anywhere;
}

.pkg-row__name:hover {
  color: var(--color-vermilion);
}

.pkg-row__latest {
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
}

.pkg-row__license {
  color: var(--color-text-tertiary);
  font-size: var(--text-xs);
  overflow-wrap: anywhere;
}

.pkg-row__flags {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.pkg-row__clean {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.empty,
.disclaimer {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

.disclaimer {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  max-width: 80ch;
}

@media (max-width: 720px) {
  .pkg-row {
    grid-template-columns: 1fr;
    gap: var(--space-1);
    padding: var(--space-3) 0;
  }

  .pkg-row__flags {
    justify-content: flex-start;
  }
}
</style>
