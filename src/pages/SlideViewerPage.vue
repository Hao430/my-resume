<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSlidesStore } from '@/stores/slides'

const route = useRoute()
const router = useRouter()
const slidesStore = useSlidesStore()

const slideUrl = ref('')
const loading = ref(true)
const error = ref('')

function loadSlide() {
  const id = route.params.id as string
  const slide = slidesStore.getSlideById(id)

  if (slide) {
    slideUrl.value = slide.url
    loading.value = false
    error.value = ''
  } else {
    loading.value = false
    error.value = '演示文稿不存在'
  }
}

function goBack() {
  router.push('/slides')
}

onMounted(loadSlide)
watch(() => route.params.id, loadSlide)
</script>

<template>
  <div class="slide-viewer">
    <button class="slide-viewer__back btn" @click="goBack">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      返回列表
    </button>

    <div v-if="loading" class="slide-viewer__loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="slide-viewer__error">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>{{ error }}</p>
      <button class="btn btn--primary" @click="goBack">返回列表</button>
    </div>

    <iframe
      v-else
      :src="slideUrl"
      class="slide-viewer__iframe"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </div>
</template>

<style scoped>
.slide-viewer {
  position: fixed;
  inset: 0;
  background-color: var(--color-ink);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.slide-viewer__back {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background-color: rgba(10, 10, 11, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-ink-border);
  color: var(--color-text);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
}

.slide-viewer__back:hover {
  background-color: rgba(10, 10, 11, 0.95);
  border-color: var(--color-vermilion);
  color: var(--color-vermilion);
}

.slide-viewer__loading,
.slide-viewer__error {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-ink-border);
  border-top-color: var(--color-vermilion);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.slide-viewer__error svg {
  color: var(--color-text-tertiary);
}

.slide-viewer__iframe {
  flex: 1;
  width: 100%;
  border: none;
}
</style>
