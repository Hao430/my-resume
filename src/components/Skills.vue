<script setup lang="ts">
import type { Skill } from '../types/resume'

defineProps<{
  skills: Skill[]
}>()

const skillCategories = {
  professional: '专业技能',
  technical: '技术能力',
  tools: '工具与平台'
}
</script>

<template>
  <section id="skills" class="skills">
    <div class="container">
      <h2 class="section-title">专业技能</h2>
      <div class="skills__grid">
        <div
          v-for="(categorySkills, category) in {
            professional: skills.filter(s => s.category === 'professional'),
            technical: skills.filter(s => s.category === 'technical'),
            tools: skills.filter(s => s.category === 'tools')
          }"
          :key="category"
          v-show="categorySkills.length > 0"
          class="skills__category"
        >
          <h3 class="skills__category-title">{{ skillCategories[category as keyof typeof skillCategories] }}</h3>
          <div class="skills__list">
            <span
              v-for="skill in categorySkills"
              :key="skill.name"
              class="skill-tag"
            >
              {{ skill.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills {
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

.skills__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  max-width: 1000px;
  margin: 0 auto;
}

.skills__category {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  transition: all var(--transition-base);
}

.skills__category:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.skills__category-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--primary-color);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--primary-light);
}

.skills__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.skill-tag {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--primary-light);
  color: var(--primary-color);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all var(--transition-fast);
}

.skill-tag:hover {
  background-color: var(--primary-color);
  color: white;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .skills__grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: var(--text-2xl);
  }
}
</style>