<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '../stores/theme'

const { t } = useI18n()
const themeStore = useThemeStore()

const handleClick = () => {
  themeStore.cyclePreference()
}

const currentLabel = computed(() => {
  if (themeStore.preference === 'system') {
    return t('theme.system')
  }
  return themeStore.preference === 'dark' ? t('theme.dark') : t('theme.light')
})

const buttonTitle = computed(() => {
  if (themeStore.preference === 'system') {
    return `${t('theme.current')}: ${t('theme.system')} (${t('theme.active')}: ${themeStore.isDark ? t('theme.dark') : t('theme.light')}) · ${t('theme.clickToCycle')}`
  }
  return `${t('theme.current')}: ${themeStore.isDark ? t('theme.dark') : t('theme.light')} · ${t('theme.clickToCycle')}`
})
</script>

<template>
  <button
    class="theme-switcher"
    type="button"
    @click="handleClick"
    :title="buttonTitle"
    :aria-label="buttonTitle"
    :data-preference="themeStore.preference"
    :data-active="themeStore.activeTheme"
  >
    <!-- Sun icon (Light active) -->
    <svg
      v-if="!themeStore.isDark"
      class="theme-switcher__icon theme-switcher__icon--sun"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>

    <!-- Moon icon (Dark active) -->
    <svg
      v-else
      class="theme-switcher__icon theme-switcher__icon--moon"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>

    <span class="theme-switcher__text">{{ currentLabel }}</span>

    <!-- System preference auto badge indicator -->
    <span
      v-if="themeStore.preference === 'system'"
      class="theme-switcher__dot"
      aria-hidden="true"
    />
  </button>
</template>

<style scoped>
.theme-switcher {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.5rem 0.95rem;
  background: var(--surface-1);
  border: 1px solid var(--color-ink-muted);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: var(--text-sm);
  font-family: var(--font-fallback);
  font-weight: 600;
  transition:
    color var(--transition-fast),
    background var(--transition-fast),
    border-color var(--transition-fast),
    transform var(--transition-fast);
  user-select: none;
  -webkit-user-select: none;
}

.theme-switcher:hover {
  color: var(--color-text);
  border-color: var(--color-vermilion);
  background: var(--color-vermilion-muted);
  transform: translateY(-1px);
}

.theme-switcher__icon {
  flex-shrink: 0;
  opacity: 0.85;
  transition: transform var(--transition-base), opacity var(--transition-fast);
}

.theme-switcher:hover .theme-switcher__icon {
  opacity: 1;
  transform: rotate(18deg) scale(1.08);
}

.theme-switcher__text {
  line-height: 1;
  white-space: nowrap;
}

.theme-switcher__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--color-vermilion);
  opacity: 0.8;
  margin-left: -2px;
}
</style>
