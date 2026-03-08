<script setup lang="ts">
import type { ProjectExperience } from '../types/resume'

defineProps<{
  projects: ProjectExperience[]
}>()

// 处理项目链接的工具函数
const getProjectUrl = (url: string) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `https://${url}`
}
</script>

<template>
  <section id="projects" class="projects">
    <div class="container">
      <h2 class="section-title">项目经验</h2>
      <div class="projects__list">
        <div
          v-for="project in projects"
          :key="project.projectName"
          class="project-card"
        >
          <div class="project-card__header">
            <h3 class="project-card__title">{{ project.projectName }}</h3>
            <span class="project-card__period">{{ project.period }}</span>
          </div>
          <div class="project-card__role">
            <span class="project-card__role-label">角色：</span>
            <span class="project-card__role-value">{{ project.role }}</span>
          </div>
          <ul class="project-card__descriptions">
            <li
              v-for="(desc, index) in project.descriptions"
              :key="index"
              class="project-card__description"
            >
              {{ desc }}
            </li>
          </ul>
          <!-- 添加项目链接 -->
          <div v-if="project.url" class="project-card__link">
            <a :href="getProjectUrl(project.url)" target="_blank" rel="noopener noreferrer">
              查看项目 →
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects {
  padding: var(--spacing-3xl) 0;
  background-color: var(--bg-secondary);
}

.project-card__link {
  margin-top: var(--spacing-lg);
}

.project-card__link a {
  color: var(--primary-color);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.project-card__link a:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.section-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.projects__list {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.project-card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  border-left: 4px solid var(--primary-color);
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.project-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.project-card__title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.project-card__period {
  font-size: var(--text-sm);
  color: var(--primary-color);
  background-color: var(--primary-light);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
}

.project-card__role {
  margin-bottom: var(--spacing-lg);
  font-size: var(--text-base);
}

.project-card__role-label {
  color: var(--text-tertiary);
  font-weight: var(--font-medium);
}

.project-card__role-value {
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  margin-left: var(--spacing-xs);
}

.project-card__descriptions {
  list-style: none;
  padding: 0;
  margin: 0;
}

.project-card__description {
  position: relative;
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  color: var(--text-secondary);
  line-height: 1.7;
}

.project-card__description:last-child {
  margin-bottom: 0;
}

.project-card__description::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
}

@media (max-width: 768px) {
  .section-title {
    font-size: var(--text-2xl);
  }

  .project-card__header {
    flex-direction: column;
  }

  .project-card__period {
    align-self: flex-start;
  }
}
</style>