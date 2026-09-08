<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t } = useI18n()

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const headerRef = ref<HTMLElement | null>(null)

// 路由链接
const navItems = computed(() => [
  { path: '/', label: t('nav.home') },
  { path: '/about', label: t('nav.about') },
  { path: '/blog', label: t('nav.blog') },
  { path: '/services', label: t('nav.services') },
  { path: '/daily-brief', label: t('nav.dailyBrief') }
])

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  if (isMobileMenuOpen.value && headerRef.value && !headerRef.value.contains(event.target as Node)) {
    closeMobileMenu()
  }
}

// ESC 键关闭菜单
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

// 监听菜单状态，动态添加/移除外部点击监听
watch(isMobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', handleClickOutside, true)
    document.addEventListener('keydown', handleEscape)
  } else {
    document.removeEventListener('click', handleClickOutside, true)
    document.removeEventListener('keydown', handleEscape)
  }
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside, true)
  document.removeEventListener('keydown', handleEscape)
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header ref="headerRef" :class="['header', { 'header--scrolled': isScrolled }]">
    <div class="container header__container">
      <!-- Logo -->
      <router-link to="/" class="header__logo" @click="closeMobileMenu">
        <img src="/logo.svg" alt="Logo" class="header__logo-icon" width="26" height="26" />
        <span class="header__logo-text">{{ t('brand.mark') }}</span>
        <span class="header__logo-separator" aria-hidden="true">·</span>
        <span class="header__logo-name">{{ t('brand.name') }}</span>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="header__nav" aria-label="primary">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="header__nav-item"
          :class="{ 'header__nav-item--active': $route.path === item.path }"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <!-- Language Switcher & Contact -->
      <div class="header__actions">
        <LanguageSwitcher />
        <a href="mailto:fervent430@163.com" class="btn btn--outline header__contact">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span>{{ t('nav.contact') }}</span>
        </a>
      </div>

      <!-- Mobile Menu Toggle -->
      <button class="header__mobile-toggle" @click="toggleMobileMenu" :aria-label="t('nav.menu')" :aria-expanded="isMobileMenuOpen">
        <span :class="['header__hamburger', { 'header__hamburger--open': isMobileMenuOpen }]">
          <span></span><span></span><span></span>
        </span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div :class="['header__mobile-menu', { 'header__mobile-menu--open': isMobileMenuOpen }]">
      <nav class="header__mobile-nav" aria-label="mobile">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="header__mobile-nav-item"
          @click="closeMobileMenu"
        >
          {{ item.label }}
        </router-link>
        <a href="mailto:fervent430@163.com" class="header__mobile-nav-item" @click="closeMobileMenu">
          {{ t('nav.contact') }}
        </a>
        <div class="header__mobile-lang">
          <LanguageSwitcher />
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-header);
  background: transparent;
  border-bottom: 1px solid transparent;
  transition:
    background var(--transition-base),
    border-color var(--transition-base),
    backdrop-filter var(--transition-base),
    box-shadow var(--transition-base);
}

.header--scrolled {
  background: rgba(11, 11, 13, 0.82);
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  border-bottom-color: var(--hairline);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
}

.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  height: var(--header-height);
}

/* Logo */
.header__logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  color: var(--color-text);
  transition: color var(--transition-fast);
}

.header__logo:hover { color: var(--color-vermilion); }

.header__logo-icon {
  flex-shrink: 0;
  transition: transform var(--transition-base);
  filter: drop-shadow(0 0 6px rgba(201, 79, 61, 0.35));
}

.header__logo:hover .header__logo-icon { transform: rotate(-6deg) scale(1.06); }

.header__logo-text {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: var(--font-bold);
  color: var(--color-vermilion);
  line-height: 1;
}

.header__logo-separator {
  color: var(--color-ink-border);
  font-size: 1.1rem;
}

.header__logo-name {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wide);
}

/* Navigation */
.header__nav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.header__nav-item {
  position: relative;
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: color var(--transition-fast), background var(--transition-fast);
}

/* 滑动下划线 */
.header__nav-item::after {
  content: '';
  position: absolute;
  left: var(--space-4);
  right: var(--space-4);
  bottom: 2px;
  height: 2px;
  border-radius: 2px;
  background: var(--color-vermilion);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition-base) var(--ease-out);
}

.header__nav-item:hover {
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.04);
}

.header__nav-item:hover::after { transform: scaleX(1); }

.header__nav-item--active { color: var(--color-text); }
.header__nav-item--active::after { transform: scaleX(1); }

/* Actions */
.header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.header__contact {
  gap: var(--space-2);
  padding: 0.5rem 1.05rem;
}

/* Mobile Toggle */
.header__mobile-toggle {
  display: none;
  padding: var(--space-2);
}

.header__hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 24px;
  height: 24px;
  gap: 5px;
}

.header__hamburger span {
  display: block;
  width: 18px;
  height: 2px;
  background-color: var(--color-text);
  border-radius: 2px;
  transition: all var(--transition-base);
}

.header__hamburger--open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.header__hamburger--open span:nth-child(2) { opacity: 0; }
.header__hamburger--open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile Menu */
.header__mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(11, 11, 13, 0.97);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--hairline);
  padding: var(--space-4) 0 var(--space-6);
  opacity: 0;
  transform: translateY(-8px);
  pointer-events: none;
  transition: all var(--transition-base);
}

.header__mobile-menu--open {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.header__mobile-nav {
  display: flex;
  flex-direction: column;
  padding-inline: var(--gutter);
}

.header__mobile-nav-item {
  padding: var(--space-3) var(--space-2);
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  border-bottom: 1px solid var(--hairline);
  transition: color var(--transition-fast), background var(--transition-fast), padding-left var(--transition-fast);
}

.header__mobile-nav-item:last-of-type { border-bottom: none; }

.header__mobile-nav-item:hover {
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.03);
  padding-left: var(--space-4);
}

.header__mobile-lang {
  padding: var(--space-4) var(--space-2) 0;
  display: flex;
  justify-content: flex-start;
}

/* Responsive */
@media (max-width: 820px) {
  .header__nav,
  .header__actions { display: none; }
  .header__mobile-toggle { display: block; }
  .header__mobile-menu { display: block; }
}
</style>
