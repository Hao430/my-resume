<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { OSV_ECOSYSTEM, formatVulnRange, type PackageRecord } from '../../utils/deps'

const { t } = useI18n()
const route = useRoute()

const record = ref<PackageRecord | null>(null)
const loading = ref(true)

/**
 * 每包明细按需加载——绝不能进首屏。
 * 实测：索引 156 个包的完整记录是 1.5 MB（gzip 120 KB），
 * 而最大的单包 tensorflow.json 就有 615 KB。
 */
const loaders = import.meta.glob<{ default: PackageRecord }>('../../data/deps/packages/**/*.json')

/** 作用域包在 URL 里是多段（npm/angular/core），故用可重复参数 :pkg+ 收成数组 */
const target = computed(() => {
  const system = String(route.params.system ?? '')
  const raw = route.params.pkg
  const segments = (Array.isArray(raw) ? raw : [raw]).map((part) => String(part ?? ''))
  return { system, slug: segments.filter(Boolean).join('/') }
})

watch(
  target,
  async ({ system, slug }) => {
    loading.value = true
    record.value = null
    const loader = loaders[`../../data/deps/packages/${system}/${slug}.json`]
    if (loader) {
      const mod = await loader()
      record.value = mod.default
    }
    loading.value = false
  },
  { immediate: true },
)

const SEVERITY_KEY: Record<string, string> = {
  LOW: 'tools.radar.severityLow',
  MODERATE: 'tools.radar.severityModerate',
  HIGH: 'tools.radar.severityHigh',
  CRITICAL: 'tools.radar.severityCritical',
}

function severityLabel(severity: string | null): string {
  return severity && SEVERITY_KEY[severity]
    ? t(SEVERITY_KEY[severity])
    : t('tools.radar.severityUnknown')
}

function severityClass(severity: string | null): string {
  if (severity === 'CRITICAL' || severity === 'HIGH') return 'badge--vermilion'
  if (severity === 'MODERATE') return 'badge--gold'
  return 'badge--neutral'
}

/** 区间为空时不渲染该行，而不是显示空白标签 */
function rangesOf(vuln: PackageRecord['vulnerabilities'][number]): string[] {
  return vuln.ranges.map(formatVulnRange).filter(Boolean)
}

const osvUrl = (id: string) => `https://osv.dev/vulnerability/${id}`

/** 列表被截断时指向 OSV 完整列表，读者才有地方看全部（spec §4.5 要求） */
const osvListUrl = computed(() =>
  record.value
    ? `https://osv.dev/list?q=${encodeURIComponent(record.value.name)}&ecosystem=${encodeURIComponent(OSV_ECOSYSTEM[record.value.system])}`
    : '',
)

const truncated = computed(
  () => !!record.value && record.value.vulnerabilityCount > record.value.vulnerabilities.length,
)

/** 严重度分布按 CRITICAL → LOW → UNKNOWN 展示，便于一眼看出风险构成 */
const SEVERITY_DISPLAY_ORDER = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW', 'UNKNOWN']

const severityBreakdown = computed(() => {
  const counts = record.value?.severityCounts ?? {}
  return SEVERITY_DISPLAY_ORDER.filter((key) => (counts[key] ?? 0) > 0).map((key) => ({
    key,
    count: counts[key] ?? 0,
    label: severityLabel(key === 'UNKNOWN' ? null : key),
    className: severityClass(key === 'UNKNOWN' ? null : key),
  }))
})

function formatDate(iso: string | null): string {
  return iso ? iso.slice(0, 10) : ''
}
</script>

<template>
  <div class="pkg-page">
    <section class="page-header">
      <div class="container">
        <p class="eyebrow page-header__eyebrow">
          <RouterLink to="/tools/dependency-radar/">
            {{ t('tools.items.codeSecurityChecker.title') }}
          </RouterLink>
        </p>
        <h1 class="page-header__title animate-fadeInUp">
          <span class="page-header__accent">·</span>
          <span class="mono">{{ record?.name ?? target.slug }}</span>
        </h1>
        <p v-if="record" class="page-header__subtitle animate-fadeInUp delay-200">
          {{ record.system }} · {{ record.latest }}
        </p>
      </div>
    </section>

    <main class="container pkg-page__main">
      <p v-if="loading" class="state">{{ t('tools.radar.loading') }}</p>

      <template v-else-if="record">
        <!-- 结论先行：最新版是否受影响 -->
        <section class="card verdict" :class="record.latestAffected ? 'verdict--warn' : 'verdict--ok'">
          <p class="verdict__text">
            {{
              record.latestAffected
                ? t('tools.radar.pkgLatestAffected', { version: record.latest })
                : t('tools.radar.pkgLatestSafe', { version: record.latest })
            }}
          </p>
          <p class="verdict__hint">
            {{ t('tools.radar.pkgVerdictHint', { count: record.vulnerabilityCount }) }}
          </p>
        </section>

        <!-- 包元信息 -->
        <section class="card panel">
          <dl class="meta">
            <div class="meta__item">
              <dt>{{ t('tools.radar.pkgPublished') }}</dt>
              <dd class="mono">{{ record.publishedAt.slice(0, 10) }}</dd>
            </div>
            <div class="meta__item">
              <dt>{{ t('tools.radar.pkgLicense') }}</dt>
              <dd>{{ record.licenses.join(' · ') || '—' }}</dd>
            </div>
            <div class="meta__item">
              <dt>{{ t('tools.radar.pkgVersions') }}</dt>
              <dd class="mono">{{ record.versionCount }}</dd>
            </div>
            <div v-if="record.deprecated" class="meta__item">
              <dt>{{ t('tools.radar.pkgDeprecated') }}</dt>
              <dd>{{ record.deprecatedReason || t('tools.radar.deprecatedBadge') }}</dd>
            </div>
            <div v-if="record.homepage" class="meta__item">
              <dt>{{ t('tools.radar.pkgHomepage') }}</dt>
              <dd><a :href="record.homepage" target="_blank" rel="noopener noreferrer">{{ record.homepage }}</a></dd>
            </div>
            <div v-if="record.repo" class="meta__item">
              <dt>{{ t('tools.radar.pkgRepo') }}</dt>
              <dd><a :href="record.repo" target="_blank" rel="noopener noreferrer">{{ record.repo }}</a></dd>
            </div>
          </dl>
        </section>

        <!-- 历史漏洞 -->
        <section class="history">
          <h2 class="history__title">
            {{ t('tools.radar.pkgHistoryTitle') }}
            <span class="mono history__count">{{ record.vulnerabilityCount }}</span>
          </h2>

          <p v-if="severityBreakdown.length" class="severity-breakdown">
            <span
              v-for="item in severityBreakdown"
              :key="item.key"
              class="badge"
              :class="item.className"
            >
              {{ item.label }} {{ item.count }}
            </span>
          </p>

          <p v-if="record.vulnerabilityCount === 0" class="state">
            {{ t('tools.radar.pkgHistoryNone') }}
          </p>

          <p v-if="truncated" class="truncated-note">
            {{ t('tools.radar.pkgTruncated', { shown: record.vulnerabilities.length }) }}
            <a :href="osvListUrl" target="_blank" rel="noopener noreferrer">
              {{ t('tools.radar.pkgViewAll', { count: record.vulnerabilityCount }) }} →
            </a>
          </p>

          <!-- 注意：不能用 v-else 承接上面的 v-if——中间的截断提示会打断 v-if/v-else 链，
               导致被截断的包一张卡片都不渲染（测试抓到过） -->
          <ul v-if="record.vulnerabilityCount > 0" class="vuln-list">
            <li v-for="vuln in record.vulnerabilities" :key="vuln.id" class="card vuln">
              <div class="vuln__head">
                <a :href="osvUrl(vuln.id)" target="_blank" rel="noopener noreferrer" class="vuln__id mono">
                  {{ vuln.id }}
                </a>
                <span class="badge" :class="severityClass(vuln.severity)">
                  {{ severityLabel(vuln.severity) }}
                </span>
              </div>
              <p class="vuln__summary">{{ vuln.summary }}</p>
              <p v-if="formatDate(vuln.published) || vuln.aliases.length" class="vuln__meta mono">
                <span v-if="formatDate(vuln.published)">{{ formatDate(vuln.published) }}</span>
                <span v-if="vuln.aliases.length">{{ vuln.aliases.join(' · ') }}</span>
              </p>
              <p v-if="rangesOf(vuln).length" class="vuln__ranges">
                <span class="vuln__ranges-label">{{ t('tools.radar.pkgRangeLabel') }}</span>
                <span v-for="r in rangesOf(vuln)" :key="r" class="mono vuln__range">{{ r }}</span>
              </p>
            </li>
          </ul>
        </section>

        <p class="disclaimer">{{ t('tools.radar.disclaimer', { date: record.fetchedAt }) }}</p>
      </template>

      <template v-else>
        <p class="state">{{ t('tools.radar.pkgNotFound') }}</p>
        <p class="state">
          <RouterLink to="/tools/dependency-radar/">{{ t('tools.radar.backToIndex') }}</RouterLink>
        </p>
      </template>
    </main>
  </div>
</template>

<style scoped>
.pkg-page {
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

.pkg-page__main {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.state {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.verdict {
  padding: var(--space-5) var(--space-6);
  border-radius: var(--radius-lg);
  border-left: 3px solid var(--hairline);
}

.verdict--ok {
  border-left-color: var(--color-jade);
}

.verdict--warn {
  border-left-color: var(--color-vermilion);
}

.verdict__text {
  margin: 0 0 var(--space-2);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text);
}

.verdict__hint {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

.panel {
  padding: var(--space-6);
  border-radius: var(--radius-lg);
}

.meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-4);
  margin: 0;
}

.meta__item dt {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-1);
}

.meta__item dd {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  overflow-wrap: anywhere;
}

.meta__item a {
  color: var(--color-link);
}

.history__title {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin: 0 0 var(--space-4);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
}

.history__count {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.vuln-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.vuln {
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
}

.vuln__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
  flex-wrap: wrap;
}

.vuln__id {
  font-size: var(--text-xs);
  color: var(--color-link);
}

.vuln__summary {
  margin: 0 0 var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text);
  line-height: var(--leading-relaxed);
}

.vuln__meta {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin: 0 0 var(--space-2);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.severity-breakdown {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin: 0 0 var(--space-4);
}

.truncated-note {
  margin: 0 0 var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

.truncated-note a {
  color: var(--color-link);
}

.vuln__ranges {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin: 0;
}

.vuln__ranges-label {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.vuln__range {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  padding: 0 var(--space-2);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-sm, 4px);
}

.disclaimer {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  line-height: var(--leading-relaxed);
  max-width: 80ch;
}
</style>
