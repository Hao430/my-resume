<script setup lang="ts">
import type { Honor } from '../types/resume'

defineProps<{
  honors: Honor[]
}>()
</script>

<template>
  <section id="honors" class="honors">
    <div class="container">
      <h2 class="section-title">荣誉证书</h2>
      <div class="honors__list">
        <div
          v-for="honor in honors"
          :key="honor.name"
          class="honor-card"
        >
          <div class="honor-card__icon">🏆</div>
          <div class="honor-card__info">
            <h3 class="honor-card__name">{{ honor.name }}</h3>
            <span class="honor-card__level">{{ honor.level }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.honors {
  padding: var(--spacing-3xl) 0;
  background-color: var(--bg-secondary);
}

.section-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.honors__list {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.honor-card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  border: 1px solid var(--border-primary);
}

.honor-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.honor-card__icon {
  font-size: var(--text-2xl);
  flex-shrink: 0;
}

.honor-card__info {
  flex: 1;
}

.honor-card__name {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
}

.honor-card__level {
  font-size: var(--text-sm);
  color: var(--primary-color);
  background-color: var(--primary-light);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-weight: var(--font-medium);
  display: inline-block;
}

@media (max-width: 768px) {
  .section-title {
    font-size: var(--text-2xl);
  }

  .honors__list {
    grid-template-columns: 1fr;
  }
}
</style>