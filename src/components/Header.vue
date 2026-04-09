<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const headerRef = ref<HTMLElement | null>(null)

// 路由链接（演示入口已移除，内容整合到博客的"演示"筛选中）
const navItems = [
  { path: '/', label: '首页' },
  { path: '/about', label: '关于' },
  { path: '/blog', label: '博客' }
]

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
        <span class="header__logo-text">墨</span>
        <span class="header__logo-separator">·</span>
        <span class="header__logo-name">张豪</span>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="header__nav">
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

      <!-- Contact Button -->
      <a href="mailto:fervent430@163.com" class="header__contact btn btn--outline">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <span>联系我</span>
      </a>

      <!-- Mobile Menu Toggle -->
      <button class="header__mobile-toggle" @click="toggleMobileMenu" aria-label="菜单">
        <span :class="['header__hamburger', { 'header__hamburger--open': isMobileMenuOpen }]">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div :class="['header__mobile-menu', { 'header__mobile-menu--open': isMobileMenuOpen }]">
      <nav class="header__mobile-nav">
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
          联系我
        </a>
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
  background-color: transparent;
  transition:
    background-color var(--transition-base),
    box-shadow var(--transition-base),
    padding var(--transition-base);
  padding: var(--space-5) 0;
}

.header--scrolled {
  background-color: rgba(10, 10, 11, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 var(--color-ink-border);
  padding: var(--space-4) 0;
}

.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
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

.header__logo:hover {
  color: var(--color-vermilion);
}

.header__logo-text {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-vermilion);
}

.header__logo-separator {
  color: var(--color-ink-border);
  font-size: var(--text-lg);
}

.header__logo-name {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
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
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.header__nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--color-vermilion);
  transition: all var(--transition-fast);
  transform: translateX(-50%);
}

.header__nav-item:hover {
  color: var(--color-text);
}

.header__nav-item:hover::after {
  width: 60%;
}

.header__nav-item--active {
  color: var(--color-vermilion);
}

.header__nav-item--active::after {
  width: 60%;
}

/* Contact Button */
.header__contact {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  padding: var(--space-2) var(--space-4);
}

/* Mobile Toggle */
.header__mobile-toggle {
  display: none;
  padding: var(--space-2);
  background: none;
  border: none;
  cursor: pointer;
}

.header__hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  gap: 5px;
}

.header__hamburger span {
  display: block;
  width: 18px;
  height: 2px;
  background-color: var(--color-text);
  border-radius: 1px;
  transition: all var(--transition-fast);
}

.header__hamburger--open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.header__hamburger--open span:nth-child(2) {
  opacity: 0;
}

.header__hamburger--open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile Menu */
.header__mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: rgba(10, 10, 11, 0.98);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--color-ink-border);
  padding: var(--space-4) 0;
  opacity: 0;
  transform: translateY(-10px);
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
  padding: 0 var(--space-4);
}

.header__mobile-nav-item {
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-display);
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.header__mobile-nav-item:hover {
  color: var(--color-text);
  background-color: var(--color-ink-light);
}

/* Responsive */
@media (max-width: 768px) {
  .header__nav,
  .header__contact {
    display: none;
  }

  .header__mobile-toggle {
    display: block;
  }

  .header__mobile-menu {
    display: block;
  }
}
</style>
