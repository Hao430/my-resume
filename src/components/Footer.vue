<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const currentYear = new Date().getFullYear()

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/hao430',
    icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
  },
  {
    name: 'Email',
    url: 'mailto:fervent430@163.com',
    icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6'
  }
]
</script>

<template>
  <footer class="footer">
    <div class="container footer__container">
      <div class="footer__top">
        <div class="footer__brand">
          <div class="footer__logo">
            <span class="footer__logo-text">{{ t('brand.mark') }}</span>
            <span class="footer__logo-separator" aria-hidden="true">·</span>
            <span class="footer__logo-name">{{ t('brand.name') }}</span>
          </div>
          <p class="footer__tagline">{{ t('footer.tagline') }}</p>
        </div>

        <div class="footer__links">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            :title="link.name"
            class="footer__link footer__link--icon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path :d="link.icon"/>
            </svg>
            <span class="footer__link-text">{{ link.name }}</span>
          </a>
          <a href="/feed.xml" class="footer__link footer__link--icon" :title="t('footer.rss')">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M4 11a9 9 0 0 1 9 9"/>
              <path d="M4 4a16 16 0 0 1 16 16"/>
              <circle cx="5" cy="19" r="1" fill="currentColor"/>
            </svg>
            <span class="footer__link-text">{{ t('footer.rss') }}</span>
          </a>
          <a href="/privacy/" class="footer__link">
            <span class="footer__link-text">{{ t('footer.privacy') }}</span>
          </a>
        </div>
      </div>

      <div class="footer__divider"></div>

      <p class="footer__copyright">
        © {{ currentYear }} {{ t('brand.name') }} · {{ t('footer.copyright') }}
      </p>
      <p class="footer__icp">
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
        >湘ICP备2025125191号-2</a>
      </p>
    </div>

    <div class="footer__seal" aria-hidden="true">
      <span>{{ t('footer.seal') }}</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  background: var(--surface-1);
  border-top: 1px solid var(--hairline);
  padding: var(--space-12) 0 var(--space-8);
  overflow: hidden;
}

.footer__container {
  position: relative;
  z-index: 1;
}

.footer__top {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.footer__logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.footer__logo-text {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-vermilion);
}

.footer__logo-separator { color: var(--color-ink-border); font-size: var(--text-lg); }

.footer__logo-name {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text);
}

.footer__tagline {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  letter-spacing: var(--tracking-wide);
  margin: 0;
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-6);
}

.footer__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--transition-fast);
}

.footer__link--icon {
  padding: var(--space-2) var(--space-3);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.footer__link--icon:hover {
  color: var(--color-text);
  border-color: var(--color-ink-muted);
  background: rgba(255, 255, 255, 0.03);
}

.footer__link:hover:not(.footer__link--icon) { color: var(--color-vermilion); }

.footer__divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--hairline-strong) 30%, var(--hairline-strong) 70%, transparent);
  margin: var(--space-8) 0 var(--space-6);
}

.footer__copyright {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin: 0;
  text-align: center;
}

.footer__icp {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin: var(--space-3) 0 0;
  text-align: center;
}

.footer__icp a {
  color: inherit;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer__icp a:hover {
  color: var(--color-vermilion);
}

/* 印章装饰 */
.footer__seal {
  position: absolute;
  right: clamp(1rem, 4vw, 2.5rem);
  top: 50%;
  transform: translateY(-50%) rotate(-12deg);
  width: 52px;
  height: 52px;
  border: 1.5px solid rgba(201, 79, 61, 0.28);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
}

.footer__seal span {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  color: var(--color-vermilion);
  writing-mode: vertical-rl;
  letter-spacing: 0.2em;
}

@media (max-width: 640px) {
  .footer__seal { display: none; }
}
</style>
