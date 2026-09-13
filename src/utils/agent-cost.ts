/**
 * Agent 循环成本模型（纯函数，零依赖、零网络）
 * ------------------------------------------------------------
 * spec: docs/specs/agent-cost-calculator.md
 *
 * 回答的是简单计算器回答不了的问题：一个多轮 agent 循环花多少钱、开缓存省多少、
 * 几轮回本、以及两个会**静默**让缓存失效的条件。
 *
 * 输入是 token 数而非文本：纯前端算不出精确的 Claude token 数（官方口径是用
 * count_tokens API、不要用 tiktoken），而那个 API 需要联网与密钥。由用户提供
 * token 数可以完全绕开分词器问题。
 *
 * ⚠️ 本模块的数字直接决定用户的钱包决策，改公式前先读 spec §4。
 */

export interface ModelPricing {
  id: string
  label: string
  /** 每 1M token 的输入价（美元） */
  inputPerMTok: number
  outputPerMTok: number
  /** 上下文窗口 */
  contextWindow: number
  /**
   * 最低可缓存长度。**因模型而异且非单调**：低于它缓存会静默不生效，
   * 你白付写入溢价却拿不到任何读取——两个模型可能相差 8 倍。
   */
  minCacheablePrefix: number
  /** 缓存读取倍率（相对输入价）。多数模型 0.1，Claude Fable 5.1 为 0.025 */
  cacheReadMultiplier: number
  /** 缓存写入倍率（5 分钟 TTL） */
  cacheWriteMultiplier: number
  /** 缓存写入倍率（1 小时 TTL）——更长存活，但更贵 */
  cacheWriteMultiplier1h: number
}

/** 价格表快照日期。模型与价格会变，页面必须展示此日期 */
export const PRICING_AS_OF = '2026-09-13'

/** 价格表是手写的、随仓库提交的。见 spec §6 的维护策略 */
export const MODEL_PRICING: ModelPricing[] = [
  {
    id: 'claude-opus-5',
    label: 'Claude Opus 5',
    inputPerMTok: 5,
    outputPerMTok: 25,
    contextWindow: 1_000_000,
    minCacheablePrefix: 512,
    cacheReadMultiplier: 0.1,
    cacheWriteMultiplier: 1.25,
    cacheWriteMultiplier1h: 2,
  },
  {
    id: 'claude-sonnet-5',
    label: 'Claude Sonnet 5',
    inputPerMTok: 2,
    outputPerMTok: 10,
    contextWindow: 1_000_000,
    minCacheablePrefix: 1024,
    cacheReadMultiplier: 0.1,
    cacheWriteMultiplier: 1.25,
    cacheWriteMultiplier1h: 2,
  },
  {
    id: 'claude-haiku-4-5',
    label: 'Claude Haiku 4.5',
    inputPerMTok: 1,
    outputPerMTok: 5,
    contextWindow: 200_000,
    minCacheablePrefix: 4096,
    cacheReadMultiplier: 0.1,
    cacheWriteMultiplier: 1.25,
    cacheWriteMultiplier1h: 2,
  },
  {
    id: 'claude-fable-5-1',
    label: 'Claude Fable 5.1',
    inputPerMTok: 10,
    outputPerMTok: 50,
    contextWindow: 1_000_000,
    minCacheablePrefix: 512,
    // 读取倍率显著低于其它模型，回本点也随之提前
    cacheReadMultiplier: 0.025,
    cacheWriteMultiplier: 1.25,
    cacheWriteMultiplier1h: 2,
  },
  {
    id: 'claude-opus-4-8',
    label: 'Claude Opus 4.8',
    inputPerMTok: 5,
    outputPerMTok: 25,
    contextWindow: 1_000_000,
    minCacheablePrefix: 1024,
    cacheReadMultiplier: 0.1,
    cacheWriteMultiplier: 1.25,
    cacheWriteMultiplier1h: 2,
  },
  {
    id: 'claude-sonnet-4-6',
    label: 'Claude Sonnet 4.6',
    inputPerMTok: 3,
    outputPerMTok: 15,
    contextWindow: 1_000_000,
    minCacheablePrefix: 1024,
    cacheReadMultiplier: 0.1,
    cacheWriteMultiplier: 1.25,
    cacheWriteMultiplier1h: 2,
  },
]

export function findModel(id: string): ModelPricing | undefined {
  return MODEL_PRICING.find((model) => model.id === id)
}

export interface UsageShape {
  /** 轮数 */
  turns: number
  /** 稳定前缀：system prompt + 工具定义（每轮重发，内容不变） */
  prefixTokens: number
  /** 每轮新增输入（用户消息 / 工具结果） */
  inputPerTurn: number
  /** 每轮输出 */
  outputPerTurn: number
}

export type CacheMode = 'off' | 'ttl5m' | 'ttl1h'

/** 让缓存**静默**失效的两个条件；两者都不是报错，只是账单悄悄变高 */
export type CacheInactiveReason = 'prefix-too-short' | 'ttl-expired'

export interface TurnCost {
  turn: number
  /** 命中缓存读取的部分 */
  readTokens: number
  /** 本轮写入缓存的部分 */
  writeTokens: number
  /** 未走缓存、按全价计的部分（仅在缓存未生效时） */
  freshTokens: number
  outputTokens: number
  cost: number
}

export interface CostBreakdown {
  cacheMode: CacheMode
  /** 缓存是否**真正**生效。为 false 时不得展示任何缓存收益 */
  cacheEffective: boolean
  cacheInactiveReasons: CacheInactiveReason[]
  totalCost: number
  turns: TurnCost[]
}

const TTL_SECONDS: Record<'ttl5m' | 'ttl1h', number> = { ttl5m: 300, ttl1h: 3600 }

/**
 * 不缓存时第 `turn` 轮的全部输入。
 * 关键在 `(turn-1)(U+O)` 这一项——历史每轮重发一次，
 * 这是成本随轮数非线性增长的来源。
 */
export function turnInputTokens(usage: UsageShape, turn: number): number {
  return (
    usage.prefixTokens +
    (turn - 1) * (usage.inputPerTurn + usage.outputPerTurn) +
    usage.inputPerTurn
  )
}

/**
 * 计算整个循环的成本。
 *
 * 缓存生效时（断点随对话前移）：
 *   第 1 轮 write = P + U            （建立缓存，无读）
 *   第 i≥2 轮 read = P + (i-2)(U+O) + U ; write = U + O
 *
 * `secondsPerTurn` 传入时会检查 TTL：缓存存活期从**请求开始**计时，生成时间也计入，
 * 所以一轮跑得比 TTL 还久，下一轮必然未命中。
 */
export function computeCost(
  pricing: ModelPricing,
  usage: UsageShape,
  cacheMode: CacheMode,
  options: { secondsPerTurn?: number } = {},
): CostBreakdown {
  const inRate = pricing.inputPerMTok / 1_000_000
  const outRate = pricing.outputPerMTok / 1_000_000

  const reasons: CacheInactiveReason[] = []
  if (cacheMode !== 'off') {
    if (usage.prefixTokens < pricing.minCacheablePrefix) reasons.push('prefix-too-short')
    const seconds = options.secondsPerTurn
    if (seconds !== undefined && seconds > TTL_SECONDS[cacheMode]) reasons.push('ttl-expired')
  }
  const effective = cacheMode !== 'off' && reasons.length === 0

  const writeMultiplier =
    cacheMode === 'ttl1h' ? pricing.cacheWriteMultiplier1h : pricing.cacheWriteMultiplier

  const turns: TurnCost[] = []
  let totalCost = 0

  for (let turn = 1; turn <= usage.turns; turn += 1) {
    const outputCost = usage.outputPerTurn * outRate
    let read = 0
    let write = 0
    let fresh = 0

    if (effective) {
      if (turn === 1) {
        write = usage.prefixTokens + usage.inputPerTurn
      } else {
        read =
          usage.prefixTokens +
          (turn - 2) * (usage.inputPerTurn + usage.outputPerTurn) +
          usage.inputPerTurn
        write = usage.inputPerTurn + usage.outputPerTurn
      }
    } else {
      fresh = turnInputTokens(usage, turn)
    }

    const cost =
      read * pricing.cacheReadMultiplier * inRate + write * writeMultiplier * inRate + fresh * inRate + outputCost

    turns.push({
      turn,
      readTokens: read,
      writeTokens: write,
      freshTokens: fresh,
      outputTokens: usage.outputPerTurn,
      cost,
    })
    totalCost += cost
  }

  return { cacheMode, cacheEffective: effective, cacheInactiveReasons: reasons, totalCost, turns }
}
