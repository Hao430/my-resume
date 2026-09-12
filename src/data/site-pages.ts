import { SITE_DESCRIPTION_ZH, SITE_EMAIL, SITE_URL } from '../utils/site'
import { LIVE_TOOLS, toolPath, type ToolMeta } from './tools'
import zh from '../i18n/locales/zh.json'

/**
 * 静态页面的单一事实来源
 * ------------------------------------------------------------
 * 构建期由 build/static-site.ts 消费，同时驱动两件事：
 *   1. 预渲染 head 外壳（SPA 直链也能拿到正确的 title / OG / canonical）
 *   2. sitemap.xml 的静态页条目
 * 新增一个页面（例如新工具）只需在此加一条，勿再改插件里的数组。
 */

export interface FaqEntry {
  q: string
  a: string
}

export interface StaticPage {
  /** dist 下的子目录；空串表示站点根（不生成外壳——index.html 本身就是外壳） */
  dir: string
  /** <title> 用 */
  title: string
  /** meta description */
  desc: string
  /** 站内路径，统一带尾斜杠 */
  path: string
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: string
  /** 是否生成预渲染 head 外壳 */
  emitShell: boolean
  /** 页面级结构化数据，会被序列化后注入 head */
  jsonLd?: Record<string, unknown>
  /** FAQ 结构化数据（会被包装成 FAQPage） */
  faq?: FaqEntry[]
}

const SERVICES_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'AI 编码服务 · AI Coding Services',
  description:
    'AI coding workflow optimization and AI-generated code security audit & remediation — diagnose first, quote after. / 面向团队的 AI 编码落地服务，先诊断后报价。',
  url: `${SITE_URL}/services/`,
  email: SITE_EMAIL,
  areaServed: 'Worldwide',
  serviceType: ['AI coding workflow optimization', 'AI-generated code security audit'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'AI coding services / AI 编码服务',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI Coding Workflow Optimization / AI 编码工作流优化',
          description:
            'Assess Cursor / Claude Code / agent workflows, surface efficiency leaks, deliver an actionable optimization plan.',
        },
        priceSpecification: { '@type': 'PriceSpecification', minPrice: 500, maxPrice: 2000, priceCurrency: 'USD' },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI-Generated Code Security Audit & Remediation / AI 生成代码安全审计与修复',
          description:
            'Audit AI/agent-generated code, deliver a prioritized risk report, remediate on request. Relevant to CRA disclosure duties.',
        },
        priceSpecification: { '@type': 'PriceSpecification', minPrice: 3000, priceCurrency: 'USD' },
      },
    ],
  },
}

/**
 * 工具页标题/描述直接取 zh.json，避免与卡片文案出现两份。
 * 预渲染外壳是中文优先（与 listHtml 的站点名一致），故只读中文副本。
 */
function toolToPage(tool: ToolMeta): StaticPage {
  const item = zh.tools.items[tool.i18nKey]
  return {
    dir: `tools/${tool.slug}`,
    title: item.title,
    desc: item.desc,
    path: toolPath(tool),
    changefreq: 'monthly',
    priority: '0.6',
    emitShell: true,
  }
}

export const STATIC_PAGES: StaticPage[] = [
  {
    dir: '',
    title: '张豪 · 技术人文空间',
    desc: SITE_DESCRIPTION_ZH,
    path: '/',
    changefreq: 'weekly',
    priority: '1.0',
    emitShell: false,
  },
  {
    dir: 'about',
    title: '关于我',
    desc: `${SITE_DESCRIPTION_ZH}。Full-stack developer based in Guiyang, building AI-era tooling.`,
    path: '/about/',
    changefreq: 'monthly',
    priority: '0.8',
    emitShell: true,
  },
  {
    dir: 'blog',
    title: '博客',
    desc: `${SITE_DESCRIPTION_ZH}。Personal blog of Hao Zhang — AI-era engineering, product notes. English feed: /feed-en.xml`,
    path: '/blog/',
    changefreq: 'weekly',
    priority: '0.9',
    emitShell: true,
  },
  {
    dir: 'services',
    title: 'AI 编码服务',
    desc: 'AI coding workflow optimization and AI-generated code security audit & remediation — diagnose first, quote after.',
    path: '/services/',
    changefreq: 'monthly',
    priority: '0.7',
    emitShell: true,
    jsonLd: SERVICES_JSON_LD,
  },
  {
    dir: 'tools',
    title: '工坊与小工具',
    desc: '轻量造物 · 实用工具 · 外部雷达与精选链接。Lightweight in-house tools, workshops and curated links.',
    path: '/tools/',
    changefreq: 'monthly',
    priority: '0.6',
    emitShell: true,
    faq: [
      {
        q: '这些工具需要注册或登录吗？',
        a: '不需要。全部免注册、免登录、免安装，打开网页即可使用。',
      },
      {
        q: '工具是免费的吗？',
        a: '是。站内自研工具全部免费，不设付费墙，也没有使用次数限制。',
      },
      {
        q: '会收集我输入的内容吗？',
        a: '优先在浏览器本地完成计算，输入内容不离开你的设备。个别需要查询公开数据的工具会在页面上标明数据来源，且仅发送必要的查询参数。',
      },
      {
        q: '支持中文和英文吗？',
        a: '支持。站点与工具界面均提供中文与 English 两个版本，可随时切换。',
      },
    ],
  },
  {
    dir: 'slides',
    title: '演示文稿',
    desc: '视觉表达与深度演示 · Slides and talks',
    path: '/slides/',
    changefreq: 'monthly',
    priority: '0.5',
    emitShell: true,
  },
  {
    dir: 'privacy',
    title: '隐私政策',
    desc: '本站隐私政策：Cookie、Google AdSense 广告与数据收集说明。Privacy policy: cookies, Google AdSense ads and data collection.',
    path: '/privacy/',
    changefreq: 'yearly',
    priority: '0.3',
    emitShell: true,
  },
  // 已上线的工具页：每个工具一个独立 URL，是工具线长尾 SEO 的落点
  ...LIVE_TOOLS.map(toolToPage),
]

/**
 * 供插件注入的 FAQPage 结构化数据；无 faq 的页面返回 null。
 * 注意：Google 自 2023-08 起把 FAQ 富媒体结果收窄到政府/医疗等权威站点，
 * 个人站的 FAQPage 标记合法但**不会**产生 SERP 富摘要——加它是为了语义完整，
 * 不要指望它带来展示量。
 */
export function buildFaqJsonLd(page: StaticPage): string | null {
  if (!page.faq?.length) return null
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((entry) => ({
      '@type': 'Question',
      name: entry.q,
      acceptedAnswer: { '@type': 'Answer', text: entry.a },
    })),
  })
}
