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

/* 章节共 9 节，逐节取键（数组拆键模式，避免 i18n 数组渲染裸 key 的坑） */
const SECTIONS = 9
const sectionList = computed(() =>
  Array.from({ length: SECTIONS }, (_, i) => ({
    title: t(`privacy.sec${i + 1}Title`),
    body: t(`privacy.sec${i + 1}Body`),
  })),
)

watchEffect(() => {
  setPageMeta({
    title: `${t('seo.privacy')} | ${site}`,
    description: t('privacy.intro'),
    type: 'website',
  })
  setCanonical(route.path)
})
</script>

<template>
  <div class="privacy">
    <section class="page-header">
      <div class="container">
        <h1 class="page-header__title">
          <span class="page-header__accent">·</span>
          {{ t('privacy.pageTitle') }}
        </h1>
        <p class="page-header__subtitle">{{ t('privacy.updated') }}</p>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container container--narrow privacy-body">
        <p class="privacy-body__intro">{{ t('privacy.intro') }}</p>

        <article
          v-for="(sec, i) in sectionList"
          :key="i"
          class="privacy-section"
        >
          <h2 class="privacy-section__title">{{ sec.title }}</h2>
          <template v-for="(para, j) in sec.body.split('\n')" :key="j">
            <p v-if="para.trim()" class="privacy-section__body">{{ para.trim() }}</p>
          </template>
          <p v-if="i === sectionList.length - 1" class="privacy-section__body">
            <a :href="`mailto:${SITE_EMAIL}`" class="privacy-contact">{{ SITE_EMAIL }}</a>
          </p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-header {
  padding-bottom: var(--space-12);
}

@media (max-width: 768px) {
  .page-header {
    padding-top: calc(var(--header-height) + var(--space-8));
    padding-bottom: var(--space-8);
  }
  .page-header__title {
    font-size: var(--text-3xl);
  }
}

/* 正文显式左对齐（规则 #11：位于 .page-header 内部的内容型容器必须声明 text-align:left） */
.privacy-body {
  text-align: left;
}

.privacy-body__intro {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--space-8);
}

.privacy-section {
  margin-bottom: var(--space-8);
}

.privacy-section__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text);
  margin: 0 0 var(--space-3);
}

.privacy-section__body {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--space-2);
  white-space: pre-line;
}

.privacy-contact {
  color: var(--color-vermilion);
  text-decoration: none;
  border-bottom: 1px solid var(--color-vermilion-muted);
  transition: all var(--transition-fast);
}

.privacy-contact:hover {
  color: var(--color-text);
  border-bottom-color: var(--color-text);
}
</style>
