<script setup lang="ts">
import type { ResumeData } from '../types/resume'

defineProps<{
  summary: ResumeData['professionalSummary']
}>()
</script>

<template>
  <section class="professional-summary">
    <div class="container">
      <h2 class="section-title">个人简介</h2>
      <div class="professional-summary__content">
        <div class="professional-summary__item">
          <div class="professional-summary__icon">💪</div>
          <p class="professional-summary__text">{{ summary.strong }}</p>
        </div>
        <div class="professional-summary__item">
          <div class="professional-summary__icon">🎯</div>
          <p class="professional-summary__text">{{ summary.comprehensive }}</p>
        </div>
        <div class="professional-summary__item">
          <div class="professional-summary__icon">✨</div>
          <p class="professional-summary__text">{{ summary.outstanding }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.professional-summary {
  padding: var(--spacing-3xl) 0;
  background-color: var(--bg-primary);
}

.section-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.professional-summary__content {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.professional-summary__item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  background-color: var(--bg-secondary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.professional-summary__item:hover {
  transform: translateX(8px);
  box-shadow: var(--shadow-sm);
}

.professional-summary__icon {
  font-size: var(--text-2xl);
  flex-shrink: 0;
}

.professional-summary__text {
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
  font-size: var(--text-base);
}

@media (max-width: 768px) {
  .section-title {
    font-size: var(--text-2xl);
  }

  .professional-summary__item {
    flex-direction: column;
    text-align: center;
  }

  .professional-summary__item:hover {
    transform: translateY(-4px);
  }
}
</style>