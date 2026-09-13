import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import DependencyRadarPage from '../pages/tools/DependencyRadarPage.vue'
import DependencyPackagePage from '../pages/tools/DependencyPackagePage.vue'
import indexData from '../data/deps/index.json'
import { makeI18n, resetDom } from './helpers'

const stub = { template: '<div />' }

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/tools', name: 'tools', component: stub },
      { path: '/tools/dependency-radar', name: 'radar', component: DependencyRadarPage },
      { path: '/tools/dependency-radar/:system/:pkg+', name: 'pkg', component: DependencyPackagePage },
    ],
  })
}

async function mountIndex(locale: 'zh' | 'en' = 'zh') {
  const { i18n, composer } = makeI18n(locale)
  const router = makeRouter()
  router.push('/tools/dependency-radar')
  await router.isReady()
  const wrapper = mount(DependencyRadarPage, { global: { plugins: [i18n, router] } })
  return { wrapper, composer }
}

async function mountPackage(url: string, locale: 'zh' | 'en' = 'zh') {
  const { i18n, composer } = makeI18n(locale)
  const router = makeRouter()
  router.push(url)
  await router.isReady()
  const wrapper = mount(DependencyPackagePage, { global: { plugins: [i18n, router] } })
  // 明细是按需动态 import 的：解析比微任务晚一拍，flushPromises 不够，
  // 必须等 loading 状态结束再断言。
  await vi.waitFor(
    () => {
      if (wrapper.find('.state').exists() && wrapper.text().includes(composer.t('tools.radar.loading'))) {
        throw new Error('仍在加载')
      }
    },
    { timeout: 3000 },
  )
  return { wrapper, composer }
}

const zhIndex = makeI18n('zh').composer

describe('依赖雷达索引页', () => {
  it('列出全部收录的包', async () => {
    resetDom()
    const { wrapper } = await mountIndex()
    expect(wrapper.findAll('.pkg-row')).toHaveLength(indexData.packages.length)
    wrapper.unmount()
  })

  it('明确写出这是精选子集而非全量索引（spec §4.1）', async () => {
    resetDom()
    const { wrapper } = await mountIndex()
    const note = wrapper.find('.coverage-note').text()
    expect(note).toContain(String(indexData.packages.length))
    // 必须告诉读者「查不到不代表不存在」
    expect(note).toContain('不代表它不存在')
    wrapper.unmount()
  })

  it('过滤按包名收窄列表', async () => {
    resetDom()
    const { wrapper } = await mountIndex()
    await wrapper.find('.filter').setValue('lodash')
    const rows = wrapper.findAll('.pkg-row')
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.length).toBeLessThan(indexData.packages.length)
    expect(rows.every((row) => row.text().includes('lodash'))).toBe(true)
    wrapper.unmount()
  })

  it('无匹配时给出提示而不是空白', async () => {
    resetDom()
    const { wrapper } = await mountIndex()
    await wrapper.find('.filter').setValue('zzz-no-such-package')
    expect(wrapper.findAll('.pkg-row')).toHaveLength(0)
    expect(wrapper.find('.empty').exists()).toBe(true)
    wrapper.unmount()
  })

  it('标注数据抓取时间（静态页会过时）', async () => {
    resetDom()
    const { wrapper } = await mountIndex()
    expect(wrapper.find('.disclaimer').text()).toContain(indexData.fetchedAt)
    wrapper.unmount()
  })

  it('英文环境下整页不含中文', async () => {
    resetDom()
    const { wrapper } = await mountIndex('en')
    expect(/[一-鿿]/.test(wrapper.find('.radar-page').text())).toBe(false)
    wrapper.unmount()
  })
})

describe('包页：结论先行的两种文案（spec §4.3）', () => {
  it('有历史漏洞但最新版安全 → 说「不受影响」，并明说这不等同于安全', async () => {
    resetDom()
    const { wrapper } = await mountPackage('/tools/dependency-radar/npm/lodash')
    // 包名在页头，版本号在结论框
    expect(wrapper.find('.page-header__title').text()).toContain('lodash')

    const verdict = wrapper.find('.verdict')
    expect(verdict.classes()).toContain('verdict--ok')
    expect(verdict.text()).toContain('4.18.1')
    expect(verdict.text()).toContain('不受已知漏洞影响')

    // 关键：不得把「最新版干净」写成「这个包安全」——除非那句话本身是在否定它
    expect(verdict.text()).not.toMatch(/(?<!不等同于「)这个包安全/)
    expect(wrapper.find('.verdict__hint').text()).toContain('不等同于')
    // 且必须给出历史漏洞数量，避免读者以为这个包从未出过问题
    expect(wrapper.find('.verdict__hint').text()).toContain('10')
    wrapper.unmount()
  })

  it('最新版受影响 → 给出警示态', async () => {
    resetDom()
    const { wrapper } = await mountPackage('/tools/dependency-radar/pypi/scrapy')
    const verdict = wrapper.find('.verdict')
    expect(verdict.classes()).toContain('verdict--warn')
    expect(verdict.text()).toContain('2.19.0')
    wrapper.unmount()
  })

  it('零记录时说「没有已知漏洞记录」，仍不下安全结论', async () => {
    resetDom()
    const { wrapper } = await mountPackage('/tools/dependency-radar/npm/autoprefixer')
    expect(wrapper.find('.history').text()).toContain(zhIndex.t('tools.radar.pkgHistoryNone'))
    expect(wrapper.find('.verdict').text()).toContain(zhIndex.t('tools.radar.pkgLatestSafe', { version: '10.5.0' }).slice(0, 4))
    wrapper.unmount()
  })
})

describe('构建期不联网（spec §2 硬约束）', () => {
  const BUILD_SOURCES = [
    'build/static-site.ts',
    'vite.config.ts',
    'src/data/site-pages.ts',
    'src/data/tools.ts',
    'src/utils/deps.ts',
  ]

  it('构建链路里的源码不含任何网络调用', () => {
    for (const relative of BUILD_SOURCES) {
      const source = readFileSync(path.resolve(__dirname, '../..', relative), 'utf-8')
      expect(source, `${relative} 不应发起网络请求`).not.toMatch(
        /\bfetch\s*\(|XMLHttpRequest|axios|node:https?['"]/,
      )
    }
  })

  it('build 脚本不调用 sync-deps（抓取必须是独立手动步骤）', () => {
    const pkg = JSON.parse(readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'))
    expect(pkg.scripts.build).not.toContain('sync-deps')
    expect(pkg.scripts['build-only']).not.toContain('sync-deps')
    expect(pkg.scripts['sync-deps']).toContain('sync-deps.ts')
  })

  it('生成的索引只含摘要，不含漏洞明细（防 bundle 膨胀）', () => {
    for (const entry of indexData.packages) {
      expect(entry).not.toHaveProperty('vulnerabilities')
      expect(entry).toHaveProperty('vulnerabilityCount')
    }
  })
})

describe('包页：列表截断（spec §4.5）', () => {
  it('被截断时显示历史总数而非 50，并给出 OSV 完整列表入口', async () => {
    resetDom()
    const { wrapper } = await mountPackage('/tools/dependency-radar/pypi/tensorflow')

    // 标题里的数字必须是历史总数
    expect(wrapper.find('.history__count').text()).toBe('861')
    // 卡片最多渲染 50 张
    expect(wrapper.findAll('.vuln')).toHaveLength(50)

    const note = wrapper.find('.truncated-note')
    expect(note.exists()).toBe(true)
    const link = note.find('a')
    expect(link.attributes('href')).toContain('osv.dev/list')
    expect(link.attributes('href')).toContain('tensorflow')
    wrapper.unmount()
  })

  it('严重度分布在被截断时仍代表全部条目（不被截断扭曲）', async () => {
    resetDom()
    const { wrapper } = await mountPackage('/tools/dependency-radar/pypi/tensorflow')
    const shown = wrapper
      .findAll('.severity-breakdown .badge')
      .map((n) => Number(n.text().replace(/\D/g, '')))
      .reduce((sum, n) => sum + n, 0)
    // 分布之和应等于历史总数，而不是渲染出来的 50 条
    expect(shown).toBe(861)
    wrapper.unmount()
  })

  it('未超上限的包不显示截断提示', async () => {
    resetDom()
    const { wrapper } = await mountPackage('/tools/dependency-radar/npm/lodash')
    expect(wrapper.find('.truncated-note').exists()).toBe(false)
    wrapper.unmount()
  })
})

describe('包页：内容与路由', () => {
  it('列出历史漏洞及其受影响区间（读者靠它对照自己手里的版本）', async () => {
    resetDom()
    const { wrapper } = await mountPackage('/tools/dependency-radar/npm/lodash')
    const vulns = wrapper.findAll('.vuln')
    expect(vulns.length).toBeGreaterThan(0)
    // 至少一条带区间，且区间是渲染成文字的比较表达式
    const rangeTexts = wrapper.findAll('.vuln__range').map((n) => n.text())
    expect(rangeTexts.length).toBeGreaterThan(0)
    expect(rangeTexts.some((text) => /^[<>]=?/.test(text))).toBe(true)
    wrapper.unmount()
  })

  it('作用域包的三段路径能解析（:pkg+ 可重复参数）', async () => {
    resetDom()
    const { wrapper } = await mountPackage('/tools/dependency-radar/npm/angular/core')
    expect(wrapper.find('.page-header__title').text()).toContain('@angular/core')
    wrapper.unmount()
  })

  it('未知包给出提示与返回入口，不白屏', async () => {
    resetDom()
    const { wrapper } = await mountPackage('/tools/dependency-radar/npm/no-such-pkg-xyz')
    expect(wrapper.findAll('.vuln')).toHaveLength(0)
    expect(wrapper.text()).toContain(zhIndex.t('tools.radar.pkgNotFound'))
    wrapper.unmount()
  })

  it('每个漏洞链接到 OSV 原始公告', async () => {
    resetDom()
    const { wrapper } = await mountPackage('/tools/dependency-radar/npm/lodash')
    const link = wrapper.find('.vuln__id')
    expect(link.attributes('href')).toMatch(/^https:\/\/osv\.dev\/vulnerability\//)
    wrapper.unmount()
  })

  it('英文环境下包页不含中文', async () => {
    resetDom()
    const { wrapper } = await mountPackage('/tools/dependency-radar/npm/lodash', 'en')
    // 漏洞标题来自 OSV，本身是英文；只需确认界面文案已本地化
    expect(/[一-鿿]/.test(wrapper.find('.verdict').text())).toBe(false)
    wrapper.unmount()
  })
})
