<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '../stores/resume'

const { t } = useI18n()
const resumeStore = useResumeStore()
const rd = computed(() => resumeStore.data)

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
          {{ t('about.pageTitle') }}
        </h1>
        <p class="page-header__subtitle animate-fadeInUp delay-200">
          {{ t('about.pageSubtitle') }}
        </p>
      </div>
    </section>

    <!-- Navigation Tabs -->
    <div class="nav-tabs">
      <div class="container">
        <nav class="nav-tabs__list">
          <button
            v-for="tab in [
              { id: 'summary', label: t('about.tabs.summary') },
              { id: 'skills', label: t('about.tabs.skills') },
              { id: 'projects', label: t('about.tabs.projects') },
              { id: 'experience', label: t('about.tabs.experience') },
              { id: 'honors', label: t('about.tabs.honors') }
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

    <!-- Core Pillars / Summary -->
    <section id="summary" class="section">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__accent">·</span>
          {{ t('about.summary.title') }}
        </h2>
        <div class="summary-cards">
          <!-- Pillar 1: Technical Consultant -->
          <div class="summary-card card animate-fadeInUp">
            <div class="summary-card__header">
              <div class="summary-card__icon summary-card__icon--vermilion">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div>
                <h3 class="summary-card__title">{{ t('about.summary.strong') }}</h3>
                <span class="summary-card__subtitle">{{ t('about.summary.strongSub') }}</span>
              </div>
            </div>
            <p class="summary-card__text">{{ rd?.professionalSummary.strong }}</p>
          </div>

          <!-- Pillar 2: Full-Stack Maker -->
          <div class="summary-card card animate-fadeInUp delay-100">
            <div class="summary-card__header">
              <div class="summary-card__icon summary-card__icon--jade">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div>
                <h3 class="summary-card__title">{{ t('about.summary.comprehensive') }}</h3>
                <span class="summary-card__subtitle">{{ t('about.summary.comprehensiveSub') }}</span>
              </div>
            </div>
            <p class="summary-card__text">{{ rd?.professionalSummary.comprehensive }}</p>
          </div>

          <!-- Pillar 3: Independent Researcher -->
          <div class="summary-card card animate-fadeInUp delay-200">
            <div class="summary-card__header">
              <div class="summary-card__icon summary-card__icon--gold">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div>
                <h3 class="summary-card__title">{{ t('about.summary.outstanding') }}</h3>
                <span class="summary-card__subtitle">{{ t('about.summary.outstandingSub') }}</span>
              </div>
            </div>
            <p class="summary-card__text">{{ rd?.professionalSummary.outstanding }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills & Capabilities -->
    <section id="skills" class="section section--alt">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__accent">·</span>
          {{ t('about.skills.title') }}
        </h2>
        <div class="skills-categories">
          <div class="skill-category">
            <h3 class="skill-category__title">{{ t('about.skills.technical') }}</h3>
            <div class="skill-tags">
              <span
                v-for="skill in rd?.skills.filter(s => s.category === 'technical')"
                :key="skill.name"
                class="skill-tag"
              >
                {{ skill.name }}
              </span>
            </div>
          </div>
          <div class="skill-category">
            <h3 class="skill-category__title">{{ t('about.skills.professional') }}</h3>
            <div class="skill-tags">
              <span
                v-for="skill in rd?.skills.filter(s => s.category === 'professional')"
                :key="skill.name"
                class="skill-tag skill-tag--vermilion"
              >
                {{ skill.name }}
              </span>
            </div>
          </div>
          <div class="skill-category">
            <h3 class="skill-category__title">{{ t('about.skills.tools') }}</h3>
            <div class="skill-tags">
              <span
                v-for="skill in rd?.skills.filter(s => s.category === 'tools')"
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

    <!-- Projects / Creations -->
    <section id="projects" class="section">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__accent">·</span>
          {{ t('about.projects.title') }}
        </h2>
        <div class="timeline">
          <div
            v-for="(project, index) in rd?.projectExperiences"
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
              <p class="timeline-item__period mono">{{ project.period }}</p>
              <ul class="timeline-item__list">
                <li v-for="(desc, i) in project.descriptions" :key="i">
                  {{ desc }}
                </li>
              </ul>
              <a
                v-if="project.url"
                :href="project.url"
                target="_blank"
                rel="noopener noreferrer"
                class="timeline-item__link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                {{ project.url.startsWith('http') ? t('about.projects.visit') : t('about.projects.details') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Work Experience / Track Record -->
    <section id="experience" class="section section--alt">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__accent">·</span>
          {{ t('about.experience.title') }}
        </h2>
        <div class="timeline">
          <div
            v-for="(exp, index) in rd?.workExperiences"
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
              <p class="timeline-item__period mono">{{ exp.period }}</p>
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

    <!-- Academic Background & Honors -->
    <section id="honors" class="section">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__accent">·</span>
          {{ t('about.honors.title') }}
        </h2>

        <!-- Academic Grounding Card -->
        <div v-if="rd?.personalInfo" class="academic-card card mb-8 animate-fadeInUp">
          <div class="academic-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div class="academic-card__body">
            <h3 class="academic-card__title">{{ rd.personalInfo.university }}</h3>
            <p class="academic-card__desc">{{ rd.personalInfo.college }} · {{ rd.personalInfo.major }}</p>
          </div>
          <span class="badge badge--neutral mono">Computer Science</span>
        </div>

        <div class="honors-list">
          <div
            v-for="(honor, index) in rd?.honors"
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
.page-header {
  padding-bottom: var(--space-12);
}

.page-header__subtitle {
  font-size: var(--text-lg);
  color: var(--color-vermilion);
  letter-spacing: var(--tracking-wide);
}

@media (max-width: 768px) {
  .page-header {
    padding-top: calc(var(--header-height) + var(--space-8));
    padding-bottom: var(--space-8);
  }
  .page-header__title {
    font-size: var(--text-3xl);
  }
}

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
  color: var(--color-vermilion);
  background-color: var(--color-ink-light);
}

@media (max-width: 768px) {
  .section-title__accent {
    font-size: var(--text-2xl);
  }
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
}

.summary-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
}

.summary-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.summary-card__icon {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.summary-card__icon--vermilion {
  background: rgba(201, 79, 61, 0.14);
  border: 1px solid rgba(201, 79, 61, 0.3);
  color: var(--color-vermilion-bright);
}

.summary-card__icon--jade {
  background: rgba(98, 130, 113, 0.14);
  border: 1px solid rgba(98, 130, 113, 0.3);
  color: var(--color-jade-light);
}

.summary-card__icon--gold {
  background: rgba(212, 163, 89, 0.14);
  border: 1px solid rgba(212, 163, 89, 0.3);
  color: var(--color-gold-light);
}

.summary-card__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin: 0;
  color: var(--color-text);
}

.summary-card__subtitle {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: 2px;
}

.summary-card__text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

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
  background: linear-gradient(180deg, var(--color-vermilion) 0%, var(--color-vermilion-muted) 100%);
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
  font-size: var(--text-xs);
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
  content: '\00b7';
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

.academic-card {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding: var(--space-5) var(--space-6);
}

.academic-card__icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: rgba(212, 163, 89, 0.12);
  color: var(--color-gold-light);
  border: 1px solid rgba(212, 163, 89, 0.25);
  flex-shrink: 0;
}

.academic-card__body {
  flex: 1;
}

.academic-card__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  margin: 0 0 2px;
}

.academic-card__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.mb-8 {
  margin-bottom: var(--space-8);
}

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
