<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SITE_EMAIL, SITE_NAME_ZH, SITE_NAME_EN } from '../utils/site'
import { setPageMeta, setCanonical, upsertJsonLd } from '../utils/seo'

const route = useRoute()
const { t, locale } = useI18n()
const loc = computed(() => (locale.value.startsWith('en') ? 'en' : 'zh'))
const site = loc.value === 'en' ? SITE_NAME_EN : SITE_NAME_ZH
const mailHref = `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(t('services.mailSubject'))}`

/* Services 页结构化数据：ProfessionalService */
const serviceJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: t('services.title'),
  description: t('services.subtitle'),
  url: 'https://hao430.cn/services/',
  email: SITE_EMAIL,
  areaServed: 'Worldwide',
  serviceType: [
    'Technical Consulting',
    'AI Coding Workflow Advisory',
    'Full-Stack System Architecture',
  ],
}))

watchEffect(() => {
  setPageMeta({
    title: `${t('seo.services')} | ${site}`,
    description: t('services.subtitle'),
    type: 'website',
  })
  setCanonical(route.path)
  upsertJsonLd('services-ld', serviceJsonLd.value)
})
</script>

<template>
  <div class="services">
    <section class="page-header">
      <div class="container">
        <p class="services__badge">{{ t('services.badge') }}</p>
        <h1 class="page-header__title">{{ t('services.title') }}</h1>
        <p class="page-header__subtitle">{{ t('services.subtitle') }}</p>
      </div>
    </section>

    <!-- 服务重构与直接沟通主要区域 -->
    <main class="container container--narrow services-main">
      <!-- 状态与说明卡片 -->
      <article class="card status-card animate-fadeInUp">
        <div class="status-card__header">
          <span class="badge badge--vermilion">{{ t('services.status') }}</span>
          <span class="status-card__site mono">hao430.cn/services</span>
        </div>
        <p class="status-card__desc">{{ t('services.statusDesc') }}</p>
      </article>

      <!-- 定制化咨询与交流通道 -->
      <section class="card inquiry-card animate-fadeInUp delay-100">
        <div class="inquiry-card__head">
          <span class="badge badge--jade">Inquiry & Contact</span>
          <h2 class="inquiry-card__title">{{ t('services.inquiryTitle') }}</h2>
        </div>
        <p class="inquiry-card__desc">{{ t('services.inquiryDesc') }}</p>

        <div class="inquiry-card__actions">
          <a :href="mailHref" class="btn btn--primary btn--lg">
            {{ t('services.ctaButton') }}
          </a>
          <router-link to="/tools" class="btn btn--outline btn--lg">
            {{ t('nav.tools') }} →
          </router-link>
        </div>

        <p class="inquiry-card__fineprint mono">
          {{ t('services.fineprint') }}
        </p>
      </section>

      <!-- 站内关联 -->
      <section class="related-nav animate-fadeInUp delay-200">
        <router-link to="/blog" class="card related-card">
          <span class="related-card__sub mono">Read & Research</span>
          <h3 class="related-card__title">{{ t('nav.blog') }}</h3>
          <p class="related-card__desc">深入探索关于 Agent 安全、系统架构与技术选型的长文论述。</p>
        </router-link>
        <router-link to="/about" class="card related-card">
          <span class="related-card__sub mono">Profile & Bio</span>
          <h3 class="related-card__title">{{ t('nav.about') }}</h3>
          <p class="related-card__desc">了解过往全栈研发经历、核心工程沉淀与独立研究方向。</p>
        </router-link>
      </section>
    </main>
  </div>
</template>

<style scoped>
.services {
  padding-top: var(--header-height);
  padding-bottom: var(--space-16);
}

.services__badge {
  display: inline-block;
  margin-bottom: var(--space-4);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-wide);
  color: var(--color-gold);
  border: 1px solid var(--color-gold);
  border-radius: var(--radius-sm);
  padding: var(--space-1) var(--space-3);
}

.services-main {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  margin-top: var(--space-8);
}

/* 状态说明卡片 */
.status-card {
  padding: var(--space-6) var(--space-8);
  border-radius: var(--radius-lg);
  border-left: 3px solid var(--color-vermilion);
}

.status-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.status-card__site {
  font-size: var(--text-xs);
  color: var(--color-text-faint);
}

.status-card__desc {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

/* 咨询通道卡片 */
.inquiry-card {
  padding: var(--space-8);
  border-radius: var(--radius-lg);
  background: var(--color-ink-light);
  border: 1px solid var(--color-ink-border);
}

.inquiry-card__head {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.inquiry-card__title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin: 0;
  color: var(--color-text);
}

.inquiry-card__desc {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-8);
  max-width: 65ch;
}

.inquiry-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.btn--lg {
  padding: var(--space-3) var(--space-8);
  font-size: var(--text-base);
}

.inquiry-card__fineprint {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin: 0;
}

/* 站内导流 */
.related-nav {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 640px) {
  .related-nav {
    grid-template-columns: 1fr 1fr;
  }
}

.related-card {
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base);
}

.related-card:hover {
  transform: translateY(-3px);
  border-color: rgba(201, 79, 61, 0.4);
  box-shadow: var(--shadow-card);
}

.related-card__sub {
  font-size: var(--text-xs);
  color: var(--color-vermilion);
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: var(--space-2);
}

.related-card__title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin: 0 0 var(--space-2);
  color: var(--color-text);
}

.related-card__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}
</style>
