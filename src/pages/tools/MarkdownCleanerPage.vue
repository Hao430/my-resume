<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  DEFAULT_CLEAN_OPTIONS,
  cleanText,
  htmlToMarkdown,
  type CleanOptions,
} from '../../utils/text-clean'

const { t } = useI18n()

const input = ref('')
const copied = ref(false)
const options = ref<CleanOptions>({ ...DEFAULT_CLEAN_OPTIONS })

/** 开关顺序即 UI 顺序；labelKey 对应 tools.cleaner.<key> */
const OPTION_FIELDS: { key: keyof CleanOptions; labelKey: string }[] = [
  { key: 'stripMarkdown', labelKey: 'optStripMarkdown' },
  { key: 'removeEmoji', labelKey: 'optRemoveEmoji' },
  { key: 'stripHtml', labelKey: 'optStripHtml' },
  { key: 'collapseBlankLines', labelKey: 'optCollapseBlankLines' },
  { key: 'trimLines', labelKey: 'optTrimLines' },
  { key: 'normalizeCjkPunctuation', labelKey: 'optNormalizeCjkPunctuation' },
  { key: 'halfWidthAscii', labelKey: 'optHalfWidthAscii' },
]

const output = computed(() => cleanText(input.value, options.value))

const stats = computed(() => {
  const before = input.value.length
  const after = output.value.length
  const saved = before > 0 ? Math.max(0, Math.round((1 - after / before) * 100)) : 0
  return { before, after, saved }
})

function loadSample(): void {
  input.value = t('tools.cleaner.sampleText')
}

function clearAll(): void {
  input.value = ''
  copied.value = false
}

/** 把输入里的 HTML 片段就地转成 Markdown，便于二次清理 */
function convertHtmlToMarkdown(): void {
  input.value = htmlToMarkdown(input.value)
}

async function copyOutput(): Promise<void> {
  if (!output.value) return
  try {
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1600)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="cleaner-page">
    <section class="page-header">
      <div class="container">
        <p class="eyebrow page-header__eyebrow">
          <RouterLink to="/tools/">{{ t('tools.pageTitle') }}</RouterLink>
        </p>
        <h1 class="page-header__title animate-fadeInUp">
          <span class="page-header__accent">·</span>
          {{ t('tools.items.markdownCleaner.title') }}
        </h1>
        <p class="page-header__subtitle animate-fadeInUp delay-200">
          {{ t('tools.cleaner.pageSubtitle') }}
        </p>
      </div>
    </section>

    <main class="container cleaner-page__main">
      <p class="offline-note">
        <span class="badge badge--jade">{{ t('tools.cleaner.offlineBadge') }}</span>
        <span>{{ t('tools.cleaner.offlineNote') }}</span>
      </p>

      <!-- 输入 -->
      <section class="card panel">
        <div class="panel__head">
          <h2 class="panel__title">{{ t('tools.cleaner.inputLabel') }}</h2>
          <div class="panel__actions">
            <button type="button" class="btn btn--outline btn--sm" @click="loadSample">
              {{ t('tools.cleaner.sample') }}
            </button>
            <button type="button" class="btn btn--outline btn--sm" @click="convertHtmlToMarkdown">
              {{ t('tools.cleaner.convertHtml') }}
            </button>
            <button type="button" class="btn btn--outline btn--sm" @click="clearAll">
              {{ t('tools.cleaner.clear') }}
            </button>
          </div>
        </div>
        <textarea
          v-model="input"
          class="editor"
          rows="10"
          spellcheck="false"
          :placeholder="t('tools.cleaner.inputPlaceholder')"
        />
      </section>

      <!-- 选项 -->
      <section class="card panel">
        <div class="panel__head">
          <h2 class="panel__title">{{ t('tools.cleaner.optionsLabel') }}</h2>
        </div>
        <div class="options">
          <label v-for="field in OPTION_FIELDS" :key="field.key" class="option">
            <input v-model="options[field.key]" type="checkbox" />
            <span>{{ t(`tools.cleaner.${field.labelKey}`) }}</span>
          </label>
        </div>
      </section>

      <!-- 输出 -->
      <section class="card panel">
        <div class="panel__head">
          <h2 class="panel__title">{{ t('tools.cleaner.outputLabel') }}</h2>
          <div class="panel__actions">
            <span class="panel__stats mono">
              {{
                t('tools.cleaner.stats', {
                  before: stats.before,
                  after: stats.after,
                  saved: stats.saved,
                })
              }}
            </span>
            <button
              type="button"
              class="btn btn--primary btn--sm"
              :disabled="!output"
              @click="copyOutput"
            >
              {{ copied ? t('tools.cleaner.copied') : t('tools.cleaner.copy') }}
            </button>
          </div>
        </div>
        <textarea
          class="editor editor--output"
          rows="10"
          readonly
          spellcheck="false"
          :value="output"
          :placeholder="t('tools.cleaner.emptyOutput')"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.cleaner-page {
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

.cleaner-page__main {
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

.panel__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.panel__stats {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.editor {
  width: 100%;
  box-sizing: border-box;
  padding: var(--space-4);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-md);
  /* 卡片面是 --bg-secondary，输入框用页面底色形成内嵌效果（明暗主题均成立） */
  background: var(--bg-primary);
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  resize: vertical;
}

.editor:focus {
  outline: none;
  border-color: var(--color-vermilion);
}

.editor--output {
  color: var(--color-text-secondary);
}

.options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-3) var(--space-5);
}

.option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.option input {
  accent-color: var(--color-vermilion);
  cursor: pointer;
}

.btn--sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
