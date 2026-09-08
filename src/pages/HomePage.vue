<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Hero from '../components/Hero.vue'
import { useResumeStore } from '../stores/resume'
import { useBlogStore } from '../stores/blog'
import { formatDate } from '../utils/format'

const { t, locale } = useI18n()
const resumeStore = useResumeStore()
const blogStore = useBlogStore()
const rd = computed(() => resumeStore.data)

const recentProjects = computed(() => rd.value?.projectExperiences?.slice(0, 3) || [])
const recentHonors = computed(() => rd.value?.honors?.slice(0, 2) || [])

/** 首页展示最近 3 篇文章（纯静态） */
const latestPosts = computed(() =>
  blogStore.latest(locale.value, 3).map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.description,
    path: post.path,
    dateLabel: formatDate(post.date, locale.value),
    date: post.date,
    minutes: t('blog.minutes', { n: post.readingMinutes }),
    tags: post.tags.slice(0, 2),
  })),
)
</script>

<template>
  <div class="home">
    <Hero />

    <main id="content">
      <!-- Recent Projects -->
      <section v-if="recentProjects.length" class="section section--alt">
        <div class="container">
          <div class="section-head section-head--split section-head--mobile-stack">
            <div>
              <p class="eyebrow section-head__eyebrow">{{ t('home.projectsEyebrow') || 'Selected Work' }}</p>
              <h2 class="section-head__title">{{ t('home.projects') }}</h2>
            </div>
            <router-link to="/about" class="section-more">
              {{ t('home.viewAll') }}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </router-link>
          </div>

          <div class="card-grid">
            <article
              v-for="(project, index) in recentProjects"
              :key="project.projectName"
              class="card project-card animate-fadeInUp"
              :class="`delay-${(index + 1) * 100}`"
            >
              <div class="project-card__top">
                <span class="project-card__index mono">{{ String(index + 1).padStart(2, '0') }}</span>
                <span class="badge badge--vermilion">{{ project.role }}</span>
              </div>
              <h3 class="project-card__title">{{ project.projectName }}</h3>
              <p class="project-card__period mono">{{ project.period }}</p>
              <ul class="project-card__list">
                <li v-for="(desc, i) in project.descriptions.slice(0, 2)" :key="i">{{ desc }}</li>
              </ul>
              <a
                v-if="project.url"
                :href="project.url"
                target="_blank"
                rel="noopener"
                class="project-card__link"
              >
                <span>{{ t('home.viewAll') }}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </article>
          </div>
        </div>
      </section>

      <!-- About Preview -->
      <section class="section">
        <div class="container">
          <div class="about-preview">
            <div class="about-preview__content">
              <p class="eyebrow section-head__eyebrow">{{ t('home.aboutEyebrow') || 'Profile' }}</p>
              <h2 class="section-head__title">{{ t('home.aboutTitle') }}</h2>
              <p class="about-preview__text">
                {{ rd?.professionalSummary?.strong }}
              </p>
              <p class="about-preview__text">
                {{ rd?.professionalSummary?.comprehensive }}
              </p>
              <router-link to="/about" class="btn btn--primary mt-6">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                {{ t('home.readFullResume') }}
              </router-link>
            </div>
            <div class="about-preview__stats">
              <div class="stat-item">
                <span class="stat-item__value mono">{{ rd?.projectExperiences?.length ?? 0 }}</span>
                <span class="stat-item__label">{{ t('home.stats.projects') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-item__value mono">{{ rd?.workExperiences?.length ?? 0 }}</span>
                <span class="stat-item__label">{{ t('home.stats.experience') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-item__value mono">{{ rd?.honors?.length ?? 0 }}</span>
                <span class="stat-item__label">{{ t('home.stats.honors') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-item__value mono">{{ rd?.skills?.length ?? 0 }}</span>
                <span class="stat-item__label">{{ t('home.stats.skills') }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Latest Writing -->
      <section class="section section--alt">
        <div class="container">
          <div class="section-head section-head--split section-head--mobile-stack">
            <div>
              <p class="eyebrow section-head__eyebrow">{{ t('home.writingEyebrow') || 'Journal' }}</p>
              <h2 class="section-head__title">{{ t('home.writing') }}</h2>
            </div>
            <router-link to="/blog" class="section-more">
              {{ t('home.viewAll') }}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </router-link>
          </div>
          <div v-if="latestPosts.length" class="card-grid">
            <router-link
              v-for="(post, index) in latestPosts"
              :key="post.slug"
              :to="post.path"
              class="card card--glow writing-card animate-fadeInUp"
              :class="`delay-${(index + 1) * 100}`"
            >
              <div class="writing-card__meta">
                <time :datetime="post.date" class="mono">{{ post.dateLabel }}</time>
                <span class="mono">{{ post.minutes }}</span>
              </div>
              <h3 class="writing-card__title">{{ post.title }}</h3>
              <p class="writing-card__excerpt">{{ post.excerpt }}</p>
              <div class="writing-card__tags">
                <span v-for="tag in post.tags" :key="tag" class="badge badge--neutral">{{ tag }}</span>
              </div>
              <span class="writing-card__more">
                {{ t('blog.readMore') }} →
              </span>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Honors -->
      <section v-if="recentHonors.length" class="section section--tint">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow section-head__eyebrow">{{ t('home.honorsEyebrow') || 'Recognition' }}</p>
            <h2 class="section-head__title">{{ t('honors.sectionTitle') }}</h2>
          </div>
          <div class="honors-grid">
            <div
              v-for="(honor, index) in recentHonors"
              :key="honor.name"
              class="card honor-item animate-fadeInUp"
              :class="`delay-${(index + 1) * 100}`"
            >
              <svg class="honor-item__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
              </svg>
              <span class="honor-item__name">{{ honor.name }}</span>
              <span class="badge badge--gold">{{ honor.level }}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.card-grid {
  --card-min: 300px;
}

/* Writing card */
.writing-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
  text-decoration: none;
  color: inherit;
}

.writing-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.writing-card__title {
  font-size: 1.2rem;
  line-height: var(--leading-snug);
  color: var(--color-text);
  transition: color var(--transition-fast);
}

.writing-card:hover .writing-card__title { color: var(--color-vermilion-bright); }

.writing-card__excerpt {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.writing-card__tags { display: flex; flex-wrap: wrap; gap: var(--space-2); }

.writing-card__more {
  margin-top: auto;
  font-size: var(--text-sm);
  color: var(--color-vermilion);
  letter-spacing: 0.02em;
}

/* Project card */
.project-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-6);
}

.project-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.project-card__index {
  font-size: var(--text-xs);
  color: var(--color-text-faint);
  letter-spacing: 0.08em;
}

.project-card__title {
  font-size: 1.2rem;
  font-weight: var(--font-semibold);
  margin: 0;
}

.project-card__period {
  font-size: var(--text-xs);
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
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-vermilion-muted);
  border: 1px solid rgba(201, 79, 61, 0.5);
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
  border-top: 1px solid var(--hairline);
  transition: gap var(--transition-fast);
}

.project-card__link:hover { gap: var(--space-3); }

/* About preview */
.about-preview {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: clamp(2rem, 6vw, 4.5rem);
  align-items: center;
}

.about-preview__content .section-head__title,
.about-preview__content .eyebrow { margin-bottom: var(--space-4); }

.about-preview__text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.about-preview__text:last-of-type { margin-bottom: 0; }

.about-preview__stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.stat-item {
  text-align: center;
  padding: var(--space-5) var(--space-4);
  background: var(--surface-1);
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.stat-item__value {
  display: block;
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

/* Honors */
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

.honor-item__icon { flex-shrink: 0; color: var(--color-gold-light); }

.honor-item__name {
  flex: 1;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
}

/* Responsive */
@media (max-width: 900px) {
  .about-preview { grid-template-columns: 1fr; gap: var(--space-8); }
  .about-preview__stats { order: -1; justify-content: center; }
}

@media (max-width: 640px) {
  .about-preview__stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
