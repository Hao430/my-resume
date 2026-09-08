---
title: "Agentic Commerce 拐点：Anthropic 开源蓝图，OpenAI 结账之死"
title_en: "The Agentic Commerce Tipping Point: Anthropic Merchants vs OpenAI's Failed Checkout"
description: "9 月 2 日，Anthropic 开源了 Claude Commerce Agents——一个 Apache 2.0 蓝图：面向客户的购物 agent 能搜索、比较、建购物车并交还给商家自己的结账；另有面向商户侧的上架、定价与营销 agent。Shopify 当天就发布了可运行实现。对比 OpenAI 已下线的对话内结账（转化率暴跌后于三月退役），战略分岔清晰：谁掌控入口 vs 谁掌控商户。谁拥有通往店铺的 agent 友好接口，谁就拥有下一代零售分发。"
description_en: "On September 2, Anthropic open-sourced Claude Commerce Agents — an Apache 2.0 blueprint with a storefront shopping agent that searches, compares, builds carts, and hands off to the merchant's own checkout, plus a merchant-side agent for listings, pricing, and campaigns. Shopify shipped a working implementation the same day. The contrast with OpenAI's retired in-chat checkout (killed in March after conversions sank) shows the strategic fork: gateway vs merchant control. Whoever owns the agent-friendly interface to a store owns the next retail distribution."
date: 2026-09-08
updated: 2026-09-08
tags: [AI, 电商, 智能体, 交易, Anthropic, Shopify]
tags_en: [AI, Commerce, Agents, E-commerce, Anthropic, Shopify]
lang: both
---

2026 年 9 月 2 日，Anthropic 开源了 **Claude Commerce Agents**——一个 Apache 2.0 参考蓝图，把 AI agent 放进商业场景（[Linas's Newsletter](https://linas.substack.com/p/claude-commerce-agents)）。它自带两个可工作的 agent：面向客户的购物 agent，能搜索目录、比较选项、建真实购物车并交还给店铺自己的结账；面向员工侧的商户 agent，分析销售并为人工审批起草上架、定价与营销文案。参考实现覆盖零售、旅行、电信与票务，并带一个 Claude Code 插件把模式适配到自己公司的系统。

Shopify 当天就发布了生产实现——基于 UCP（Universal Commerce Protocol）和 Sign in with Shop 的店铺 agent，连接真实目录与购物车（[Shopify community](https://community.shopify.com/t/shopify-just-released-an-ai-shopping-agent-that-shops-your-store-through-ucp-has-anyone-tested-whether-it-can-actually-check-out-on-theirs/675870)、[coursiv.io](https://coursiv.io/blog/claude-commerce-agents)）。

这是电商真正跨入 agentic commerce 的时刻。为什么这个分岔比任何单一发布都重要：

## 战略分岔：入口 vs 商户控制

2026 年，行业其余玩家一直在争夺*消费入口*——AI 购物者与目录相遇的地方：

- OpenAI 用 Stripe 试过对话内结账（Agentic Commerce Protocol），**三月份转化率暴跌后退役**。它的协议现在是交接标准，不是商店。
- Google 通过 Universal Commerce Protocol 在 AI Mode 和 Gemini 里跑实时 agentic 结账。
- Microsoft 的 Copilot Checkout 已有 50 万+ 参与商户。
- Perplexity 通过 Instant Buy + PayPal 卖对话内购物；Amazon 的 Buy for Me 和 Shop Direct 覆盖 1 亿+ 商品。

每一个都在中间商化。它们站在购物者的 agent 与商店之间。

Anthropic 的动作是相反的押注：**把 agent 放进商户内部。** 面向客户的 agent 活在商户自己的店铺里，在那里建购物车，把买家交还给商户的结账。支付仍是商户的选择。面向商户侧的 agent——起草上架与定价的那个——给了小型零售商过去只属于有数据团队的平台才有的杠杆。这是对 AI 购物网关的商户控制反制位（[Linas's Newsletter](https://linas.substack.com/p/claude-commerce-agents)）。

## 为什么是蓝图，而不是产品

两个细节让这件事不只是 Anthropic 的功能发布：

1. **它是开源的（Apache 2.0）。** Anthropic 不是在建结账市场。它在标准化 agent *如何*与商店对话，让 Shopify、Stripe 和商户自己拥有轨道。这是让 MCP 成为 agent 工具集成事实标准的同一套打法：定义协议，让生态去创造价值。
2. **目录质量是新的护城河。** 有趣的约束立刻浮出水面：无论是 Agentic Commerce Protocol 还是 UCP，都没有定义商品记录必须包含什么，agent 才能回答关于它的真实问题（[commerceclarity.com](https://commerceclarity.com/blog/claude-commerce-agents-catalog-constraint)）。目录单薄、非结构化的店铺对购物 agent 不可见。目录结构化、完整、机器可读的店铺会被发现、被比较、被购买。分发优势正从广告支出转向*目录纪律*。

## 对创业者和企业意味着什么

三条实操含义，按紧迫性排序：

1. **如果你卖任何东西，现在就让你目录可被 agent 读取。** 结构化数据、完整商品字段、机器可读政策。这是商业的 AEO（答案引擎优化）时刻——与搜索在 2024-25 经历的同一次迁移，现在抵达购物。先准备的商户，才是 agent 真正能买得到的那批。
2. **如果你为商业构建，商户侧是楔子。** 开源蓝图 + 零摩擦交接意味着面向客户的 agent 很快被商品化。持久价值在商户侧：上架、定价、营销管理、目录卫生——让店铺被 agent *可发现*的东西。
3. **观察入口玩家的回应。** OpenAI 失败的对话内结账是撤退，不是战略；Google 和 Microsoft 深陷入口地带。如果 agentic commerce 重演搜索的历史，开放协议支持的商户打法长期会赢得分发——但入口玩家仍握着流量。

拐点不是购物者开始用 AI agent 的那天，而是商户能按自己的条件部署自己的 agent 的那天。那天是 2026 年 9 月 2 日。
