<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const toggleLanguage = () => {
  const newLocale = locale.value === 'zh' ? 'en' : 'zh'
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
  // Update HTML lang attribute
  document.documentElement.lang = newLocale === 'zh' ? 'zh-CN' : 'en'
}
</script>

<template>
  <button class="lang-switcher" @click="toggleLanguage" :title="locale === 'zh' ? 'Switch to English' : '切换到中文'">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
    <span class="lang-switcher__text">{{ locale === 'zh' ? 'EN' : '中' }}</span>
  </button>
</template>

<style scoped>
.lang-switcher {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: none;
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: var(--text-sm);
  font-family: var(--font-display);
  transition: all var(--transition-fast);
}

.lang-switcher:hover {
  color: var(--color-vermilion);
  border-color: var(--color-vermilion-muted);
}

.lang-switcher__text {
  font-weight: var(--font-medium);
}
</style>
