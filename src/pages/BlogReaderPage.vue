<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

const fileName = ref('')
const iframeRef = ref<HTMLIFrameElement | null>(null)

/** 只接受站内相对路径，防止 ?file=//evil.com 这种外站注入 */
const SAFE_FILE = /^(?:[\w\u4e00-\u9fff-]+\/)*[\w\u4e00-\u9fff-]+\.html$/

onMounted(() => {
  const file = String(route.query.file ?? '')
  if (!file || !SAFE_FILE.test(file) || file.startsWith('//')) {
    router.replace('/blog')
    return
  }
  fileName.value = file
})
</script>

<template>
  <div class="blog-reader">
    <button class="back-btn" @click="router.back()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      {{ t('reader.backToBlog') }}
    </button>
    
    <iframe
      v-if="fileName"
      ref="iframeRef"
      :src="`/${fileName}`"
      class="blog-reader__iframe"
      frameborder="0"
    />
    
    <div v-if="!fileName" class="blog-reader__loading">
      {{ t('common.loading') }}
    </div>
  </div>
</template>

<style scoped>
.blog-reader {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal, 100);
  background-color: var(--color-ink);
  display: flex;
  flex-direction: column;
}

.back-btn {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--color-text);
  background-color: rgba(10, 10, 11, 0.9);
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.back-btn:hover {
  color: var(--color-vermilion);
  border-color: var(--color-vermilion);
}

.blog-reader__iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.blog-reader__loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
}
</style>
