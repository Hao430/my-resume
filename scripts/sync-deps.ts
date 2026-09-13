/**
 * 依赖雷达数据同步（**手动执行，不参与 build**）
 * ------------------------------------------------------------
 * spec: docs/specs/dependency-radar.md
 *
 * 从 api.deps.dev 抓取 scripts/deps-seed.json 里各包的最新版信息，
 * 生成 src/data/deps/index.json 并提交进仓库。
 *
 * 设计约束（spec §2）：构建期**绝不**联网。若让 npm run build 直连第三方，
 * 对方一抖动就会阻塞 ESA 部署。所以抓取是这条独立命令，产物随仓库提交。
 *
 * 用法：npm run sync-deps
 */

import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import {
  OSV_ECOSYSTEM,
  buildPackageRecord,
  pickLatestVersion,
  toIndexEntry,
  toVulnerabilityRecord,
  type DepsSystem,
  type RawOsvVuln,
} from '../src/utils/deps.ts'

const API = 'https://api.deps.dev/v3'
const OSV = 'https://api.osv.dev/v1/query'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SEED_PATH = path.join(ROOT, 'scripts', 'deps-seed.json')
const DEPS_DIR = path.join(ROOT, 'src', 'data', 'deps')
const OUT_PATH = path.join(DEPS_DIR, 'index.json')
/** 每包明细单独存放，供页面按需动态加载（索引只放摘要，见 spec §3.3） */
const PACKAGES_DIR = path.join(DEPS_DIR, 'packages')

/** 并发上限：对公共 API 保持礼貌，也避免被限流 */
const CONCURRENCY = 4
/** 尝试次数（含首次）。第三方偶发抖动不该让整包数据消失 */
const ATTEMPTS = 3

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function getJson(url, attempt = 1) {
  try {
    const res = await fetch(url, { headers: { accept: 'application/json' } })
    // 404 是确定性的（包不存在），重试无意义
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (error) {
    if (attempt >= ATTEMPTS) throw error
    await sleep(400 * attempt)
    return getJson(url, attempt + 1)
  }
}

async function postJson(url, body, attempt = 1) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (error) {
    if (attempt >= ATTEMPTS) throw error
    await sleep(400 * attempt)
    return postJson(url, body, attempt + 1)
  }
}

async function fetchPackage(system: DepsSystem, name: string) {
  const encoded = encodeURIComponent(name)
  const versionList = await getJson(`${API}/systems/${system}/packages/${encoded}`)
  if (!versionList) return { ok: false, reason: '包不存在（404）' }

  // 坑 1、2：列表不排序，最新版看 isDefault —— 必须走 pickLatestVersion
  const latest = pickLatestVersion(versionList)
  if (!latest) return { ok: false, reason: '无版本数据' }

  // deps.dev 负责许可证、弃用状态与链接
  const versionDetail = await getJson(
    `${API}/systems/${system}/packages/${encoded}/versions/${encodeURIComponent(latest.version)}`,
  )
  if (!versionDetail) return { ok: false, reason: `版本详情缺失（${latest.version}）` }

  // OSV 负责漏洞：按包查全部历史，再按版本查最新版是否受影响。
  // 两次查询都必要——前者给历史与受影响区间，后者避免自己做版本区间比较。
  const pkg = { name, ecosystem: OSV_ECOSYSTEM[system] }
  const allVulns = await postJson(OSV, { package: pkg })
  const latestVulns = await postJson(OSV, { package: pkg, version: latest.version })

  const vulnerabilities = ((allVulns?.vulns ?? []) as RawOsvVuln[]).map(toVulnerabilityRecord)
  const latestIds = new Set(((latestVulns?.vulns ?? []) as RawOsvVuln[]).map((entry) => entry.id))

  const record = buildPackageRecord({
    system,
    name,
    versionList,
    versionDetail,
    vulnerabilities,
    latestAffected: latestIds.size > 0,
    fetchedAt: new Date().toISOString().slice(0, 10),
  })
  return record ? { ok: true, record } : { ok: false, reason: '组装结果为空' }
}

/** 固定并发的工作池 */
async function mapPool(items, limit, worker) {
  const results = []
  let cursor = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await worker(items[index])
    }
  })
  await Promise.all(runners)
  return results
}

async function main() {
  const seed = JSON.parse(await readFile(SEED_PATH, 'utf-8'))
  const jobs = []
  for (const system of ['npm', 'pypi']) {
    for (const name of seed[system] ?? []) jobs.push({ system, name })
  }

  console.log(`同步 ${jobs.length} 个包（并发 ${CONCURRENCY}）…\n`)

  const results = await mapPool(jobs, CONCURRENCY, async ({ system, name }) => {
    try {
      const outcome = await fetchPackage(system, name)
      const record = outcome.ok ? outcome.record : null
      const mark = record
        ? `✓ ${record.latest}` +
          // 必须用 vulnerabilityCount（历史总数）；vulnerabilities.length 是截断后的
          (record.vulnerabilityCount
            ? ` · 历史漏洞 ${record.vulnerabilityCount}${record.latestAffected ? '（最新版受影响）' : '（最新版不受影响）'}`
            : '')
        : `✗ ${outcome.reason}`
      console.log(`  ${system.padEnd(5)} ${name.padEnd(28)} ${mark}`)
      return { system, name, ...outcome }
    } catch (error) {
      console.log(`  ${system.padEnd(5)} ${name.padEnd(28)} ✗ ${error.message}`)
      return { system, name, ok: false, reason: error.message }
    }
  })

  const packages = results.filter((r) => r.ok).map((r) => r.record)
  const failures = results.filter((r) => !r.ok)

  // 最新版受影响的排最前（最需要被看到），其余按历史漏洞数降序
  packages.sort(
    (a, b) =>
      a.system.localeCompare(b.system) ||
      Number(b.latestAffected) - Number(a.latestAffected) ||
      // 同样用历史总数排序，否则超过上限的包会全并列为 50
      b.vulnerabilityCount - a.vulnerabilityCount ||
      a.name.localeCompare(b.name),
  )

  // 整目录重建：清单里删掉的包不会留下孤儿文件
  await rm(PACKAGES_DIR, { recursive: true, force: true })
  for (const record of packages) {
    // slug 含斜杠（作用域包）时自然产生子目录
    const file = path.join(PACKAGES_DIR, record.system, `${record.slug}.json`)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, `${JSON.stringify(record, null, 2)}\n`, 'utf-8')
  }

  const payload = {
    fetchedAt: new Date().toISOString().slice(0, 10),
    counts: {
      npm: packages.filter((p) => p.system === 'npm').length,
      pypi: packages.filter((p) => p.system === 'pypi').length,
    },
    seedSize: jobs.length,
    packages: packages.map(toIndexEntry),
  }

  await mkdir(DEPS_DIR, { recursive: true })
  await writeFile(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8')

  console.log(`\n写入 ${path.relative(ROOT, OUT_PATH)}`)
  console.log(`收录 ${packages.length} / ${jobs.length} 个包（npm ${payload.counts.npm} · pypi ${payload.counts.pypi}）`)
  console.log(
    `有历史漏洞的包 ${packages.filter((p) => p.vulnerabilityCount > 0).length} 个 · ` +
      `其中最新版仍受影响 ${packages.filter((p) => p.latestAffected).length} 个 · ` +
      `漏洞条目合计 ${packages.reduce((n, p) => n + p.vulnerabilityCount, 0)} 条`,
  )

  if (failures.length > 0) {
    console.log(`\n⚠️  ${failures.length} 个包抓取失败，已按 spec §4.5 整体略去（不写半成品）：`)
    for (const f of failures) console.log(`   ${f.system}/${f.name} — ${f.reason}`)
  }

  if (packages.length === 0) {
    console.error('\n没有任何包抓取成功，拒绝覆盖数据文件')
    process.exitCode = 1
  }
}

await main()
