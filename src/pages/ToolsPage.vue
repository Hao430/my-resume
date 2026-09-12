<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface ToolItem {
  id: string
  title: string
  desc: string
  tags: string[]
  status: 'active' | 'wip' | 'planned'
  url?: string
}

interface ExternalLink {
  title: string
  desc: string
  url: string
  category: string
}

// 规划中小工具
const plannedTools: ToolItem[] = [
  {
    id: 'agent-context',
    title: 'Agent Context & Prompt Optimizer',
    desc: '面向 AI 编码的上下文预算裁剪、Prompt 结构化评估与系统指令规范器。',
    tags: ['AI Coding', 'Agent', 'Prompt'],
    status: 'wip',
  },
  {
    id: 'code-security-checker',
    title: 'Code Security & Dependency Radar',
    desc: '轻量级依赖项合规检查、开源漏洞与 CRA（网络韧性法案）风险速查工具。',
    tags: ['Security', 'CRA', 'Compliance'],
    status: 'planned',
  },
  {
    id: 'markdown-cleaner',
    title: 'Markdown Spec & Doc Lake Parser',
    desc: '自动化技术规范提纯、元数据解析与多源文档湖入库清洗格式化工具。',
    tags: ['DocLake', 'Markdown', 'Tool'],
    status: 'planned',
  },
]

// 精选外链与数字资产
const externalLinks: ExternalLink[] = [
  {
    title: 'GitHub / hao430',
    desc: '开源项目、工程实现代码与智能体协同工作流实证仓库。',
    url: 'https://github.com/hao430',
    category: 'Code & Repos',
  },
  {
    title: '技术与学术论文沉淀',
    desc: '前沿 Agent 体系、RAG 混合检索及分布式后端技术调研沉淀。',
    url: '/blog',
    category: 'Research',
  },
  {
    title: '技术顾问与合作咨询',
    desc: '团队 AI 编码工作流升级、代码安全审计与架构咨询直达预约。',
    url: '/services',
    category: 'Advisory',
  },
]
</script>

<template>
  <div class="tools-page">
    <!-- Header -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-header__title animate-fadeInUp">
          <span class="page-header__accent">·</span>
          {{ t('tools.pageTitle') }}
        </h1>
        <p class="page-header__subtitle animate-fadeInUp delay-200">
          {{ t('tools.pageSubtitle') }}
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <main class="container tools-page__main">
      <!-- Section 1: In-House Tools & Lab -->
      <section class="tools-section">
        <div class="section-head section-head--split">
          <div>
            <p class="eyebrow section-head__eyebrow">Creations & Lab</p>
            <h2 class="section-head__title">{{ t('tools.craftsTitle') }}</h2>
          </div>
        </div>
        <p class="section-subtext">{{ t('tools.craftsDesc') }}</p>

        <div class="tools-grid">
          <article
            v-for="tool in plannedTools"
            :key="tool.id"
            class="card tool-card animate-fadeInUp"
          >
            <div class="tool-card__header">
              <span class="badge" :class="tool.status === 'active' ? 'badge--jade' : 'badge--neutral'">
                {{ tool.status === 'active' ? t('tools.statusActive') : t('tools.statusWip') }}
              </span>
              <span class="tool-card__id mono">#{{ tool.id }}</span>
            </div>

            <h3 class="tool-card__title">{{ tool.title }}</h3>
            <p class="tool-card__desc">{{ tool.desc }}</p>

            <div class="tool-card__tags">
              <span v-for="tag in tool.tags" :key="tag" class="badge badge--inset mono">
                {{ tag }}
              </span>
            </div>

            <div class="tool-card__footer">
              <a
                v-if="tool.url"
                :href="tool.url"
                target="_blank"
                rel="noopener noreferrer"
                class="tool-card__action btn btn--outline"
              >
                {{ t('tools.visit') }} →
              </a>
              <span v-else class="tool-card__pending mono">
                {{ t('tools.comingSoon') }}
              </span>
            </div>
          </article>
        </div>
      </section>

      <!-- Section 2: Radar & External Links -->
      <section class="tools-section">
        <div class="section-head section-head--split">
          <div>
            <p class="eyebrow section-head__eyebrow">Radar & Links</p>
            <h2 class="section-head__title">{{ t('tools.linksTitle') }}</h2>
          </div>
        </div>
        <p class="section-subtext">{{ t('tools.linksDesc') }}</p>

        <div class="links-grid">
          <a
            v-for="link in externalLinks"
            :key="link.title"
            :href="link.url"
            :target="link.url.startsWith('http') ? '_blank' : '_self'"
            :rel="link.url.startsWith('http') ? 'noopener noreferrer' : undefined"
            class="card link-card animate-fadeInUp"
          >
            <div class="link-card__top">
              <span class="badge badge--vermilion">{{ link.category }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="link-card__arrow">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </div>
            <h3 class="link-card__title">{{ link.title }}</h3>
            <p class="link-card__desc">{{ link.desc }}</p>
          </a>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.tools-page {
  padding-bottom: var(--space-16);
}

.page-header {
  padding-bottom: var(--space-8);
}

.page-header__subtitle {
  font-size: var(--text-lg);
  color: var(--color-vermilion);
  letter-spacing: var(--tracking-wide);
}

.tools-page__main {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.tools-section {
  display: flex;
  flex-direction: column;
}

.section-subtext {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-top: calc(-1 * var(--space-2));
  margin-bottom: var(--space-6);
  max-width: 60ch;
}

/* Tools Grid */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

.tool-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  transition: transform var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base);
}

.tool-card:hover {
  transform: translateY(-4px);
  border-color: rgba(201, 79, 61, 0.4);
  box-shadow: var(--shadow-hover);
}

.tool-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.tool-card__id {
  font-size: var(--text-xs);
  color: var(--color-text-faint);
}

.tool-card__title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin: 0 0 var(--space-2);
  color: var(--color-text);
}

.tool-card__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--space-4);
  flex: 1;
}

.tool-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}

.tool-card__footer {
  padding-top: var(--space-4);
  border-top: 1px solid var(--hairline);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tool-card__pending {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  letter-spacing: 0.05em;
}

/* Links Grid */
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-5);
}

.link-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-5) var(--space-6);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base);
}

.link-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-vermilion);
  box-shadow: var(--shadow-card);
}

.link-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.link-card__arrow {
  color: var(--color-text-tertiary);
  transition: color var(--transition-fast), transform var(--transition-fast);
}

.link-card:hover .link-card__arrow {
  color: var(--color-vermilion);
  transform: translate(2px, -2px);
}

.link-card__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  margin: 0 0 var(--space-2);
  color: var(--color-text);
}

.link-card__desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}
</style>
