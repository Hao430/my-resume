<script setup lang="ts">
import { resumeData } from '../data/resume'

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="about">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-header__title animate-fadeInUp">
          <span class="page-header__accent">·</span>
          关于我
        </h1>
        <p class="page-header__subtitle animate-fadeInUp delay-200">
          {{ resumeData.personalInfo.university }} · {{ resumeData.personalInfo.major }}
        </p>
      </div>
    </section>

    <!-- Navigation Tabs -->
    <div class="nav-tabs">
      <div class="container">
        <nav class="nav-tabs__list">
          <button
            v-for="tab in [
              { id: 'summary', label: '简介' },
              { id: 'skills', label: '技能' },
              { id: 'projects', label: '项目' },
              { id: 'experience', label: '经历' },
              { id: 'honors', label: '荣誉' }
            ]"
            :key="tab.id"
            class="nav-tabs__item"
            @click="scrollToSection(tab.id)"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Professional Summary -->
    <section id="summary" class="section">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__accent">·</span>
          专业简介
        </h2>
        <div class="summary-cards">
          <div class="summary-card card animate-fadeInUp">
            <div class="summary-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 class="summary-card__title">专业扎实</h3>
            <p class="summary-card__text">{{ resumeData.professionalSummary.strong }}</p>
          </div>
          <div class="summary-card card animate-fadeInUp delay-100">
            <div class="summary-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <h3 class="summary-card__title">能力全面</h3>
            <p class="summary-card__text">{{ resumeData.professionalSummary.comprehensive }}</p>
          </div>
          <div class="summary-card card animate-fadeInUp delay-200">
            <div class="summary-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h3 class="summary-card__title">素养突出</h3>
            <p class="summary-card__text">{{ resumeData.professionalSummary.outstanding }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section id="skills" class="section section--alt">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__accent">·</span>
          技能标签
        </h2>
        <div class="skills-categories">
          <!-- 技术技能 -->
          <div class="skill-category">
            <h3 class="skill-category__title">技术能力</h3>
            <div class="skill-tags">
              <span
                v-for="skill in resumeData.skills.filter(s => s.category === 'technical')"
                :key="skill.name"
                class="skill-tag"
              >
                {{ skill.name }}
              </span>
            </div>
          </div>
          <!-- 专业能力 -->
          <div class="skill-category">
            <h3 class="skill-category__title">专业能力</h3>
            <div class="skill-tags">
              <span
                v-for="skill in resumeData.skills.filter(s => s.category === 'professional')"
                :key="skill.name"
                class="skill-tag skill-tag--vermilion"
              >
                {{ skill.name }}
              </span>
            </div>
          </div>
          <!-- 工具 -->
          <div class="skill-category">
            <h3 class="skill-category__title">工具软件</h3>
            <div class="skill-tags">
              <span
                v-for="skill in resumeData.skills.filter(s => s.category === 'tools')"
                :key="skill.name"
                class="skill-tag skill-tag--gold"
              >
                {{ skill.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects -->
    <section id="projects" class="section">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__accent">·</span>
          项目经验
        </h2>
        <div class="timeline">
          <div
            v-for="(project, index) in resumeData.projectExperiences"
            :key="project.projectName"
            class="timeline-item animate-fadeInUp"
            :class="`delay-${(index % 3) * 100}`"
          >
            <div class="timeline-item__marker"></div>
            <div class="timeline-item__content card">
              <div class="timeline-item__header">
                <h3 class="timeline-item__title">{{ project.projectName }}</h3>
                <span class="badge badge--vermilion">{{ project.role }}</span>
              </div>
              <p class="timeline-item__period">{{ project.period }}</p>
              <ul class="timeline-item__list">
                <li v-for="(desc, i) in project.descriptions" :key="i">
                  {{ desc }}
                </li>
              </ul>
              <a
                v-if="project.url"
                :href="project.url"
                target="_blank"
                rel="noopener"
                class="timeline-item__link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                {{ project.url.startsWith('http') ? '访问项目' : '查看详情' }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Work Experience -->
    <section id="experience" class="section section--alt">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__accent">·</span>
          工作经历
        </h2>
        <div class="timeline">
          <div
            v-for="(exp, index) in resumeData.workExperiences"
            :key="exp.company + exp.period"
            class="timeline-item animate-fadeInUp"
            :class="`delay-${(index % 3) * 100}`"
          >
            <div class="timeline-item__marker timeline-item__marker--jade"></div>
            <div class="timeline-item__content card">
              <div class="timeline-item__header">
                <h3 class="timeline-item__title">{{ exp.position }}</h3>
                <span class="badge badge--jade">{{ exp.company }}</span>
              </div>
              <p class="timeline-item__period">{{ exp.period }}</p>
              <ul class="timeline-item__list">
                <li v-for="(achievement, i) in exp.achievements" :key="i">
                  {{ achievement }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Honors -->
    <section id="honors" class="section">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__accent">·</span>
          荣誉奖项
        </h2>
        <div class="honors-list">
          <div
            v-for="(honor, index) in resumeData.honors"
            :key="honor.name"
            class="honor-item card animate-fadeInUp"
            :class="`delay-${(index % 4) * 100}`"
          >
            <svg class="honor-item__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
/* Page Header */
.page-header {
  padding: calc(var(--header-height) + var(--space-12)) 0 var(--space-12);
  text-align: center;
}

.page-header__title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.page-header__accent {
  color: var(--color-vermilion);
  font-size: var(--text-5xl);
  line-height: 1;
}

.page-header__subtitle {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

/* Navigation Tabs */
.nav-tabs {
  position: sticky;
  top: var(--header-height);
  z-index: var(--z-sticky);
  background-color: rgba(10, 10, 11, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-ink-border);
  padding: var(--space-3) 0;
}

.nav-tabs__list {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.nav-tabs__item {
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.nav-tabs__item:hover {
  color: var(--color-text);
  background-color: var(--color-ink-light);
}

.nav-tabs__item:hover {
  color: var(--color-vermilion);
  background-color: var(--color-ink-light);
}

/* Section Title */
.section-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}

.section-title__accent {
  color: var(--color-vermilion);
  font-size: var(--text-3xl);
  line-height: 1;
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
}

.summary-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.summary-card__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-vermilion-muted);
  border-radius: var(--radius-lg);
  color: var(--color-vermilion);
}

.summary-card__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin: 0;
}

.summary-card__text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

/* Skills */
.skills-categories {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.skill-category__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.skill-tag {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  background-color: var(--color-ink-light);
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.skill-tag:hover {
  border-color: var(--color-text-tertiary);
  color: var(--color-text);
}

.skill-tag--vermilion:hover {
  border-color: var(--color-vermilion-muted);
  color: var(--color-vermilion);
}

.skill-tag--gold:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: var(--space-8);
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    180deg,
    var(--color-vermilion) 0%,
    var(--color-vermilion-muted) 100%
  );
}

.timeline-item {
  position: relative;
  margin-bottom: var(--space-8);
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-item__marker {
  position: absolute;
  left: calc(-1 * var(--space-8) + 3px);
  top: var(--space-5);
  width: 10px;
  height: 10px;
  background-color: var(--color-vermilion);
  border-radius: 50%;
  box-shadow: 0 0 0 4px var(--color-ink);
}

.timeline-item__marker--jade {
  background-color: var(--color-jade-light);
}

.timeline-item__content {
  margin: 0;
}

.timeline-item__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-2);
}

.timeline-item__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin: 0;
}

.timeline-item__period {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin: 0 0 var(--space-4);
}

.timeline-item__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.timeline-item__list li {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  padding-left: var(--space-4);
  position: relative;
}

.timeline-item__list li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--color-vermilion);
}

.timeline-item__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-vermilion);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.timeline-item__link:hover {
  gap: var(--space-3);
}

/* Honors */
.honors-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
  .page-header {
    padding-top: calc(var(--header-height) + var(--space-8));
    padding-bottom: var(--space-8);
  }

  .page-header__title {
    font-size: var(--text-3xl);
  }

  .nav-tabs__list {
    justify-content: flex-start;
    padding: 0 var(--space-4);
  }

  .timeline {
    padding-left: var(--space-6);
  }

  .timeline::before {
    left: 5px;
  }

  .timeline-item__marker {
    left: calc(-1 * var(--space-6) + 1px);
  }

  .timeline-item__header {
    flex-direction: column;
    gap: var(--space-2);
  }
}
</style>
