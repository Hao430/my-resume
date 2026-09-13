import { SITE_DESCRIPTION_ZH, SITE_EMAIL, SITE_URL } from '../utils/site'
import { LIVE_TOOLS, toolPath, type ToolMeta } from './tools'
import zh from '../i18n/locales/zh.json'
import depsIndex from './deps/index.json'

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

/**
 * 服务页结构化数据。
 *
 * 2026-09-13：服务线暂停（页面文案为「旧版服务模块已暂停接待」），因此这里**不再声明任何
 * 服务套餐、OfferCatalog 或价格**——结构化数据必须代表页面上可见的内容，标记页面上并不存在
 * 的套餐就是虚假标记（Google 结构化数据政策；也是本站 2026-09-13 SEO 巡检的未修项之一）。
 * 恢复服务时再补 OfferCatalog，并同步改 `ServicesPage.vue` 里同名 id 的运行时版本
 * （两处 id 都是 `services-ld`，运行时那份会覆盖这里这份，必须成对改）。
 */
const SERVICES_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: zh.services.title,
  description: zh.services.subtitle,
  url: `${SITE_URL}/services/`,
  email: SITE_EMAIL,
  areaServed: 'Worldwide',
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

/**
 * 依赖雷达的每包页面。数量由数据决定（当前 156 个），不可能手写进本数组，
 * 因此这里是 spec §9 说的「页面清单由数据驱动」。
 *
 * 描述文案遵守 spec §4.3：区分「最新版不受影响」与「无已知漏洞」，
 * 绝不把前者写成「安全」。
 */
function depsPackagePages(): StaticPage[] {
  return depsIndex.packages.map((pkg) => {
    const license = pkg.licenses.join(' · ') || '未知'
    let desc: string
    if (pkg.latestAffected) {
      desc = `${pkg.name} ${pkg.latest} 存在尚未修复的已知漏洞，受影响版本区间与公告见页面。许可证 ${license}。`
    } else if (pkg.vulnerabilityCount > 0) {
      desc = `${pkg.name} ${pkg.latest} 不受已知漏洞影响；历史上共有 ${pkg.vulnerabilityCount} 条漏洞记录，受影响区间见页面。许可证 ${license}。`
    } else {
      desc = `${pkg.name} ${pkg.latest} 没有已知漏洞记录。许可证 ${license}。`
    }
    return {
      dir: `tools/dependency-radar/${pkg.system}/${pkg.slug}`,
      title: `${pkg.name} ${pkg.latest} · 漏洞与许可证`,
      desc,
      path: pkg.path,
      changefreq: 'weekly',
      priority: '0.5',
      emitShell: true,
    }
  })
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
    desc: '顾问咨询与技术服务体系正在重新规划，旧版固定服务套餐已暂停；当前开放邮件直联与定制讨论。Service offerings are under restructuring — direct inquiry by email remains open.',
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
  // 依赖雷达的包页：数据驱动，当前 156 个
  ...depsPackagePages(),
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
