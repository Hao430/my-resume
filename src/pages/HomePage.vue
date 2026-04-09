<script setup lang="ts">
import Hero from '../components/Hero.vue'
import { resumeData } from '../data/resume'

// 最新项目（取前3个）
const recentProjects = resumeData.projectExperiences.slice(0, 3)

// 最新荣誉（取前2个）
const recentHonors = resumeData.honors.slice(0, 2)
</script>

<template>
  <div class="home">
    <Hero />

    <!-- 最新项目 -->
    <section class="section section--alt">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-title__accent">·</span>
            项目作品
          </h2>
          <router-link to="/about" class="section-more">
            查看全部
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>

        <div class="projects-grid">
          <article
            v-for="(project, index) in recentProjects"
            :key="project.projectName"
            class="project-card card animate-fadeInUp"
            :class="`delay-${(index + 1) * 100}`"
          >
            <div class="project-card__header">
              <h3 class="project-card__title">{{ project.projectName }}</h3>
              <span class="badge badge--vermilion">{{ project.role }}</span>
            </div>
            <p class="project-card__period">{{ project.period }}</p>
            <ul class="project-card__list">
              <li v-for="(desc, i) in project.descriptions.slice(0, 2)" :key="i">
                {{ desc }}
              </li>
            </ul>
            <a
              v-if="project.url"
              :href="project.url"
              target="_blank"
              rel="noopener"
              class="project-card__link"
            >
              查看项目
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </article>
        </div>
      </div>
    </section>

    <!-- 关于我预览 -->
    <section class="section">
      <div class="container">
        <div class="about-preview">
          <div class="about-preview__content">
            <h2 class="section-title">
              <span class="section-title__accent">·</span>
              关于我
            </h2>
            <p class="about-preview__text">
              {{ resumeData.professionalSummary.strong }}
            </p>
            <p class="about-preview__text">
              {{ resumeData.professionalSummary.comprehensive }}
            </p>
            <router-link to="/about" class="btn btn--primary mt-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              阅读完整简历
            </router-link>
          </div>
          <div class="about-preview__stats">
            <div class="stat-item">
              <span class="stat-item__value">{{ resumeData.projectExperiences.length }}</span>
              <span class="stat-item__label">项目经验</span>
            </div>
            <div class="stat-item">
              <span class="stat-item__value">{{ resumeData.workExperiences.length }}</span>
              <span class="stat-item__label">工作经历</span>
            </div>
            <div class="stat-item">
              <span class="stat-item__value">{{ resumeData.honors.length }}</span>
              <span class="stat-item__label">荣誉奖项</span>
            </div>
            <div class="stat-item">
              <span class="stat-item__value">{{ resumeData.skills.length }}</span>
              <span class="stat-item__label">技能标签</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 荣誉展示 -->
    <section class="section section--alt">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-title__accent">·</span>
            荣誉奖项
          </h2>
        </div>
        <div class="honors-grid">
          <div
            v-for="(honor, index) in recentHonors"
            :key="honor.name"
            class="honor-item card animate-fadeInUp"
            :class="`delay-${(index + 1) * 100}`"
          >
            <svg class="honor-item__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="6"/>
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
            <span class="honor-item__name">{{ honor.name }}</span>
            <span class="badge badge--gold">{{ honor.level }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Section Styles */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-8);
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.section-title__accent {
  color: var(--color-vermilion);
  font-size: var(--text-3xl);
  line-height: 1;
}

.section-more {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.section-more:hover {
  color: var(--color-vermilion);
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-6);
}

.project-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.project-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.project-card__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin: 0;
}

.project-card__period {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin: 0;
}

.project-card__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

.project-card__list li {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  padding-left: var(--space-4);
  position: relative;
}

.project-card__list li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--color-vermilion);
}

.project-card__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-vermilion);
  text-decoration: none;
  margin-top: auto;
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-ink-border);
  transition: all var(--transition-fast);
}

.project-card__link:hover {
  gap: var(--space-3);
}

/* About Preview */
.about-preview {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-12);
  align-items: center;
}

.about-preview__text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.about-preview__text:last-child {
  margin-bottom: 0;
}

.about-preview__stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
}

.stat-item {
  text-align: center;
  padding: var(--space-4);
  background-color: var(--color-ink-light);
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-lg);
}

.stat-item__value {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-vermilion);
  line-height: 1;
  margin-bottom: var(--space-2);
}

.stat-item__label {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
}

/* Honors Grid */
.honors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

.honor-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
}

.honor-item__icon {
  flex-shrink: 0;
  color: var(--color-gold);
}

.honor-item__name {
  flex: 1;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
}

/* Responsive */
@media (max-width: 768px) {
  .about-preview {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .about-preview__stats {
    order: -1;
    justify-content: center;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
}
</style>
