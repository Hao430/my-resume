<script setup lang="ts">
import type { PersonalInfo } from '../types/resume'

defineProps<{
  personalInfo: PersonalInfo
}>()
</script>

<template>
  <section id="about" class="personal-info">
    <div class="container">
      <div class="personal-info__content">
        <div class="personal-info__main">
          <h2 class="personal-info__name">{{ personalInfo.name }}</h2>
          <p class="personal-info__details">
            {{ personalInfo.ethnicity }} · {{ personalInfo.nativePlace }}
          </p>
          <div class="personal-info__education">
            <p class="personal-info__university">{{ personalInfo.university }}</p>
            <p class="personal-info__college">{{ personalInfo.college }}</p>
            <p class="personal-info__major">{{ personalInfo.major }}</p>
          </div>
          <div class="personal-info__contact">
            <a :href="`mailto:${personalInfo.contact.email}`" class="personal-info__email">
              {{ personalInfo.contact.email }}
            </a>
            <a :href="`https://${personalInfo.contact.github}`" target="_blank" rel="noopener" class="personal-info__github">
              {{ personalInfo.contact.github }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.personal-info {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
}

.personal-info__content {
  text-align: center;
}

.personal-info__name {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  color: var(--primary-color);
  margin-bottom: var(--spacing-lg);
  animation: fadeInUp 0.6s ease-out;
}

.personal-info__details {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.personal-info__education {
  margin-bottom: var(--spacing-xl);
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.personal-info__university {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.personal-info__college,
.personal-info__major {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.personal-info__contact {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  animation: fadeInUp 0.6s ease-out 0.6s both;
}

.personal-info__email,
.personal-info__github {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--bg-primary);
  color: var(--primary-color);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.personal-info__email:hover,
.personal-info__github:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .personal-info__name {
    font-size: var(--text-4xl);
  }

  .personal-info__contact {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }
}
</style>