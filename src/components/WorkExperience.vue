<script setup lang="ts">
import type { WorkExperience } from '../types/resume'

defineProps<{
  experiences: WorkExperience[]
}>()
</script>

<template>
  <section id="experience" class="experience">
    <div class="container">
      <h2 class="section-title">工作经历</h2>
      <div class="experience__list">
        <div
          v-for="exp in experiences"
          :key="exp.company + exp.period"
          class="experience-card"
        >
          <div class="experience-card__header">
            <div class="experience-card__info">
              <h3 class="experience-card__company">{{ exp.company }}</h3>
              <p class="experience-card__position">{{ exp.position }}</p>
            </div>
            <span class="experience-card__period">{{ exp.period }}</span>
          </div>
          <ul class="experience-card__achievements">
            <li
              v-for="(achievement, index) in exp.achievements"
              :key="index"
              class="experience-card__achievement"
            >
              {{ achievement }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.experience {
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

.experience__list {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.experience-card {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  transition: all var(--transition-base);
  border: 1px solid var(--border-primary);
}

.experience-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.experience-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--border-primary);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.experience-card__info {
  flex: 1;
}

.experience-card__company {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
}

.experience-card__position {
  font-size: var(--text-base);
  color: var(--primary-color);
  font-weight: var(--font-medium);
  margin: 0;
}

.experience-card__period {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  background-color: var(--bg-tertiary);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
}

.experience-card__achievements {
  list-style: none;
  padding: 0;
  margin: 0;
}

.experience-card__achievement {
  position: relative;
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  color: var(--text-secondary);
  line-height: 1.7;
}

.experience-card__achievement:last-child {
  margin-bottom: 0;
}

.experience-card__achievement::before {
  content: '▪';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: var(--font-bold);
}

@media (max-width: 768px) {
  .section-title {
    font-size: var(--text-2xl);
  }

  .experience-card__header {
    flex-direction: column;
  }

  .experience-card__period {
    align-self: flex-start;
  }
}
</style>