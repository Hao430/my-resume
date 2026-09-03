<script setup lang="ts">
defineProps<{
  html: string
}>()
</script>

<template>
  <article class="markdown-body" v-html="html" />
</template>

<style>
/* Markdown 文章样式 */
.markdown-body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-text);
}

.markdown-body h1 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin: var(--space-10) 0 var(--space-6);
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.markdown-body h2 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  margin: var(--space-8) 0 var(--space-4);
  color: var(--color-text);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-ink-border);
}

.markdown-body h3 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  margin: var(--space-6) 0 var(--space-3);
  color: var(--color-text);
}

.markdown-body h4 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  margin: var(--space-5) 0 var(--space-2);
  color: var(--color-text);
}

.markdown-body p {
  margin: 0 0 var(--space-4);
}

.markdown-body a {
  color: var(--color-vermilion);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color var(--transition-fast);
}

.markdown-body a:hover {
  border-bottom-color: var(--color-vermilion);
}

.markdown-body strong {
  font-weight: var(--font-semibold);
  color: var(--color-text);
}

.markdown-body em {
  font-style: italic;
}

.markdown-body ul,
.markdown-body ol {
  margin: 0 0 var(--space-4);
  padding-left: var(--space-6);
}

.markdown-body li {
  margin-bottom: var(--space-2);
}

.markdown-body li::marker {
  color: var(--color-vermilion);
}

.markdown-body blockquote {
  margin: var(--space-6) 0;
  padding: var(--space-4) var(--space-6);
  border-left: 3px solid var(--color-vermilion);
  background-color: var(--color-ink-light);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--color-text-secondary);
}

.markdown-body blockquote p:last-child {
  margin-bottom: 0;
}

.markdown-body code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  padding: 0.15em 0.4em;
  background-color: var(--color-ink-light);
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-sm);
  color: var(--color-vermilion);
}

.markdown-body pre {
  margin: var(--space-6) 0;
  padding: var(--space-5);
  background-color: var(--color-ink);
  border: 1px solid var(--color-ink-border);
  border-radius: var(--radius-lg);
  overflow-x: auto;
}

.markdown-body pre code {
  font-size: var(--text-sm);
  padding: 0;
  background: none;
  border: none;
  color: var(--color-text);
}

.markdown-body table {
  width: 100%;
  margin: var(--space-6) 0;
  border-collapse: collapse;
}

.markdown-body th,
.markdown-body td {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-ink-border);
  text-align: left;
}

.markdown-body th {
  font-family: var(--font-display);
  font-weight: var(--font-semibold);
  background-color: var(--color-ink-light);
}

.markdown-body tr:hover {
  background-color: var(--color-ink-light);
}

.markdown-body hr {
  margin: var(--space-8) 0;
  border: none;
  border-top: 1px solid var(--color-ink-border);
}

.markdown-body img {
  max-width: 100%;
  border-radius: var(--radius-lg);
}
</style>
