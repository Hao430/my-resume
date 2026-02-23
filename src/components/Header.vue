<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isScrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50
  })
})

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <header :class="['header', { 'header--scrolled': isScrolled }]">
    <div class="container header__container">
      <div class="header__logo">
        <h1>张豪</h1>
      </div>
      <nav class="header__nav">
        <button
          v-for="item in [
            { id: 'about', label: '关于我' },
            { id: 'skills', label: '技能' },
            { id: 'projects', label: '项目经验' },
            { id: 'experience', label: '工作经历' },
            { id: 'honors', label: '荣誉证书' }
          ]"
          :key="item.id"
          class="header__nav-item"
          @click="scrollToSection(item.id)"
        >
          {{ item.label }}
        </button>
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
  z-index: 1000;
  background-color: transparent;
  transition: all var(--transition-base);
  padding: var(--spacing-lg) 0;
}

.header--scrolled {
  background-color: var(--bg-primary);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-md) 0;
}

.header__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__logo h1 {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--primary-color);
  margin: 0;
}

.header__nav {
  display: flex;
  gap: var(--spacing-lg);
}

.header__nav-item {
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.header__nav-item:hover {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .header__nav {
    display: none;
  }
}
</style>