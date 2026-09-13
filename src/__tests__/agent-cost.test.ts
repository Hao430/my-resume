import { describe, expect, it } from 'vitest'
import {
  MODEL_PRICING,
  PRICING_AS_OF,
  computeCost,
  findModel,
  summarize,
  turnInputTokens,
  type UsageShape,
} from '../utils/agent-cost'

/** Claude Opus 5：$5 / $25 每 1M，最低可缓存 512 */
const OPUS = findModel('claude-opus-5')
if (!OPUS) throw new Error('价格表缺少 claude-opus-5')

const USAGE: UsageShape = {
  turns: 3,
  prefixTokens: 2000,
  inputPerTurn: 500,
  outputPerTurn: 500,
}

describe('价格表', () => {
  it('每条都带 asOf，供页面标注（价格过期的算钱工具比没有更糟）', () => {
    expect(PRICING_AS_OF).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    for (const model of MODEL_PRICING) {
      expect(model.inputPerMTok, model.id).toBeGreaterThan(0)
      expect(model.outputPerMTok, model.id).toBeGreaterThan(0)
      expect(model.minCacheablePrefix, model.id).toBeGreaterThan(0)
    }
  })

  it('最低可缓存长度因模型而异且非单调（3K 前缀在 Opus 5 能缓存、在 Haiku 4.5 不能）', () => {
    const opus = findModel('claude-opus-5')
    const haiku = findModel('claude-haiku-4-5')
    expect(opus?.minCacheablePrefix).toBe(512)
    expect(haiku?.minCacheablePrefix).toBe(4096)
  })

  it('Fable 5.1 的缓存读取倍率是 0.025 而非通用的 0.1', () => {
    expect(findModel('claude-fable-5-1')?.cacheReadMultiplier).toBe(0.025)
    expect(findModel('claude-opus-5')?.cacheReadMultiplier).toBe(0.1)
  })

  it('写入倍率：5 分钟 TTL 为 1.25，1 小时 TTL 为 2', () => {
    for (const model of MODEL_PRICING) {
      expect(model.cacheWriteMultiplier, model.id).toBe(1.25)
      expect(model.cacheWriteMultiplier1h, model.id).toBe(2)
    }
  })
})

describe('turnInputTokens（不缓存：历史每轮重发）', () => {
  it('第 i 轮输入含 (i-1)(U+O) 的历史重发项', () => {
    expect(turnInputTokens(USAGE, 1)).toBe(2500) // 2000 + 0×1000 + 500
    expect(turnInputTokens(USAGE, 2)).toBe(3500) // 2000 + 1×1000 + 500
    expect(turnInputTokens(USAGE, 3)).toBe(4500) // 2000 + 2×1000 + 500
  })

  it('这是成本非线性增长的来源：末轮输入是首轮的 1.8 倍', () => {
    const first = turnInputTokens(USAGE, 1)
    const last = turnInputTokens(USAGE, USAGE.turns)
    expect(last / first).toBeCloseTo(1.8, 5)
  })
})

describe('computeCost —— 不缓存', () => {
  const result = computeCost(OPUS, USAGE, 'off')

  it('缓存未启用时不报告任何失效原因', () => {
    expect(result.cacheEffective).toBe(false)
    expect(result.cacheInactiveReasons).toEqual([])
  })

  it('总价为各轮之和', () => {
    // (2500+3500+4500)×5e-6 + 3×500×25e-6 = 0.0525 + 0.0375
    expect(result.totalCost).toBeCloseTo(0.09, 8)
  })

  it('逐轮成本递增', () => {
    const costs = result.turns.map((t) => t.cost)
    expect(costs[1]).toBeGreaterThan(costs[0] ?? 0)
    expect(costs[2]).toBeGreaterThan(costs[1] ?? 0)
  })
})

describe('computeCost —— 缓存（断点随对话前移）', () => {
  const result = computeCost(OPUS, USAGE, 'ttl5m')

  it('第 1 轮只有写入、没有读取（此时还没有缓存可读）', () => {
    const first = result.turns[0]
    expect(first?.readTokens).toBe(0)
    expect(first?.writeTokens).toBe(2500) // P + U
  })

  it('第 2 轮起才有读取，且读取量随对话增长', () => {
    // read_i = P + (i-2)(U+O) + U
    expect(result.turns[1]?.readTokens).toBe(2500)
    expect(result.turns[2]?.readTokens).toBe(3500)
  })

  it('每轮新增部分按写入计（U + O）', () => {
    expect(result.turns[1]?.writeTokens).toBe(1000)
    expect(result.turns[2]?.writeTokens).toBe(1000)
  })

  it('缓存生效时总价低于不缓存', () => {
    const uncached = computeCost(OPUS, USAGE, 'off')
    expect(result.totalCost).toBeLessThan(uncached.totalCost)
    expect(result.totalCost).toBeCloseTo(0.068625, 8)
  })

  it('开启缓存时 cacheEffective 为真', () => {
    expect(result.cacheEffective).toBe(true)
    expect(result.cacheInactiveReasons).toEqual([])
  })
})

describe('缓存的两个静默失效条件（本工具区别于简单计算器的关键）', () => {
  it('前缀低于该模型最低可缓存长度时，缓存静默不生效', () => {
    const short = { ...USAGE, prefixTokens: 3000 }
    // Opus 5 最低 512，3K 够；Haiku 4.5 最低 4096，3K 不够
    expect(computeCost(OPUS, short, 'ttl5m').cacheEffective).toBe(true)

    const haiku = findModel('claude-haiku-4-5')
    if (!haiku) throw new Error('价格表缺少 claude-haiku-4-5')
    const result = computeCost(haiku, short, 'ttl5m')
    expect(result.cacheEffective).toBe(false)
    expect(result.cacheInactiveReasons).toContain('prefix-too-short')
  })

  it('前缀过短时不得给出任何缓存收益（否则等于骗用户）', () => {
    const haiku = findModel('claude-haiku-4-5')
    if (!haiku) throw new Error('价格表缺少 claude-haiku-4-5')
    const short = { ...USAGE, prefixTokens: 3000 }
    const cached = computeCost(haiku, short, 'ttl5m')
    const uncached = computeCost(haiku, short, 'off')
    expect(cached.totalCost).toBeCloseTo(uncached.totalCost, 10)
  })

  it('每轮耗时超过 TTL 时缓存会过期，给出提示', () => {
    // TTL 从请求开始计时、生成时间也计入：一轮 400 秒 > 300 秒（5 分钟）
    const slow = computeCost(OPUS, USAGE, 'ttl5m', { secondsPerTurn: 400 })
    expect(slow.cacheEffective).toBe(false)
    expect(slow.cacheInactiveReasons).toContain('ttl-expired')

    // 换成 1 小时 TTL 就够得着
    expect(computeCost(OPUS, USAGE, 'ttl1h', { secondsPerTurn: 400 }).cacheEffective).toBe(true)
  })

  it('两个条件同时不满足时都要报出来', () => {
    const haiku = findModel('claude-haiku-4-5')
    if (!haiku) throw new Error('价格表缺少 claude-haiku-4-5')
    const result = computeCost(haiku, { ...USAGE, prefixTokens: 1000 }, 'ttl5m', {
      secondsPerTurn: 400,
    })
    expect(result.cacheInactiveReasons).toEqual(
      expect.arrayContaining(['prefix-too-short', 'ttl-expired']),
    )
  })
})

describe('token 明细（按 API 的 usage 口径，spec §4.6）', () => {
  it('缓存生效时：命中 + 写入，未命中且未缓存为 0', () => {
    const s = summarize(computeCost(OPUS, USAGE, 'ttl5m'), OPUS)
    // read: 0 + 2500 + 3500 = 6000 ; write: 2500 + 1000 + 1000 = 4500
    expect(s.cacheReadTokens).toBe(6000)
    expect(s.cacheWriteTokens).toBe(4500)
    expect(s.uncachedInputTokens).toBe(0)
    expect(s.outputTokens).toBe(1500)
  })

  it('缓存未生效时：全部输入落进「未命中且未缓存」，这是「以为省了其实没省」的数字形状', () => {
    const s = summarize(computeCost(OPUS, USAGE, 'off'), OPUS)
    expect(s.cacheReadTokens).toBe(0)
    expect(s.cacheWriteTokens).toBe(0)
    expect(s.uncachedInputTokens).toBe(2500 + 3500 + 4500)
    expect(s.outputTokens).toBe(1500)
  })

  it('四类小计之和等于总价（否则明细只是装饰）', () => {
    for (const mode of ['off', 'ttl5m', 'ttl1h'] as const) {
      const breakdown = computeCost(OPUS, USAGE, mode)
      const s = summarize(breakdown, OPUS)
      const summed = s.costs.cacheRead + s.costs.cacheWrite + s.costs.uncachedInput + s.costs.output
      expect(summed, mode).toBeCloseTo(breakdown.totalCost, 10)
      expect(s.totalCost, mode).toBeCloseTo(breakdown.totalCost, 10)
    }
  })

  it('各类单价与倍率一致：读取 0.1×、写入 1.25×、未命中全额、输出全额', () => {
    const s = summarize(computeCost(OPUS, USAGE, 'ttl5m'), OPUS)
    expect(s.rates.cacheRead).toBeCloseTo(5e-6 * 0.1, 12)
    expect(s.rates.cacheWrite).toBeCloseTo(5e-6 * 1.25, 12)
    expect(s.rates.uncachedInput).toBeCloseTo(5e-6, 12)
    expect(s.rates.output).toBeCloseTo(25e-6, 12)
  })

  it('1 小时 TTL 的写入单价翻倍（2× 而非 1.25×）', () => {
    const five = summarize(computeCost(OPUS, USAGE, 'ttl5m'), OPUS)
    const hour = summarize(computeCost(OPUS, USAGE, 'ttl1h'), OPUS)
    expect(hour.rates.cacheWrite / five.rates.cacheWrite).toBeCloseTo(2 / 1.25, 10)
    expect(hour.totalCost).toBeGreaterThan(five.totalCost)
  })

  it('Fable 5.1 的读取单价是输入价的 0.025 而非 0.1', () => {
    const fable = findModel('claude-fable-5-1')
    if (!fable) throw new Error('价格表缺少 claude-fable-5-1')
    const s = summarize(computeCost(fable, USAGE, 'ttl5m'), fable)
    expect(s.rates.cacheRead).toBeCloseTo(fable.inputPerMTok * 0.025 / 1_000_000, 12)
  })
})

describe('价格表的模型覆盖（spec §4.7）', () => {
  it('覆盖多代模型，含最低可缓存长度各不相同的几代', () => {
    expect(MODEL_PRICING.length).toBeGreaterThanOrEqual(9)
    const minimums = new Set(MODEL_PRICING.map((m) => m.minCacheablePrefix))
    // 512 / 1024 / 2048 / 4096 都应有代表，跨代对比才是本工具的价值点
    for (const wanted of [512, 1024, 2048, 4096]) {
      expect(minimums.has(wanted), `缺少最低可缓存长度为 ${wanted} 的模型`).toBe(true)
    }
  })

  it('模型 id 唯一，且都能被 findModel 找到', () => {
    const ids = MODEL_PRICING.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(findModel(id)?.id).toBe(id)
  })
})

describe('回本点', () => {
  const single = (mode: 'off' | 'ttl5m' | 'ttl1h', turns: number) =>
    computeCost(OPUS, { ...USAGE, turns, inputPerTurn: 0, outputPerTurn: 0 }, mode).totalCost

  it('5 分钟 TTL 两轮回本（官方给的算法：1.25 + 0.1 = 1.35 vs 未缓存的 2）', () => {
    expect(single('ttl5m', 2)).toBeLessThan(single('off', 2))
    expect(single('ttl5m', 1)).toBeGreaterThan(single('off', 1)) // 单轮必然亏（付了写入溢价）
  })

  it('1 小时 TTL 需要三轮才回本（2 + 0.2 = 2.2 vs 3）', () => {
    expect(single('ttl1h', 2)).toBeGreaterThan(single('off', 2))
    expect(single('ttl1h', 3)).toBeLessThan(single('off', 3))
  })
})
