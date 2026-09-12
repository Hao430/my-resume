/**
 * 工具目录（单一事实来源）
 * ------------------------------------------------------------
 * 同时驱动三处，新增工具只改这里 + 对应页面组件 + i18n 键：
 *   1. ToolsPage.vue 的卡片列表
 *   2. build/static-site.ts 的预渲染外壳（经 src/data/site-pages.ts）
 *   3. sitemap.xml 的工具页条目
 *
 * 只有 status === 'active' 的工具才会生成独立页面、外壳与 sitemap 条目——
 * 因此把工具从 planned 改成 active 时，务必同时补上页面组件与路由。
 */

/** 与 src/i18n/locales/*.json 的 tools.items.<key> 一一对应 */
export type ToolI18nKey = 'markdownCleaner' | 'agentContext' | 'codeSecurityChecker'

export interface ToolMeta {
  /** URL 片段：页面地址为 /tools/<slug>/ */
  slug: string
  i18nKey: ToolI18nKey
  tags: string[]
  status: 'active' | 'wip' | 'planned'
}

export const TOOLS: ToolMeta[] = [
  {
    slug: 'markdown-cleaner',
    i18nKey: 'markdownCleaner',
    tags: ['Markdown', 'AI Output', 'Text'],
    status: 'active',
  },
  {
    slug: 'agent-context',
    i18nKey: 'agentContext',
    tags: ['Context Window', 'Token Budget', 'AI Coding'],
    status: 'wip',
  },
  {
    slug: 'code-security-checker',
    i18nKey: 'codeSecurityChecker',
    tags: ['Dependencies', 'Vulnerability', 'CRA'],
    status: 'planned',
  },
]

/** 已上线、有独立页面的工具 */
export const LIVE_TOOLS: ToolMeta[] = TOOLS.filter((tool) => tool.status === 'active')

/** 工具页路径（统一带尾斜杠，与 canonical / sitemap 一致） */
export function toolPath(tool: ToolMeta): string {
  return `/tools/${tool.slug}/`
}
