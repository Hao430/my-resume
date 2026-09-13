/**
 * 依赖雷达的纯变换逻辑（无 IO）
 * ------------------------------------------------------------
 * spec: docs/specs/dependency-radar.md
 *
 * 抓取（网络）在 scripts/sync-deps.ts，本模块只负责把两个数据源的原始响应
 * 转成站点用的记录，因此可单测，也保证构建期不联网。
 *
 * 数据源分工（spec §3.1）：
 *   deps.dev → 版本、许可证、弃用状态、链接
 *   OSV      → 漏洞（历史全量 + 受影响区间 + 最新版是否受影响）
 *
 * ⚠️ 实测踩过的坑，本模块是唯一防线：
 *   1. deps.dev 的版本号嵌在 `versionKey.version`，不是扁平字段
 *      （曾按扁平写类型与测试夹具，16 个测试全绿而实际抓取 100% 失败）
 *   2. 版本列表**不排序**（lodash 原始顺序末尾停在 4.9.0），不能取最后一个
 *   3. 最新版看 isDefault 标记，不要用 semver 比较（预发布版会算错）
 *   4. OSV 的严重度在 `database_specific.severity`（分类标签），
 *      `severity[].score` 是 CVSS 向量不是分数；两处都可能缺失
 *   5. 受影响区间是事件数组，须按 introduced/fixed 配对成区间；
 *      程序不对区间做任何版本比较（npm semver 与 PyPI PEP 440 规则不同）
 */

export type DepsSystem = 'npm' | 'pypi'

/** 工具在 URL 中的 slug，与 src/data/tools.ts 的 code-security-checker 对应 */
export const DEPENDENCY_RADAR_SLUG = 'dependency-radar'

/** OSV 侧的生态名与 URL 里的 system 不一致，需要映射 */
export const OSV_ECOSYSTEM: Record<DepsSystem, string> = {
  npm: 'npm',
  pypi: 'PyPI',
}

/* ---------------- deps.dev 原始形状 ---------------- */

export interface RawVersionEntry {
  versionKey?: { version?: string }
  publishedAt: string
  isDefault: boolean
}

export interface RawVersionList {
  versions?: RawVersionEntry[]
}

export interface RawVersionDetail {
  licenses?: string[]
  isDeprecated?: boolean
  deprecatedReason?: string
  links?: { label: string; url: string }[]
}

/** 归一化后的最新版信息 */
export interface LatestVersion {
  version: string
  publishedAt: string
}

/* ---------------- OSV 原始形状 ---------------- */

export interface RawOsvVuln {
  id: string
  summary?: string
  aliases?: string[]
  published?: string
  database_specific?: { severity?: string }
  affected?: {
    ranges?: {
      type?: string
      events?: { introduced?: string; fixed?: string; last_affected?: string }[]
    }[]
  }[]
}

/** 受影响区间；introduced 缺失表示「从最早版本起」 */
export interface VulnRange {
  introduced?: string
  fixed?: string
  lastAffected?: string
}

export interface VulnerabilityRecord {
  id: string
  /** 仅保留 CVE 别名——GHSA 自身的别名对读者无意义 */
  aliases: string[]
  summary: string
  /** LOW | MODERATE | HIGH | CRITICAL；缺失为 null，UI 须能处理 */
  severity: string | null
  /** 披露时间，用于排序与展示；缺失为 null */
  published: string | null
  ranges: VulnRange[]
}

/* ---------------- 站点记录 ---------------- */

export interface PackageRecord {
  system: DepsSystem
  name: string
  /** URL 片段：作用域包去前导 @（@angular/core → angular/core） */
  slug: string
  /** 完整站内路径，统一带尾斜杠 */
  path: string
  latest: string
  publishedAt: string
  licenses: string[]
  deprecated: boolean
  deprecatedReason: string
  versionCount: number
  homepage?: string
  repo?: string
  /** **当前最新版**是否落在任一受影响区间内（由 OSV 带 version 的查询直接给出） */
  latestAffected: boolean
  /** **历史总数**，含已修复的——与 latestAffected 是两个不同的事实 */
  vulnerabilityCount: number
  severityCounts: Record<string, number>
  /** 已按 §4.5 排序并截断；长度可能小于 vulnerabilityCount */
  vulnerabilities: VulnerabilityRecord[]
  fetchedAt: string
}

/* ---------------- 变换 ---------------- */

/**
 * URL 片段。统一小写：npm 禁止大写包名，PyPI 包名大小写不敏感，
 * 因此小写是两者的规范形式，也能保证同一包不会产生两个 URL。
 */
export function packageSlug(_system: DepsSystem, name: string): string {
  const lower = name.trim().toLowerCase()
  return lower.startsWith('@') ? lower.slice(1) : lower
}

/** 站内路径：作用域包保留斜杠，故可能是三段（见 spec §4.4 的可重复路由参数） */
export function packagePath(system: DepsSystem, name: string): string {
  return `/tools/${DEPENDENCY_RADAR_SLUG}/${system}/${packageSlug(system, name)}/`
}

/**
 * 取最新版。优先 isDefault 标记；无标记时回退到发布时间最晚的一个；
 * 空列表返回 null。**任何情况下都不要依赖数组顺序。**
 */
export function pickLatestVersion(list: RawVersionList): LatestVersion | null {
  // 版本号缺失的条目视为脏数据，直接排除——否则会写出 latest: undefined
  const versions = (list.versions ?? []).filter((entry) => entry.versionKey?.version)
  if (versions.length === 0) return null

  const flagged = versions.find((entry) => entry.isDefault)
  const chosen =
    flagged ??
    versions.reduce((newest, entry) => (entry.publishedAt > newest.publishedAt ? entry : newest))

  const version = chosen.versionKey?.version
  return version ? { version, publishedAt: chosen.publishedAt } : null
}

/** 把 OSV 的事件数组按 introduced/fixed 配对成区间列表 */
function toRanges(affected: RawOsvVuln['affected']): VulnRange[] {
  const ranges: VulnRange[] = []
  for (const entry of affected ?? []) {
    for (const range of entry.ranges ?? []) {
      let current: VulnRange | null = null
      for (const event of range.events ?? []) {
        if (event.introduced !== undefined) {
          if (current) ranges.push(current)
          current = { introduced: event.introduced }
          continue
        }
        // fixed / last_affected 关闭当前区间；若此前没有 introduced，则是一个开放起点
        const closed: VulnRange = current ?? {}
        if (event.fixed !== undefined) closed.fixed = event.fixed
        if (event.last_affected !== undefined) closed.lastAffected = event.last_affected
        ranges.push(closed)
        current = null
      }
      if (current) ranges.push(current)
    }
  }
  return ranges
}

/** OSV 响应 → 站点记录。缺失字段一律降级，不抛错 */
export function toVulnerabilityRecord(osv: RawOsvVuln): VulnerabilityRecord {
  const severity =
    typeof osv.database_specific?.severity === 'string' ? osv.database_specific.severity : null
  return {
    id: osv.id,
    aliases: (osv.aliases ?? []).filter((alias) => /^CVE-/i.test(alias)),
    summary: osv.summary?.trim() || osv.id,
    severity,
    published: typeof osv.published === 'string' ? osv.published : null,
    ranges: toRanges(osv.affected),
  }
}

/* ---------------- 排序与截断（spec §4.5） ---------------- */

/**
 * 每包最多存储的漏洞条目数。实测 156 个包中仅 6 个超过此值，
 * 截断后明细总体积从 1.8 MB 降到 0.51 MB，最大单文件从 614 KB 降到约 36 KB。
 */
export const MAX_STORED_VULNS = 50

const SEVERITY_ORDER = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL']

/** 未知严重度记 -1，排在所有已知等级之后 */
function severityRank(severity: string | null): number {
  return severity ? SEVERITY_ORDER.indexOf(severity) : -1
}

/**
 * 严重度降序 → 发布时间降序 → id 升序。
 * 末位用 id 兜底是为了**排序确定**：否则同一份输入每次跑出的顺序可能不同，
 * 每次同步都会产生满屏 git diff 噪声。
 */
export function sortVulnerabilities(vulnerabilities: VulnerabilityRecord[]): VulnerabilityRecord[] {
  return [...vulnerabilities].sort((a, b) => {
    const bySeverity = severityRank(b.severity) - severityRank(a.severity)
    if (bySeverity !== 0) return bySeverity
    const byDate = (b.published ?? '').localeCompare(a.published ?? '')
    if (byDate !== 0) return byDate
    return a.id.localeCompare(b.id)
  })
}

/** 各严重度的条目数；严重度缺失记为 UNKNOWN。只统计出现过的键，保持 JSON 精简 */
export function countBySeverity(vulnerabilities: VulnerabilityRecord[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const vuln of vulnerabilities) {
    const key = vuln.severity && SEVERITY_ORDER.includes(vuln.severity) ? vuln.severity : 'UNKNOWN'
    counts[key] = (counts[key] ?? 0) + 1
  }
  return counts
}

export interface CappedVulnerabilities {
  /** **历史总数**，与截断无关——页面必须用它而不是 vulnerabilities.length */
  vulnerabilityCount: number
  severityCounts: Record<string, number>
  vulnerabilities: VulnerabilityRecord[]
}

/**
 * 排序并截断。总数与严重度分布都基于**截断前**的全部条目统计，
 * 否则读者会以为这个包只有 50 条漏洞、且分布被扭曲。
 */
export function capVulnerabilities(
  vulnerabilities: VulnerabilityRecord[],
  max = MAX_STORED_VULNS,
): CappedVulnerabilities {
  return {
    vulnerabilityCount: vulnerabilities.length,
    severityCounts: countBySeverity(vulnerabilities),
    vulnerabilities: sortVulnerabilities(vulnerabilities).slice(0, max),
  }
}

/**
 * 把受影响区间渲染成文字，如 `>=4.0.0 <4.17.21`。
 * **只做格式化，不做任何版本比较**——npm semver 与 PyPI PEP 440 规则不同，
 * 由程序判断「某版本是否落在此区间内」极易出错，那件事交给 OSV 的带 version 查询。
 * OSV 约定 introduced 为 "0" 表示自最早版本起，此时不显示下界。
 */
export function formatVulnRange(range: VulnRange): string {
  const hasLower = Boolean(range.introduced) && range.introduced !== '0'
  const lower = hasLower ? `>=${range.introduced}` : ''
  const upper = range.fixed ? `<${range.fixed}` : range.lastAffected ? `<=${range.lastAffected}` : ''
  return [lower, upper].filter(Boolean).join(' ')
}

/** 一组漏洞里的最高严重度；无可用严重度时返回 null */
export function highestSeverity(vulnerabilities: VulnerabilityRecord[]): string | null {
  let best: string | null = null
  for (const vuln of vulnerabilities) {
    const severity = vuln.severity
    if (!severity || !SEVERITY_ORDER.includes(severity)) continue
    if (best === null || SEVERITY_ORDER.indexOf(severity) > SEVERITY_ORDER.indexOf(best)) {
      best = severity
    }
  }
  return best
}

/**
 * 索引条目：列表与页面跳转所需的最小字段集，**不含漏洞明细**。
 *
 * 实测理由：156 个包的完整记录是 1.5 MB（gzip 120 KB），整个塞进客户端 bundle 太重；
 * 摘要只有 62 KB。而漏洞条目前 5 个包就占了 61%（tensorflow 一个包 861 条）。
 * 因此明细按包分文件、按需动态加载，索引只留计数与最高严重度。
 * 注意无漏洞时 highestSeverity 是 null，**不是**「零严重度」。
 */
export interface PackageIndexEntry {
  system: DepsSystem
  name: string
  slug: string
  path: string
  latest: string
  publishedAt: string
  licenses: string[]
  deprecated: boolean
  latestAffected: boolean
  vulnerabilityCount: number
  highestSeverity: string | null
}

export function toIndexEntry(record: PackageRecord): PackageIndexEntry {
  return {
    system: record.system,
    name: record.name,
    slug: record.slug,
    path: record.path,
    latest: record.latest,
    publishedAt: record.publishedAt,
    licenses: record.licenses,
    deprecated: record.deprecated,
    latestAffected: record.latestAffected,
    // 用历史总数，不是截断后的长度——否则索引里的数字会比包页少
    vulnerabilityCount: record.vulnerabilityCount,
    highestSeverity: highestSeverity(record.vulnerabilities),
  }
}

/** deps.dev 的源码链接带 git+ 前缀，直接点会 404，需要剥掉 */
function pickLink(links: RawVersionDetail['links'], label: string): string | undefined {
  const url = links?.find((link) => link.label === label)?.url
  return url ? url.replace(/^git\+/, '') : undefined
}

export interface BuildPackageInput {
  system: DepsSystem
  name: string
  versionList: RawVersionList
  versionDetail: RawVersionDetail
  /** OSV 的**历史全量**漏洞 */
  vulnerabilities: VulnerabilityRecord[]
  /** 最新版是否受影响，由带 version 的 OSV 查询直接得出 */
  latestAffected: boolean
  fetchedAt: string
}

/**
 * 组装包记录。无版本数据时返回 null——调用方须据此**略去该包**，
 * 而不是写入半成品（spec §4.5）。
 */
export function buildPackageRecord(input: BuildPackageInput): PackageRecord | null {
  const latest = pickLatestVersion(input.versionList)
  if (!latest) return null

  const detail = input.versionDetail
  const capped = capVulnerabilities(input.vulnerabilities)
  const record: PackageRecord = {
    system: input.system,
    name: input.name,
    slug: packageSlug(input.system, input.name),
    path: packagePath(input.system, input.name),
    latest: latest.version,
    publishedAt: latest.publishedAt,
    licenses: detail.licenses ?? [],
    deprecated: detail.isDeprecated ?? false,
    deprecatedReason: detail.deprecatedReason ?? '',
    versionCount: input.versionList.versions?.length ?? 0,
    latestAffected: input.latestAffected,
    vulnerabilityCount: capped.vulnerabilityCount,
    severityCounts: capped.severityCounts,
    vulnerabilities: capped.vulnerabilities,
    fetchedAt: input.fetchedAt,
  }

  const homepage = pickLink(detail.links, 'HOMEPAGE')
  if (homepage) record.homepage = homepage
  const repo = pickLink(detail.links, 'SOURCE_REPO')
  if (repo) record.repo = repo

  return record
}
