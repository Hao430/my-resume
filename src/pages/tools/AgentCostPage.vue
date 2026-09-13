<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  MODEL_PRICING,
  PRICING_AS_OF,
  computeCost,
  findModel,
  summarize,
  type CacheMode,
  type UsageShape,
} from '../../utils/agent-cost'

const { t } = useI18n()

const modelId = ref(MODEL_PRICING[0]?.id ?? '')
const turns = ref(20)
const prefixTokens = ref(2000)
const inputPerTurn = ref(500)
const outputPerTurn = ref(500)
const secondsPerTurn = ref(30)
const cacheMode = ref<CacheMode>('ttl5m')

const pricing = computed(() => findModel(modelId.value) ?? MODEL_PRICING[0]!)

const usage = computed<UsageShape>(() => ({
  turns: Math.max(1, Math.min(500, Math.round(turns.value) || 1)),
  prefixTokens: Math.max(0, Math.round(prefixTokens.value) || 0),
  inputPerTurn: Math.max(0, Math.round(inputPerTurn.value) || 0),
  outputPerTurn: Math.max(0, Math.round(outputPerTurn.value) || 0),
}))

const uncached = computed(() => computeCost(pricing.value, usage.value, 'off'))
const cached = computed(() =>
  computeCost(pricing.value, usage.value, cacheMode.value, {
    secondsPerTurn: Math.max(0, Math.round(secondsPerTurn.value) || 0),
  }),
)

/** 缓存未生效时不得展示任何收益——那等于骗用户（spec §4.4） */
const showSavings = computed(() => cacheMode.value !== 'off' && cached.value.cacheEffective)
const savings = computed(() => uncached.value.totalCost - cached.value.totalCost)
const savingsPercent = computed(() =>
  uncached.value.totalCost > 0 ? (savings.value / uncached.value.totalCost) * 100 : 0,
)

/** 第几轮起开缓存才划算。单轮必然亏——付了写入溢价却还没有东西可读 */
const breakEvenTurn = computed(() => {
  if (cacheMode.value === 'off') return null
  for (let n = 1; n <= usage.value.turns; n += 1) {
    const probe = { ...usage.value, turns: n }
    const withoutCache = computeCost(pricing.value, probe, 'off')
    const withCache = computeCost(pricing.value, probe, cacheMode.value, {
      secondsPerTurn: Math.max(0, Math.round(secondsPerTurn.value) || 0),
    })
    if (withCache.cacheEffective && withCache.totalCost < withoutCache.totalCost) return n
  }
  return null
})

/** 轮数多时抽样展示，避免几十行明细把页面撑爆 */
const sampledTurns = computed(() => {
  const all = uncached.value.turns.map((turn, index) => ({
    ...turn,
    cachedCost: cached.value.turns[index]?.cost ?? 0,
  }))
  if (all.length <= 8) return all
  const picked = new Map<number, (typeof all)[number]>()
  for (const turn of [1, 2, Math.round(all.length / 2), all.length - 1, all.length]) {
    const item = all[turn - 1]
    if (item) picked.set(turn, item)
  }
  // 补齐到至少 5 行，便于看出增长趋势
  for (let i = 1; picked.size < 5 && i <= all.length; i += Math.ceil(all.length / 5)) {
    const item = all[i - 1]
    if (item) picked.set(i, item)
  }
  return [...picked.values()].sort((a, b) => a.turn - b.turn)
})

/**
 * token 明细按 API 的 usage 口径拆分，让读者能与实际账单逐个对照。
 * 四类小计之和恒等于总价（由单测守着）。
 */
const summary = computed(() => summarize(cached.value, pricing.value))

const tokenRows = computed(() => {
  const s = summary.value
  return [
    {
      key: 'cacheRead',
      labelKey: 'rowCacheRead',
      tokens: s.cacheReadTokens,
      rate: s.rates.cacheRead,
      cost: s.costs.cacheRead,
    },
    {
      key: 'cacheWrite',
      labelKey: 'rowCacheWrite',
      tokens: s.cacheWriteTokens,
      rate: s.rates.cacheWrite,
      cost: s.costs.cacheWrite,
    },
    {
      key: 'uncached',
      labelKey: 'rowUncached',
      tokens: s.uncachedInputTokens,
      rate: s.rates.uncachedInput,
      cost: s.costs.uncachedInput,
    },
    {
      key: 'output',
      labelKey: 'rowOutput',
      tokens: s.outputTokens,
      rate: s.rates.output,
      cost: s.costs.output,
    },
  ]
})

const money = (value: number) => `$${value.toFixed(4)}`
const money5 = (value: number) => `$${value.toFixed(5)}`
/** 单价按每 1M token 展示，与定价页口径一致 */
const ratePerMillion = (rate: number) => `$${(rate * 1_000_000).toFixed(4)}`
const count = (value: number) => value.toLocaleString('en-US')
</script>

<template>
  <div class="cost-page">
    <section class="page-header">
      <div class="container">
        <p class="eyebrow page-header__eyebrow">
          <RouterLink to="/tools/">{{ t('tools.pageTitle') }}</RouterLink>
        </p>
        <h1 class="page-header__title animate-fadeInUp">
          <span class="page-header__accent">·</span>
          {{ t('tools.items.agentCost.title') }}
        </h1>
        <p class="page-header__subtitle animate-fadeInUp delay-200">
          {{ t('tools.cost.pageSubtitle') }}
        </p>
      </div>
    </section>

    <main class="container cost-page__main">
      <p class="offline-note">
        <span class="badge badge--jade">{{ t('tools.cost.offlineBadge') }}</span>
        <span>{{ t('tools.cost.offlineNote') }}</span>
      </p>

      <!-- 参数 -->
      <section class="card panel">
        <div class="panel__head">
          <h2 class="panel__title">{{ t('tools.cost.inputsLabel') }}</h2>
        </div>
        <div class="fields">
          <label class="field field--wide">
            <span class="field__label">{{ t('tools.cost.model') }}</span>
            <select v-model="modelId" class="field__control">
              <option v-for="model in MODEL_PRICING" :key="model.id" :value="model.id">
                {{ model.label }}
              </option>
            </select>
          </label>
          <label class="field">
            <span class="field__label">{{ t('tools.cost.turns') }}</span>
            <input v-model.number="turns" type="number" min="1" max="500" class="field__control" />
          </label>
          <label class="field">
            <span class="field__label">{{ t('tools.cost.prefixTokens') }}</span>
            <input v-model.number="prefixTokens" type="number" min="0" class="field__control" />
          </label>
          <label class="field">
            <span class="field__label">{{ t('tools.cost.inputPerTurn') }}</span>
            <input v-model.number="inputPerTurn" type="number" min="0" class="field__control" />
          </label>
          <label class="field">
            <span class="field__label">{{ t('tools.cost.outputPerTurn') }}</span>
            <input v-model.number="outputPerTurn" type="number" min="0" class="field__control" />
          </label>
          <label class="field">
            <span class="field__label">{{ t('tools.cost.secondsPerTurn') }}</span>
            <input v-model.number="secondsPerTurn" type="number" min="0" class="field__control" />
          </label>
        </div>
        <p class="hint">{{ t('tools.cost.usageHint') }}</p>
      </section>

      <!-- 缓存模式 -->
      <section class="card panel">
        <div class="panel__head">
          <h2 class="panel__title">{{ t('tools.cost.cacheMode') }}</h2>
        </div>
        <div class="modes">
          <label v-for="mode in (['off', 'ttl5m', 'ttl1h'] as CacheMode[])" :key="mode" class="mode">
            <input v-model="cacheMode" type="radio" :value="mode" />
            <span>{{ t(`tools.cost.mode_${mode}`) }}</span>
          </label>
        </div>
      </section>

      <!-- 结论 -->
      <section class="card panel result">
        <div class="result__numbers">
          <div class="result__item">
            <span class="result__label">{{ t('tools.cost.withoutCache') }}</span>
            <span class="result__value mono">{{ money(uncached.totalCost) }}</span>
          </div>
          <div class="result__item">
            <span class="result__label">{{ t('tools.cost.withCache') }}</span>
            <span class="result__value mono" :class="{ 'result__value--muted': !showSavings }">
              {{ money(cached.totalCost) }}
            </span>
          </div>
          <div v-if="showSavings" class="result__item result__item--highlight">
            <span class="result__label">{{ t('tools.cost.saved') }}</span>
            <span class="result__value mono">
              {{ money(savings) }} <small>({{ savingsPercent.toFixed(0) }}%)</small>
            </span>
          </div>
        </div>

        <p v-if="showSavings && breakEvenTurn" class="break-even">
          {{ t('tools.cost.breakEven', { turn: breakEvenTurn }) }}
        </p>

        <!-- 静默失效必须直说，不能只把开关摆在那里 -->
        <div v-if="cached.cacheInactiveReasons.length" class="warnings">
          <p v-if="cached.cacheInactiveReasons.includes('prefix-too-short')" class="warning">
            {{
              t('tools.cost.warnPrefixTooShort', {
                prefix: usage.prefixTokens,
                minimum: pricing.minCacheablePrefix,
              })
            }}
          </p>
          <p v-if="cached.cacheInactiveReasons.includes('ttl-expired')" class="warning">
            {{ t('tools.cost.warnTtlExpired', { seconds: Math.round(secondsPerTurn) }) }}
          </p>
        </div>
      </section>

      <!-- token 明细：口径与 API 的 usage 字段一致，便于与实际账单对照 -->
      <section class="card panel">
        <div class="panel__head">
          <h2 class="panel__title">{{ t('tools.cost.tokensTitle') }}</h2>
        </div>
        <table class="breakdown token-table">
          <thead>
            <tr>
              <th>{{ t('tools.cost.colCategory') }}</th>
              <th>{{ t('tools.cost.colTokens') }}</th>
              <th>{{ t('tools.cost.colRate') }}</th>
              <th>{{ t('tools.cost.colSubtotal') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tokenRows" :key="row.key" :class="{ 'is-zero': row.tokens === 0 }">
              <td>{{ t(`tools.cost.${row.labelKey}`) }}</td>
              <td class="mono">{{ count(row.tokens) }}</td>
              <td class="mono">{{ ratePerMillion(row.rate) }}</td>
              <td class="mono">{{ money5(row.cost) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">{{ t('tools.cost.total') }}</td>
              <td class="mono">{{ money(summary.totalCost) }}</td>
            </tr>
          </tfoot>
        </table>
        <p class="hint">{{ t('tools.cost.tokensHint') }}</p>
      </section>

      <!-- 逐轮明细 -->
      <section class="card panel">
        <div class="panel__head">
          <h2 class="panel__title">{{ t('tools.cost.breakdown') }}</h2>
          <span class="panel__stats mono">
            {{ t('tools.cost.turnsShown', { shown: sampledTurns.length, total: usage.turns }) }}
          </span>
        </div>
        <table class="breakdown turn-table">
          <thead>
            <tr>
              <th>{{ t('tools.cost.colTurn') }}</th>
              <th>{{ t('tools.cost.colWithout') }}</th>
              <th>{{ t('tools.cost.colWith') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in sampledTurns" :key="row.turn">
              <td class="mono">{{ row.turn }}</td>
              <td class="mono">{{ money5(row.cost) }}</td>
              <td class="mono">{{ money5(row.cachedCost) }}</td>
            </tr>
          </tbody>
        </table>
        <p class="hint">{{ t('tools.cost.growthHint') }}</p>
      </section>

      <p class="disclaimer">
        {{ t('tools.cost.disclaimer', { date: PRICING_AS_OF, model: pricing.label }) }}
      </p>
    </main>
  </div>
</template>

<style scoped>
.cost-page {
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

.cost-page__main {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.offline-note {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

.panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.panel__title {
  margin: 0;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text);
}

.panel__stats {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.field--wide {
  grid-column: span 2;
}

.field__label {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.field__control {
  width: 100%;
  box-sizing: border-box;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.field__control:focus {
  outline: none;
  border-color: var(--color-vermilion);
}

.modes {
  display: flex;
  gap: var(--space-5);
  flex-wrap: wrap;
}

.mode {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.mode input {
  accent-color: var(--color-vermilion);
  cursor: pointer;
}

.result__numbers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-5);
}

.result__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.result__item--highlight .result__value {
  color: var(--color-jade);
}

.result__label {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.result__value {
  font-size: var(--text-xl, 1.5rem);
  font-weight: var(--font-semibold);
  color: var(--color-text);
}

.result__value--muted {
  color: var(--color-text-tertiary);
}

.result__value small {
  font-size: var(--text-sm);
  font-weight: var(--font-regular, 400);
}

.break-even {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.warnings {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-left: 3px solid var(--color-vermilion);
  background: var(--bg-primary);
  border-radius: var(--radius-sm, 4px);
}

.warning {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

.breakdown {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.breakdown th,
.breakdown td {
  text-align: right;
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--hairline);
}

.breakdown th:first-child,
.breakdown td:first-child {
  text-align: left;
}

.breakdown th {
  font-size: var(--text-xs);
  font-weight: var(--font-regular, 400);
  color: var(--color-text-tertiary);
}

.token-table tbody tr.is-zero td {
  color: var(--color-text-faint, var(--color-text-tertiary));
}

.token-table tfoot td {
  border-bottom: none;
  border-top: 1px solid var(--color-ink-border, var(--hairline));
  font-weight: var(--font-semibold);
  color: var(--color-text);
}

.hint,
.disclaimer {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  line-height: var(--leading-relaxed);
  max-width: 80ch;
}

@media (max-width: 640px) {
  .field--wide {
    grid-column: span 1;
  }
}
</style>
