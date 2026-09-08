---
title: "The Agentic Commerce Tipping Point: Anthropic Merchants vs OpenAI's Failed Checkout"
title_zh: "Agentic Commerce 拐点：Anthropic 开源蓝图，OpenAI 结账之死"
description: "On September 2, Anthropic open-sourced Claude Commerce Agents — an Apache 2.0 blueprint with a storefront shopping agent that searches, compares, builds carts, and hands off to the merchant's own checkout, plus a merchant-side agent for listings, pricing, and campaigns. Shopify shipped a working implementation the same day. The contrast with OpenAI's retired in-chat checkout (killed in March after conversions sank) shows the strategic fork: gateway vs merchant control. Whoever owns the agent-friendly interface to a store owns the next retail distribution."
description_zh: "9 月 2 日，Anthropic 开源了 Claude Commerce Agents——一个 Apache 2.0 蓝图：面向客户的购物 agent 能搜索、比较、建购物车并交还给商家自己的结账；另有面向商户侧的上架、定价与营销 agent。Shopify 当天就发布了可运行实现。对比 OpenAI 已下线的对话内结账（转化率暴跌后于三月退役），战略分岔清晰：谁掌控入口 vs 谁掌控商户。谁拥有通往店铺的 agent 友好接口，谁就拥有下一代零售分发。"
date: 2026-09-08
updated: 2026-09-08
tags: [AI, Commerce, Agents, E-commerce, Anthropic, Shopify]
tags_zh: [AI, 电商, 智能体, 交易, Anthropic, Shopify]
lang: both
draft: false
---

On September 2, 2026, Anthropic open-sourced **Claude Commerce Agents** — an Apache 2.0 reference blueprint for putting AI agents inside commerce ([Linas's Newsletter](https://linas.substack.com/p/claude-commerce-agents)). It ships with two working agents: a customer-facing shopping agent that searches catalogs, compares options, builds a real cart, and hands off to the store's own checkout; and a staff-facing merchant agent that analyzes sales and drafts listings, prices, and campaign copy for human approval. Reference implementations cover retail, travel, telecom, and ticketing, with a Claude Code plugin to adapt the pattern to a company's own systems.

Shopify shipped a production implementation the same day — a storefront agent over UCP (Universal Commerce Protocol) and Sign in with Shop, connecting to a live catalog and cart ([Shopify community](https://community.shopify.com/t/shopify-just-released-an-ai-shopping-agent-that-shops-your-store-through-ucp-has-anyone-tested-whether-it-can-actually-check-out-on-theirs/675870), [coursiv.io](https://coursiv.io/blog/claude-commerce-agents)).

This is the moment e-commerce crossed into agentic commerce for real. Here is why the fork in the road matters more than any one release.

## The strategic fork: gateway vs merchant control

The rest of the industry has spent 2026 fighting over the *consumer gateway* — the place where an AI shopper meets a catalog:

- OpenAI tried in-chat checkout with Stripe (the Agentic Commerce Protocol), and **retired it in March** after conversions sank. Its protocol is now a hand-off standard, not a shop.
- Google runs live agentic checkout in AI Mode and Gemini through the Universal Commerce Protocol.
- Microsoft's Copilot Checkout counts 500,000+ participating merchants.
- Perplexity sells in-chat through Instant Buy with PayPal; Amazon's Buy for Me and Shop Direct surface 100M+ products.

Every one of these intermediate merchants. They stand between the shopper's agent and the store.

Anthropic's move is the opposite bet: **put the agent inside the merchant.** The customer-facing agent lives on the merchant's own storefront, builds a cart there, and hands the buyer to the merchant's checkout. Payments remain the merchant's choice. The merchant-side agent — the one that drafts listings and pricing — gives small retailers the leverage that used to belong only to platforms with data teams. It is a merchant-control counter-position to AI shopping gateways ([Linas's Newsletter](https://linas.substack.com/p/claude-commerce-agents)).

## Why the blueprint, not the product

Two details make this more than an Anthropic features announcement:

1. **It is open source (Apache 2.0).** Anthropic is not building the checkout marketplace. It is standardizing *how* an agent talks to a store, and letting Shopify, Stripe, and merchants own the rails. That is the same playbook that made MCP the de facto standard for agent-tool integration: define the protocol, let the ecosystem build the value.
2. **Catalog quality is the new moat.** The interesting constraint surfaced immediately: neither the Agentic Commerce Protocol nor UCP defines what a product record must contain for an agent to answer a real question about it ([commerceclarity.com](https://commerceclarity.com/blog/claude-commerce-agents-catalog-constraint)). Stores with thin, unstructured catalogs will be invisible to shopping agents. Stores whose catalogs are structured, complete, and machine-readable get discovered, compared, and bought from. The distribution advantage is shifting from ad spend to *catalog discipline*.

## What this means for builders and businesses

Three practical implications, in order of urgency:

1. **If you sell anything, make your catalog agent-readable now.** Structured data, complete product fields, machine-readable policies. This is the AEO (Answer Engine Optimization) moment for commerce — the same shift search saw in 2024-25, now arriving in shopping. The merchants who prepare first will be the ones agents can actually buy from.
2. **If you build for commerce, the merchant side is the wedge.** Open-source blueprints + zero-friction hand-off mean the customer-facing agent is quickly commoditized. The durable value is merchant-side: listings, pricing, campaign management, catalog hygiene — the stuff that makes a store *discoverable* by agents.
3. **Watch the gateway players' response.** OpenAI's failed in-chat checkout was a retreat, not a strategy; Google and Microsoft are deep in gateway land. If agentic commerce follows search's history, the open protoal-backed merchant play wins distribution in the long run — but the gateway players still hold the traffic.

The tipping point is not the day shoppers start using AI agents. It is the day merchants can deploy their own, on their own terms. That day was September 2, 2026.
