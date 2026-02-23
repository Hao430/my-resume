<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <p class="footer__text">
        © {{ currentYear }} 张豪. All rights reserved.
      </p>
      <div class="footer__links">
        <a href="mailto:fervent430@163.com" class="footer__link">Email</a>
        <a href="https://github.com/hao430" target="_blank" rel="noopener" class="footer__link">GitHub</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--bg-tertiary);
  padding: var(--spacing-xl) 0;
  margin-top: var(--spacing-3xl);
  text-align: center;
}

.footer__text {
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-md);
  font-size: var(--text-sm);
}

.footer__links {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
}

.footer__link {
  color: var(--primary-color);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all var(--transition-fast);
}

.footer__link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .footer__links {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style>