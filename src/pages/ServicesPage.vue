<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SITE_EMAIL, SITE_NAME_ZH, SITE_NAME_EN } from '../utils/site'
import { setPageMeta, setCanonical } from '../utils/seo'

const route = useRoute()
const { t, locale } = useI18n()
const loc = computed(() => (locale.value.startsWith('en') ? 'en' : 'zh'))
const site = loc.value === 'en' ? SITE_NAME_EN : SITE_NAME_ZH
const mailHref = `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(t('services.mailSubject'))}`
const pre = (i: number) => String(i)

watchEffect(() => {
  setPageMeta({
    title: `${t('seo.services')} | ${site}`,
    description: t('services.subtitle'),
    type: 'website',
  })
  setCanonical(route.path)
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

    <!-- 两项服务 -->
    <section class="section section--alt">
      <div class="container">
        <div class="services-grid">
          <article class="card service-card">
            <div class="service-card__head">
              <span class="badge badge--vermilion">01</span>
              <h2 class="service-card__title">{{ t('services.aTitle') }}</h2>
            </div>
            <p class="service-card__desc">{{ t('services.aDesc') }}</p>
            <ul class="service-card__points">
              <li v-for="i in 3" :key="`a${i}`">{{ t(`services.aPoints${pre(i)}`) }}</li>
            </ul>
            <p class="service-card__price">{{ t('services.aPrice') }}</p>
          </article>

          <article class="card service-card">
            <div class="service-card__head">
              <span class="badge badge--jade">02</span>
              <h2 class="service-card__title">{{ t('services.bTitle') }}</h2>
            </div>
            <p class="service-card__desc">{{ t('services.bDesc') }}</p>
            <ul class="service-card__points">
              <li v-for="i in 3" :key="`b${i}`">{{ t(`services.bPoints${pre(i)}`) }}</li>
            </ul>
            <p class="service-card__price">{{ t('services.bPrice') }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- 为什么找我 -->
    <section class="section">
      <div class="container container--narrow">
        <h2 class="section-title"><span class="section-title__accent">·</span>{{ t('services.whyTitle') }}</h2>
        <div class="why-grid">
          <div v-for="i in 3" :key="`w${i}`" class="why-item">
            <h3 class="why-item__title">{{ t(`services.why${i}Title`) }}</h3>
            <p class="why-item__body">{{ t(`services.why${i}Body`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 合作流程 -->
    <section class="section section--alt">
      <div class="container container--narrow">
        <h2 class="section-title"><span class="section-title__accent">·</span>{{ t('services.processTitle') }}</h2>
        <ol class="process">
          <li v-for="i in 3" :key="`p${i}`" class="process__step">
            <span class="process__num">{{ i }}</span>
            <h3 class="process__title">{{ t(`services.process${i}`) }}</h3>
            <p class="process__body">{{ t(`services.process${i}Body`) }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- CTA -->
    <section class="section services-cta">
      <div class="container container--narrow text-center">
        <h2 class="services-cta__title">{{ t('services.ctaTitle') }}</h2>
        <p class="services-cta__body">{{ t('services.ctaBody') }}</p>
        <a :href="mailHref" class="btn btn--primary btn--lg mt-8">{{ t('services.ctaButton') }}</a>
        <p class="services-cta__fineprint">{{ t('services.fineprint') }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.services {
  padding-top: var(--header-height);
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

.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.service-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-8);
}

.service-card__head {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.service-card__title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text);
}

.service-card__desc {
  color: var(--color-text-secondary);
  flex: 0 0 auto;
}

.service-card__points {
  list-style: none;
  margin: var(--space-6) 0;
  padding: 0;
  border-top: 1px solid var(--color-ink-border);
  padding-top: var(--space-5);
}

.service-card__points li {
  position: relative;
  padding-left: var(--space-6);
  margin-bottom: var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-text);
}

.service-card__points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-vermilion);
  opacity: 0.8;
}

.service-card__price {
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px dashed var(--color-ink-border);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-gold);
}

.why-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .why-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.why-item__title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-3);
  color: var(--color-text);
}

.why-item__body {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
}

.process {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .process {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }
}

.process__step {
  padding: var(--space-6);
  background-color: var(--color-ink-light);
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-lg);
}

.process__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--color-vermilion);
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
}

.process__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-2);
}

.process__body {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.services-cta {
  text-align: center;
}

.services-cta__title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-4);
}

.services-cta__body {
  color: var(--color-text-secondary);
  max-width: 36em;
  margin: 0 auto;
}

.btn--lg {
  padding: var(--space-4) var(--space-10);
  font-size: var(--text-base);
}

.services-cta__fineprint {
  margin-top: var(--space-8);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}
</style>
