<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 打字机效果
const displayText = ref('')
const fullText = '以墨载道，以技行事'

let charIndex = 0

onMounted(() => {
  const typeInterval = setInterval(() => {
    if (charIndex < fullText.length) {
      displayText.value += fullText[charIndex]
      charIndex++
    } else {
      clearInterval(typeInterval)
    }
  }, 150)
})
</script>

<template>
  <section class="hero">
    <!-- 背景装饰 -->
    <div class="hero__bg">
      <div class="hero__ink-stain hero__ink-stain--1"></div>
      <div class="hero__ink-stain hero__ink-stain--2"></div>
      <div class="hero__ink-stain hero__ink-stain--3"></div>
    </div>

    <div class="container hero__content">
      <!-- 主标题 -->
      <div class="hero__main">
        <h1 class="hero__title animate-fadeInUp">
          <span class="hero__title-accent">墨</span>砚斋
        </h1>
        <p class="hero__subtitle animate-fadeInUp delay-200">
          {{ displayText }}<span class="hero__cursor">|</span>
        </p>
      </div>

      <!-- 分隔线 -->
      <div class="hero__divider animate-fadeInUp delay-300">
        <span class="hero__divider-line"></span>
        <span class="hero__divider-dot"></span>
        <span class="hero__divider-line"></span>
      </div>

      <!-- 简介 -->
      <p class="hero__description animate-fadeInUp delay-400">
        计算机科学 · 全栈开发 · 持续学习者
      </p>

      <!-- 关键词标签 -->
      <div class="hero__tags animate-fadeInUp delay-500">
        <span class="hero__tag">Vue / React</span>
        <span class="hero__tag">TypeScript</span>
        <span class="hero__tag">Node.js</span>
        <span class="hero__tag">AI 应用</span>
        <span class="hero__tag">产品思维</span>
      </div>

      <!-- CTA 按钮 -->
      <div class="hero__actions animate-fadeInUp delay-600">
        <router-link to="/about" class="btn btn--primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          关于我
        </router-link>
        <router-link to="/blog" class="btn btn--outline">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          阅读博客
        </router-link>
      </div>
    </div>

    <!-- 滚动提示 -->
    <div class="hero__scroll-hint animate-fadeIn delay-800">
      <span class="hero__scroll-text">向下滚动</span>
      <div class="hero__scroll-arrow">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--space-24) var(--space-6);
  overflow: hidden;
}

/* 背景装饰 */
.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.hero__ink-stain {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, var(--color-vermilion-muted) 0%, transparent 70%);
  opacity: 0.15;
  filter: blur(60px);
}

.hero__ink-stain--1 {
  width: 500px;
  height: 500px;
  top: -10%;
  right: -10%;
  animation: float 20s ease-in-out infinite;
}

.hero__ink-stain--2 {
  width: 400px;
  height: 400px;
  bottom: -5%;
  left: -5%;
  animation: float 25s ease-in-out infinite reverse;
}

.hero__ink-stain--3 {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 10s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -30px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.2;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* 主内容 */
.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
}

.hero__main {
  margin-bottom: var(--space-6);
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 10vw, 5rem);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-tight);
  line-height: 1.1;
  margin-bottom: var(--space-4);
}

.hero__title-accent {
  color: var(--color-vermilion);
  position: relative;
}

.hero__title-accent::after {
  content: '';
  position: absolute;
  bottom: 0.1em;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--color-vermilion), transparent);
}

.hero__subtitle {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  letter-spacing: var(--tracking-wider);
  margin-bottom: 0;
}

.hero__cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: var(--color-vermilion);
  margin-left: 2px;
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

/* 分隔线 */
.hero__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin: var(--space-8) 0;
}

.hero__divider-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-ink-border));
}

.hero__divider-line:last-child {
  background: linear-gradient(90deg, var(--color-ink-border), transparent);
}

.hero__divider-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-vermilion);
}

/* 简介 */
.hero__description {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
  letter-spacing: var(--tracking-wide);
}

/* 标签 */
.hero__tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}

.hero__tag {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  background-color: var(--color-ink-light);
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.hero__tag:hover {
  color: var(--color-vermilion);
  border-color: var(--color-vermilion-muted);
}

/* CTA 按钮 */
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-4);
}

/* 滚动提示 */
.hero__scroll-hint {
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.hero__scroll-text {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
}

.hero__scroll-arrow {
  color: var(--color-text-tertiary);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .hero {
    padding: var(--space-20) var(--space-4);
  }

  .hero__tags {
    gap: var(--space-2);
  }

  .hero__tag {
    padding: var(--space-1) var(--space-3);
    font-size: var(--text-xs);
  }

  .hero__actions {
    flex-direction: column;
    width: 100%;
  }

  .hero__actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
