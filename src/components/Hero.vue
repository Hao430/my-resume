<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const tags = [
  'AI Workflow Advisory',
  'Code Security Audit',
  'Agent & Multi-Agent',
  'DocLake / RAG',
  'Full-Stack Architecture',
  'TypeScript · Python'
]
</script>

<template>
  <section class="hero">
    <!-- 背景氛围 -->
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__glow hero__glow--1"></div>
      <div class="hero__glow hero__glow--2"></div>
      <div class="hero__grid"></div>
    </div>

    <div class="container hero__inner">
      <!-- 左栏：主文案 -->
      <div class="hero__main">
        <p class="eyebrow hero__eyebrow animate-fadeInUp">{{ t('hero.greeting') || 'Consultant · Researcher · Maker' }}</p>
        <h1 class="hero__title animate-fadeInUp delay-100">
          <span class="hero__title-mark">{{ t('hero.titleAccent') }}</span>{{ t('hero.titleRest') }}
        </h1>
        <p class="hero__subtitle animate-fadeInUp delay-200">
          {{ t('hero.subtitle') }}<span class="hero__cursor" aria-hidden="true">|</span>
        </p>
        <p class="hero__description animate-fadeInUp delay-300">
          {{ t('hero.description') }}
        </p>

        <div class="hero__actions animate-fadeInUp delay-400">
          <router-link to="/services" class="btn btn--primary">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            {{ t('hero.services') }}
          </router-link>
          <router-link to="/about" class="btn btn--outline">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            {{ t('hero.aboutMe') }}
          </router-link>
          <router-link to="/blog" class="btn btn--ghost">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            {{ t('hero.readBlog') }}
          </router-link>
        </div>
      </div>

      <!-- 右栏：技术与能力标签墙 -->
      <aside class="hero__side animate-fadeInUp delay-300" aria-label="stack">
        <div class="hero__panel card card--inset">
          <p class="hero__panel-label mono">{{ t('hero.stackLabel') || 'Capabilities' }}</p>
          <div class="hero__tag-cloud">
            <span v-for="tag in tags" :key="tag" class="hero__tag">{{ tag }}</span>
          </div>
          <div class="hero__panel-footer">
            <span class="hero__line" aria-hidden="true"></span>
            <span class="hero__panel-note mono">hao430.cn · Advisory & Systems</span>
          </div>
        </div>
      </aside>
    </div>

    <!-- 滚动提示 -->
    <a href="#content" class="hero__scroll-hint" :aria-label="t('hero.scrollDown')">
      <span class="hero__scroll-text">{{ t('hero.scrollDown') }}</span>
      <span class="hero__scroll-arrow" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </span>
    </a>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding: var(--header-height) var(--gutter) 4rem;
  overflow: hidden;
}

/* 背景 */
.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
}
.hero__glow--1 { width: 520px; height: 520px; top: -16%; right: -8%; background: var(--ambient-glow-1); }
.hero__glow--2 { width: 460px; height: 460px; bottom: -18%; left: -10%; background: var(--ambient-glow-2); }

/* 极淡网格，编辑部刻度感 */
.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(720px 520px at 30% 40%, #000 0%, transparent 72%);
  -webkit-mask-image: radial-gradient(720px 520px at 30% 40%, #000 0%, transparent 72%);
}

.hero__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr minmax(280px, 400px);
  gap: clamp(2rem, 6vw, 4.5rem);
  align-items: center;
}

.hero__main {
  max-width: 640px;
}

.hero__eyebrow {
  margin-bottom: var(--space-5);
}

.hero__title {
  font-size: clamp(2.6rem, 8vw, 4.6rem);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-tight);
  line-height: 1.02;
  margin-bottom: var(--space-4);
}

.hero__title-mark {
  color: var(--color-vermilion);
  position: relative;
}

.hero__title-mark::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0.04em;
  width: 100%;
  height: 0.06em;
  background: linear-gradient(90deg, var(--color-vermilion), transparent);
  opacity: 0.55;
}

.hero__subtitle {
  font-size: clamp(1.1rem, 2.4vw, 1.35rem);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  letter-spacing: 0.01em;
  margin-bottom: var(--space-6);
}

.hero__cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: var(--color-vermilion);
  margin-left: 3px;
  animation: blink 1.1s step-end infinite;
  vertical-align: -0.12em;
}
@keyframes blink { 50% { opacity: 0; } }

.hero__description {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  max-width: 48ch;
  margin-bottom: var(--space-8);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

/* 右侧面板 */
.hero__side { width: 100%; }

.hero__panel {
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.hero__panel-label {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}

.hero__tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.hero__tag {
  padding: 0.44rem 0.9rem;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  background: var(--surface-1);
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-full);
  transition: color var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
}

.hero__tag:hover {
  color: var(--color-vermilion);
  border-color: rgba(201, 79, 61, 0.5);
  transform: translateY(-2px);
}

.hero__panel-footer {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--hairline);
}

.hero__line { flex: 1; height: 1px; background: var(--hairline-strong); }

.hero__panel-note {
  font-size: var(--text-xs);
  color: var(--color-text-faint);
}

/* 滚动提示 */
.hero__scroll-hint {
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-tertiary);
  text-decoration: none;
}

.hero__scroll-text {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
}

.hero__scroll-arrow {
  animation: bounce 2.2s var(--ease-in-out) infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

/* 响应式 */
@media (max-width: 900px) {
  .hero { align-items: flex-start; padding-top: calc(var(--header-height) + 2.5rem); }
  .hero__inner { grid-template-columns: 1fr; gap: var(--space-8); }
  .hero__side { max-width: 460px; }
  .hero__scroll-hint { display: none; }
}

@media (max-width: 640px) {
  .hero__actions { flex-direction: column; width: 100%; }
  .hero__actions .btn { width: 100%; justify-content: center; }
}
</style>
