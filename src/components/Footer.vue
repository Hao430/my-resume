<script setup lang="ts">
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
      <!-- Logo & Tagline -->
      <div class="footer__brand">
        <div class="footer__logo">
          <span class="footer__logo-text">墨</span>
          <span class="footer__logo-separator">·</span>
          <span class="footer__logo-name">张豪</span>
        </div>
        <p class="footer__tagline">
          以墨载道，以技行事
        </p>
      </div>

      <!-- Divider -->
      <div class="footer__divider"></div>

      <!-- Links & Copyright -->
      <div class="footer__bottom">
        <div class="footer__links">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            :title="link.name"
            class="footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path :d="link.icon"/>
            </svg>
            <span class="footer__link-text">{{ link.name }}</span>
          </a>
        </div>

        <p class="footer__copyright">
          © {{ currentYear }} 张豪 · 用心沉淀，随缘分享
        </p>
      </div>
    </div>

    <!-- Decorative Seal -->
    <div class="footer__seal">
      <span>墨砚</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  background-color: var(--color-ink-light);
  border-top: 1px solid var(--color-ink-border);
  padding: var(--space-12) 0 var(--space-8);
  overflow: hidden;
}

.footer__container {
  position: relative;
  z-index: 1;
}

/* Brand */
.footer__brand {
  text-align: center;
  margin-bottom: var(--space-8);
}

.footer__logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.footer__logo-text {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-vermilion);
}

.footer__logo-separator {
  color: var(--color-ink-border);
  font-size: var(--text-lg);
}

.footer__logo-name {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--color-text);
}

.footer__tagline {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  letter-spacing: var(--tracking-wider);
  margin: 0;
}

/* Divider */
.footer__divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-ink-border) 20%,
    var(--color-ink-border) 80%,
    transparent
  );
  margin-bottom: var(--space-8);
}

/* Bottom */
.footer__bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.footer__links {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.footer__link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.footer__link:hover {
  color: var(--color-vermilion);
}

.footer__link svg {
  flex-shrink: 0;
}

.footer__link-text {
  font-size: var(--text-sm);
}

.footer__copyright {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin: 0;
}

/* Decorative Seal */
.footer__seal {
  position: absolute;
  right: var(--space-8);
  bottom: var(--space-6);
  width: 50px;
  height: 50px;
  border: 2px solid var(--color-vermilion-muted);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.4;
  transform: rotate(-15deg);
}

.footer__seal span {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  color: var(--color-vermilion-muted);
  writing-mode: vertical-rl;
  letter-spacing: 0.1em;
}

/* Responsive */
@media (max-width: 640px) {
  .footer__links {
    gap: var(--space-4);
  }

  .footer__seal {
    display: none;
  }
}
</style>
