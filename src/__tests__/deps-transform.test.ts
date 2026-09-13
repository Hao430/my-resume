import { describe, expect, it } from 'vitest'
import {
  buildPackageRecord,
  formatVulnRange,
  highestSeverity,
  packageSlug,
  pickLatestVersion,
  toIndexEntry,
  toVulnerabilityRecord,
  type PackageRecord,
  type RawVersionEntry,
  type RawVersionList,
} from '../utils/deps'

/** 按 deps.dev 真实响应构造条目：版本号嵌在 versionKey 里 */
const v = (version: string, publishedAt: string, isDefault = false): RawVersionEntry => ({
  versionKey: { system: 'NPM', name: 'x', version },
  publishedAt,
  isDefault,
})

/**
 * 取自 api.deps.dev 真实响应：原始顺序末尾是 4.9.0（不是最新版），
 * 最新版靠 isDefault 标记。
 */
const LODASH_VERSIONS: RawVersionList = {
  versions: [
    v('0.1.0', '2012-04-23T16:37:12Z'),
    v('4.17.20', '2020-08-13T16:53:54Z'),
    v('4.8.2', '2016-01-06T00:00:00Z'),
    v('4.18.1', '2026-04-01T21:01:20Z', true),
    v('4.9.0', '2016-04-08T15:22:34Z'),
  ],
}

describe('原始响应形状（deps.dev）', () => {
  it('版本号在 versionKey.version，扁平字段不存在（回归：曾按扁平写，16 个测试全绿而抓取全失败）', () => {
    const real = {
      versionKey: { system: 'NPM', name: 'lodash', version: '0.1.0' },
      publishedAt: '2012-04-23T16:37:12Z',
      isDefault: false,
      isDeprecated: false,
      deprecatedReason: '',
    }
    expect(pickLatestVersion({ versions: [real] })?.version).toBe('0.1.0')
  })
})

describe('packageSlug（URL 片段）', () => {
  it('普通包名原样使用', () => {
    expect(packageSlug('npm', 'lodash')).toBe('lodash')
    expect(packageSlug('pypi', 'requests')).toBe('requests')
  })

  it('npm 作用域包去掉前导 @ 并保留斜杠', () => {
    expect(packageSlug('npm', '@angular/core')).toBe('angular/core')
    expect(packageSlug('npm', '@types/node')).toBe('types/node')
  })

  it('统一小写（两个生态的包名都大小写不敏感）', () => {
    expect(packageSlug('pypi', 'Django')).toBe('django')
    expect(packageSlug('npm', 'Lodash')).toBe('lodash')
  })
})

describe('pickLatestVersion（spec §3.2 第 1、2 条坑）', () => {
  it('不依赖列表顺序：原始顺序末尾不是最新版时必须仍取对', () => {
    expect(pickLatestVersion(LODASH_VERSIONS)?.version).toBe('4.18.1')
  })

  it('以 isDefault 标记为准，而非 semver 比较', () => {
    const list: RawVersionList = {
      versions: [v('2.0.0', '2020-01-01T00:00:00Z'), v('2.1.0-rc.1', '2021-01-01T00:00:00Z', true)],
    }
    expect(pickLatestVersion(list)?.version).toBe('2.1.0-rc.1')
  })

  it('无 isDefault 标记时回退到发布时间最晚的一个', () => {
    const list: RawVersionList = {
      versions: [
        v('1.0.0', '2020-01-01T00:00:00Z'),
        v('1.1.0', '2022-01-01T00:00:00Z'),
        v('1.0.5', '2021-01-01T00:00:00Z'),
      ],
    }
    expect(pickLatestVersion(list)?.version).toBe('1.1.0')
  })

  it('空列表返回 null', () => {
    expect(pickLatestVersion({ versions: [] })).toBeNull()
  })

  it('版本号缺失的脏数据不产生 latest: undefined', () => {
    expect(
      pickLatestVersion({ versions: [{ publishedAt: '2020-01-01T00:00:00Z', isDefault: true }] }),
    ).toBeNull()
  })
})

describe('toVulnerabilityRecord（OSV 响应 → 记录）', () => {
  /** 逐字取自 api.osv.dev 的真实响应 */
  const OSV_REAL = {
    id: 'GHSA-29mw-wpgm-hmr9',
    summary: 'Regular Expression Denial of Service (ReDoS) in lodash',
    aliases: ['CVE-2020-28500'],
    database_specific: { severity: 'MODERATE' },
    affected: [
      {
        package: { name: 'lodash', ecosystem: 'npm', purl: 'pkg:npm/lodash' },
        ranges: [{ type: 'SEMVER', events: [{ introduced: '4.0.0' }, { fixed: '4.17.21' }] }],
      },
    ],
  }

  it('提取 id、CVE 别名、标题、严重度与受影响区间', () => {
    const record = toVulnerabilityRecord(OSV_REAL)
    expect(record.id).toBe('GHSA-29mw-wpgm-hmr9')
    expect(record.aliases).toEqual(['CVE-2020-28500'])
    expect(record.summary).toBe('Regular Expression Denial of Service (ReDoS) in lodash')
    expect(record.severity).toBe('MODERATE')
    expect(record.ranges).toEqual([{ introduced: '4.0.0', fixed: '4.17.21' }])
  })

  it('只保留 CVE 别名（GHSA 自身的别名对读者无意义）', () => {
    const record = toVulnerabilityRecord({
      ...OSV_REAL,
      aliases: ['CVE-2020-28500', 'GHSA-r5fr-rjxr-66jc', 'SOMETHING-ELSE'],
    })
    expect(record.aliases).toEqual(['CVE-2020-28500'])
  })

  it('严重度缺失时为 null，不报错（spec §3.2 第 4 条）', () => {
    const { database_specific: _drop, ...withoutSeverity } = OSV_REAL
    expect(toVulnerabilityRecord(withoutSeverity).severity).toBeNull()
    expect(toVulnerabilityRecord({ ...withoutSeverity, database_specific: {} }).severity).toBeNull()
  })

  it('last_affected 事件也能成区间', () => {
    const record = toVulnerabilityRecord({
      ...OSV_REAL,
      affected: [
        {
          ranges: [{ type: 'SEMVER', events: [{ introduced: '1.0.0' }, { last_affected: '1.4.2' }] }],
        },
      ],
    })
    expect(record.ranges).toEqual([{ introduced: '1.0.0', lastAffected: '1.4.2' }])
  })

  it('同一漏洞的多个区间都保留', () => {
    const record = toVulnerabilityRecord({
      ...OSV_REAL,
      affected: [
        {
          ranges: [
            {
              type: 'SEMVER',
              events: [
                { introduced: '1.0.0' },
                { fixed: '1.2.0' },
                { introduced: '2.0.0' },
                { fixed: '2.1.0' },
              ],
            },
          ],
        },
      ],
    })
    expect(record.ranges).toEqual([
      { introduced: '1.0.0', fixed: '1.2.0' },
      { introduced: '2.0.0', fixed: '2.1.0' },
    ])
  })

  it('无 summary 时回退到 id，无 affected 时区间为空数组', () => {
    const record = toVulnerabilityRecord({ id: 'GHSA-only' })
    expect(record.summary).toBe('GHSA-only')
    expect(record.ranges).toEqual([])
    expect(record.aliases).toEqual([])
  })
})

describe('formatVulnRange（区间只渲染成文字，不做版本比较）', () => {
  it('introduced + fixed → 半开区间', () => {
    expect(formatVulnRange({ introduced: '4.0.0', fixed: '4.17.21' })).toBe('>=4.0.0 <4.17.21')
  })

  it('introduced + lastAffected → 闭区间', () => {
    expect(formatVulnRange({ introduced: '1.0.0', lastAffected: '1.4.2' })).toBe('>=1.0.0 <=1.4.2')
  })

  it('introduced 为 "0" 表示自最早版本起（OSV 约定），不显示下界', () => {
    expect(formatVulnRange({ introduced: '0', fixed: '1.2.0' })).toBe('<1.2.0')
  })

  it('只有 introduced 时是开放上界', () => {
    expect(formatVulnRange({ introduced: '2.0.0' })).toBe('>=2.0.0')
  })

  it('空区间返回空串（UI 据此不渲染该行）', () => {
    expect(formatVulnRange({})).toBe('')
  })
})

describe('highestSeverity（供索引页排序与标识）', () => {
  const vuln = (severity: string | null) => ({
    id: 'x',
    aliases: [],
    summary: 's',
    severity,
    ranges: [],
  })

  it('按 CRITICAL > HIGH > MODERATE > LOW 取最高', () => {
    expect(highestSeverity([vuln('LOW'), vuln('CRITICAL'), vuln('MODERATE')])).toBe('CRITICAL')
    expect(highestSeverity([vuln('LOW'), vuln('HIGH')])).toBe('HIGH')
  })

  it('忽略未知严重度；全为空或空数组时返回 null', () => {
    expect(highestSeverity([vuln(null), vuln(null)])).toBeNull()
    expect(highestSeverity([])).toBeNull()
    expect(highestSeverity([vuln('SOMETHING')])).toBeNull()
  })
})

describe('toIndexEntry（索引只存摘要，防 bundle 膨胀）', () => {
  const full: PackageRecord = {
    system: 'pypi',
    name: 'tensorflow',
    slug: 'tensorflow',
    path: '/tools/dependency-radar/pypi/tensorflow/',
    latest: '2.21.0',
    publishedAt: '2026-01-01T00:00:00Z',
    licenses: ['Apache-2.0'],
    deprecated: false,
    deprecatedReason: '',
    versionCount: 200,
    latestAffected: false,
    vulnerabilities: [
      { id: 'a', aliases: [], summary: 's', severity: 'HIGH', ranges: [] },
      { id: 'b', aliases: [], summary: 's', severity: 'LOW', ranges: [] },
    ],
    fetchedAt: '2026-09-13',
  }

  it('丢弃漏洞明细，只留计数与最高严重度', () => {
    const entry = toIndexEntry(full)
    expect(entry).not.toHaveProperty('vulnerabilities')
    expect(entry.vulnerabilityCount).toBe(2)
    expect(entry.highestSeverity).toBe('HIGH')
  })

  it('保留列表与页面跳转所需字段', () => {
    const entry = toIndexEntry(full)
    expect(entry.path).toBe('/tools/dependency-radar/pypi/tensorflow/')
    expect(entry.latest).toBe('2.21.0')
    expect(entry.licenses).toEqual(['Apache-2.0'])
    expect(entry.latestAffected).toBe(false)
  })

  it('无漏洞时最高严重度为 null（列表不能显示成"零严重度"）', () => {
    const entry = toIndexEntry({ ...full, vulnerabilities: [] })
    expect(entry.vulnerabilityCount).toBe(0)
    expect(entry.highestSeverity).toBeNull()
  })
})

describe('buildPackageRecord', () => {
  const versionDetail = {
    licenses: ['MIT'],
    isDeprecated: false,
    deprecatedReason: '',
    links: [
      { label: 'HOMEPAGE', url: 'https://lodash.com/' },
      { label: 'SOURCE_REPO', url: 'git+https://github.com/lodash/lodash.git' },
    ],
  }

  const lodashVuln = {
    id: 'GHSA-29mw-wpgm-hmr9',
    aliases: ['CVE-2020-28500'],
    summary: 'ReDoS in lodash',
    severity: 'MODERATE',
    ranges: [{ introduced: '4.0.0', fixed: '4.17.21' }],
  }

  it('组装出完整的包记录（漏洞为历史全量，非仅最新版）', () => {
    const record = buildPackageRecord({
      system: 'npm',
      name: 'lodash',
      versionList: LODASH_VERSIONS,
      versionDetail,
      vulnerabilities: [lodashVuln],
      latestAffected: false,
      fetchedAt: '2026-09-13',
    })
    expect(record).not.toBeNull()
    expect(record?.latest).toBe('4.18.1')
    expect(record?.slug).toBe('lodash')
    expect(record?.path).toBe('/tools/dependency-radar/npm/lodash/')
    expect(record?.licenses).toEqual(['MIT'])
    expect(record?.versionCount).toBe(5)
    expect(record?.homepage).toBe('https://lodash.com/')
  })

  it('两个事实同时保留：有历史漏洞，但最新版不受影响（spec §4.3 要守的场景）', () => {
    const record = buildPackageRecord({
      system: 'npm',
      name: 'lodash',
      versionList: LODASH_VERSIONS,
      versionDetail,
      vulnerabilities: [lodashVuln],
      latestAffected: false,
      fetchedAt: '2026-09-13',
    })
    expect(record?.vulnerabilities).toHaveLength(1)
    expect(record?.latestAffected).toBe(false)
  })

  it('最新版受影响时 latestAffected 为 true', () => {
    const record = buildPackageRecord({
      system: 'npm',
      name: 'lodash',
      versionList: LODASH_VERSIONS,
      versionDetail,
      vulnerabilities: [lodashVuln],
      latestAffected: true,
      fetchedAt: '2026-09-13',
    })
    expect(record?.latestAffected).toBe(true)
  })

  it('作用域包的 slug 与 path 正确（路由靠它）', () => {
    const record = buildPackageRecord({
      system: 'npm',
      name: '@angular/core',
      versionList: { versions: [v('17.0.0', '2023-11-01T00:00:00Z', true)] },
      versionDetail,
      vulnerabilities: [],
      latestAffected: false,
      fetchedAt: '2026-09-13',
    })
    expect(record?.slug).toBe('angular/core')
    expect(record?.path).toBe('/tools/dependency-radar/npm/angular/core/')
  })

  it('剥离 git+ 前缀，源码链接可直接点击', () => {
    const record = buildPackageRecord({
      system: 'npm',
      name: 'lodash',
      versionList: LODASH_VERSIONS,
      versionDetail,
      vulnerabilities: [],
      latestAffected: false,
      fetchedAt: '2026-09-13',
    })
    expect(record?.repo).toBe('https://github.com/lodash/lodash.git')
  })

  it('无版本数据时返回 null（宁可略去，不写半成品）', () => {
    expect(
      buildPackageRecord({
        system: 'npm',
        name: 'ghost',
        versionList: { versions: [] },
        versionDetail,
        vulnerabilities: [],
        latestAffected: false,
        fetchedAt: '2026-09-13',
      }),
    ).toBeNull()
  })

  it('缺失可选字段（主页/仓库）不报错，字段省略', () => {
    const record = buildPackageRecord({
      system: 'pypi',
      name: 'requests',
      versionList: { versions: [v('2.31.0', '2023-05-22T00:00:00Z', true)] },
      versionDetail: { ...versionDetail, links: [] },
      vulnerabilities: [],
      latestAffected: false,
      fetchedAt: '2026-09-13',
    })
    expect(record?.homepage).toBeUndefined()
    expect(record?.repo).toBeUndefined()
  })
})
