---
title: Authentication Is Not Adjudication
title_zh: 认证不等于裁判
description: Card networks shipped a way to verify your agent. OpenAI's checkout spec hands refunds back to the merchant. x402 treats "no chargebacks" as a selling point. Four rails, one unanswered question: when the agent buys the wrong thing, who decides?
description_zh: 卡组织解决了"怎么确认这个 Agent 是真的"，OpenAI 把退款退单推回商家，x402 干脆把"没有拒付"当卖点。四条轨道，一个没人回答的问题：Agent 买错了，谁说了算？
date: 2026-09-13
tags: [AI Agents, Agentic Commerce, Payments, Dispute Resolution]
tags_zh: [AI Agent, 智能体交易, 支付, 争议解决]
lang: both
draft: false
---

A card member asks their agent for a pair of green shoes. The agent buys red ones — non-refundable. Who eats the cost?

That example is not mine. It came from an American Express executive explaining, in April 2026, why Amex would credit the customer ([Digital Commerce 360](https://www.digitalcommerce360.com/2026/04/14/american-express-agentic-commerce-developer-kit-purchase-protection)). Read that again: the answer to "who pays when an agent gets it wrong" had to be invented by a card network, in a press release, as a marketing differentiator. Six months earlier, nobody had an answer at all.

The industry spent 2025 and 2026 building the rails for agents to transact. It built almost nothing for agents to argue.

## What each layer actually shipped

Four stacks now claim to make agentic commerce real. Look at what each one does *after* a transaction goes wrong:

**Identity and authentication.** Visa's Trusted Agent Protocol (October 2025) and Mastercard's Agent Pay both build on Cloudflare's Web Bot Auth proposal: agents sign their HTTP requests with a registered key, and merchants — through Cloudflare, or the payment network directly — verify that the caller is a registered agent acting for a known cardholder. Both add a tag that declares whether the agent is browsing or paying ([Cloudflare](https://blog.cloudflare.com/secure-agentic-commerce), [Visa's spec](https://github.com/visa/trusted-agent-protocol)).

This solves the merchant's real problem: telling a helpful shopping agent apart from a scraper. It does not solve the customer's problem. A signature proves the agent is *who it says it is*; a `tag="agent-payer-auth"` proves it *intends to pay*. Neither proves the purchase was the one you wanted. As one payments commentator put it, authentication is not authorization — and the liability model for "AI-buyer mistakes" is still undefined.

**Checkout.** OpenAI's Agentic Commerce Protocol ships a Delegated Payment Spec that is unusually blunt about where the buck stops. In OpenAI's own words: "OpenAI is not the merchant of record… Settlement, refunds, chargebacks, and compliance remain with the merchant and their PSP" ([OpenAI docs](https://developers.openai.com/commerce/specs/payment)). Stripe's Shared Payment Token is the first compatible implementation. The design is sound — merchants keep their processor, their fraud rules, their customer relationship. The side effect is that the dispute lands in a chargeback system designed for two humans and a receipt.

**Stablecoin rails.** x402, now a Linux Foundation project, activates the long-dormant HTTP 402 status code: a server quotes a price, the client pays, the resource unlocks ([x402 docs](https://docs.x402.org/core-concepts/http-402)). Its homepage advertises the 30-day numbers — 75.4 million transactions, $24.24 million in volume, 94,000 buyers, 22,000 sellers ([x402.org](https://x402.org), vendor-reported). It also lists, as a defect of the old way, "slow transactions, chargebacks, fees." That is the tell. On these rails, finality *is* the feature: a settlement in USDC is irreversible by design, and "no chargebacks" is sold as consumer benefit rather than risk.

x402 is not naive about evidence — the spec has extensions for Signed Offers and Receipts, so both sides can hold a verifiable record of what was promised. What it has no part for is a judge. There is no refund path, no escrow by default, no arbiter. If the deliverable is wrong, two agents hold the same signed receipt and disagree about what it means.

**Consent.** Google's Agent Payments Protocol adds cryptographic mandates — proof of what the user actually authorized. Useful, and it will settle a lot of "I never approved that" fights. But a mandate proves intent at the moment of authorization. It says nothing about whether the outcome matched it. You authorized a purchase; the agent bought the wrong model; the mandate is intact and you are still out the money.

Every layer shipped a way to answer "is this agent real and allowed?" Nobody shipped a way to answer "this outcome is wrong."

## Why the gap is structural, not an oversight

Three parties hold three pieces of every agentic transaction, and none of them holds all three:

- The **user** holds the mandate — what was authorized.
- The **merchant** holds the evidence — order logs, fulfillment records, the actual deliverable.
- The **network or custodian** holds the money.

Card dispute rules assume a human buyer and a human seller sharing one timeline: you were charged, you didn't get what you paid for, the issuer claws it back. Insert an agent and the chain has a new link nobody regulates: the agent's operator, which may be a model provider, a wallet app, a framework, or the user's own script. Liability surveys circulated by dispute-management firms split roughly evenly between the AI provider, the customer, the merchant and the processor — which is a polite way of saying the framework does not exist yet.

The volume math makes it urgent. Datos Insights, in Mastercard's 2025 *State of Chargebacks*, projects global chargeback volume rising from 261 million in 2025 to 324 million by 2028 — a 24% increase, and $41.7 billion in value ([Tearsheet](https://tearsheet.co/payments/with-chargeback-volume-set-to-hit-324-million-in-2028-merchants-and-issuers-need-to-find-a-way-to-protect-their-bottom-line), [ETHOCA](https://hs.ethoca.com/chargeback-trends-global-outlook)). That forecast predates agentic volume being a line item. The Consumer Bankers Association has warned that agent errors — wrong product, duplicate purchase, ambiguous instruction — could overwhelm dispute infrastructure that is already straining.

And the economics get worse the smaller the transaction. A chargeback costs more to process than a $0.02 API call is worth, which is exactly the size of transaction x402 was built for. If your dispute process costs $25, every transaction under $25 is effectively final whether you meant it to be or not.

## What an adjudication layer has to have

If you are building on any of these rails now, this is the part you can act on. Five requirements, in order of how much pain they save:

1. **Name the adjudicator before the transaction, not after.** "We'll figure it out" means the party with the money wins. Write the judge into the agreement — a platform, a protocol, a card network's protection program, or an explicit arbitration clause.
2. **Record the mandate with scope bounds.** Not "the agent may buy shoes" but amount ceiling, expiry, merchant allowlist, and the attributes that matter (color, size, returnability). Everything an adjudicator would need to rule should be captured at authorization time, because it cannot be reconstructed later.
3. **Make evidence machine-checkable.** Signed receipts, request/response logs with hashes, delivery attestations. The x402 receipts extension is the right instinct: the dispute layer is only as good as the evidence format underneath it.
4. **Keep dispute cost below transaction value.** For micropayments that means batching, escrow windows, or reputation bonds rather than per-transaction arbitration. An adjudication layer that only works for $500 purchases is not a layer.
5. **Keep a human appeal path.** The precedent is clear. eBay and PayPal have resolved most of their disputes algorithmically since the 1990s. China's internet courts — Hangzhou in 2017, with blockchain evidence preservation — put routine online disputes in front of automated systems, and Beijing's Internet Court has used an AI-assisted virtual judge since 2019. In every one of those systems, the automated tier is cheap and fast, and the human tier still exists ([overview of the research](https://www.tandfonline.com/doi/full/10.1080/13600834.2022.2088060)).

## Who is actually trying

**Card networks, partially.** Amex's Agent Purchase Protection (April 2026) is the first real transfer of liability: if a card member authorizes a registered agent, the agent transmits authenticated purchase intent, and the agent then errs, Amex credits the customer ([Amex newsroom](https://www.americanexpress.com/en-us/newsroom/articles/innovation/american-express-debuts-agentic-commerce-experiences--ace--devel.html)). Note what makes that possible: registration, authenticated intent, and a closed-loop network that already runs disputes. That is the adjudication recipe, implemented by the one player big enough to absorb the cost.

**A consortium, tentatively.** Internet Court is an open Agent Skill whose stated purpose is to be the trust layer for agent-to-agent commerce: natural-language mandates, delegated permissions (ERC-7710), x402 payments, escrow, and — the part nobody else claims — dispute resolution, with the judge named up front in the contract ([repo](https://github.com/internet-court/internet-court-skill), [site](https://internetcourt.org)). Its thesis sentence is the best summary of the problem I have read: *payments let agents transact, adjudication makes them accountable.*

I want to be precise about its maturity, because the framing outruns the artifact. The repository has four commits; the last one is dated August 19, 2026. The 30-company "founding member" list spans MetaMask, OKX, NEAR, Starknet, x402 and others, and the privacy policy names GenLayer Foundation as the operator — so this is a standards-marketing push led by one protocol vendor, currently carried by its members' distribution rather than by shipping code. The adjudication options it points at (GenLayer, Kleros, UMA) are real protocols with their own governance questions.

Which is the harder problem hiding behind the easy one: **who judges the judge?** Crowd-voted arbitration, token-holder voting, and validator-model consensus each have capture and failure modes that make human chargebacks look well-tested. Moving disputes to an oracle does not remove judgment; it relocates it somewhere with less accountability and, so far, fewer appeals.

## What I take from this

The rails are real and they work. Agents can be authenticated, mandated, and paid; x402 volume is no longer a rounding error. But the industry has spent two years answering "can agents transact?" and roughly two press releases answering "what happens when they transact wrong?"

If I were building on this stack, I would assume disputes are my problem, not the protocol's, and design backwards from there: bounded mandates, signed evidence at every step, an explicit named judge, and a documented threshold below which a transaction is simply written off as the cost of doing business at machine speed.

The liability framework will be written in the next 18 months, probably by card networks and regulators rather than by protocol designers, and probably by defaulting to whoever is holding the money. If you are on the merchant side, that is likely you.

---

**Sources and verification notes.** Primary sources are linked inline. Two caveats worth stating: the x402 transaction counts are self-reported by the project, and the liability-attribution split comes from dispute-management vendor surveys rather than a regulator's finding. The Internet Court commit count and last-push date were checked on the GitHub repository on September 13, 2026.
