---
title: China Put a Deadline on Software's AI Rewrite
title_zh: 工信部给中国软件业定了时间表：2 万家、100 个标杆、5 个开源项目，意味着什么
description: China's industry ministry published an "AI plus software" action plan with four countable targets for 2028. The interesting part is not the numbers — it is that the plan rewrites how software companies build software, not what they sell. Five clauses that most summaries skipped, plus the actual channel where the money starts.
description_zh: 工信部 9 月 2 日印发《“人工智能+软件”专项行动实施方案》（工信部信发〔2026〕209 号），9 月 11 日对外发布。真正值得读的不是数字，而是它的着力点：改造软件公司自己的生产方式。本文给出被多数解读漏掉的五条线索，以及“第一笔钱从哪个口子出”的可核查入口。
date: 2026-09-14
updated: 2026-09-15
tags: [China Policy, AI Coding, AI Agents, Software Engineering]
tags_zh: [中国政策, 智能编程, 智能体, 软件工程]
lang: both
draft: false
---

On September 2, 2026, China's Ministry of Industry and Information Technology (MIIT) issued an action plan for "AI + software" (工信部信发〔2026〕209号); September 11 was the day it reached the public through MIIT's official feed and press coverage. It is the software-industry sibling of the eight-ministry "AI + manufacturing" plan from January ([full text via Beijing News](https://www.bjnews.com.cn/detail/1789085225129692.html), [China Science and Technology Network](https://www.stdaily.com/web/gdxw/2026-09/11/content_579258.html)).

The press picked up four numbers, all of which do appear in the same paragraph:

> By 2028… promotion and application to cover **20,000 above-scale software enterprises**… accumulatively organize **100** intelligent technical-transformation projects for software enterprises… build **100** benchmark agent-software applications in key industries… **incubate more than 5** high-quality open-source projects. By 2030… **key software fully achieves intelligent upgrade**.

The numbers are memorable. They are not the most informative part. I read all nineteen measures in the plan; here are the five things worth your attention, and the question everyone is actually asking — **where does the first money come from**.

## 1. The plan rewrites production, not products

Read the title slowly. What this plan targets is **how software companies do their own work**, not whether they build AI products.

Section 2 is titled "Advance the transformation of software production, accelerate toward 'intelligence-driven'", and all three of its clauses sit on the production side: optimizing the intelligent-coding toolchain, accelerating technical transformation inside software firms, and using intelligent coding to improve software security. Products come later (Section 3: system software, industrial software — CAD, CAE, EDA, terminal software), then new agent-software formats (Section 4), then service models (Section 5).

The ordering carries meaning. For the 20,000 above-scale software firms that make up the bulk of China's software revenue, **replacing a cost line with AI is the kind of investment with a calculable ROI**; asking them to invent AI products is an added revenue line, and a far lower-probability bet. The plan chose the former, which tells you the authors know the industry's actual constraint.

## 2. For the first time, "AI-generated code security" is a state task

Clause 19 ("Enhancing security assurance capacity in the software field") contains the hardest technical content in the document — and it is precisely what most summaries dropped:

> Strengthen security review of **AI-generated code**, guard against new attack types such as **malicious instruction injection into intelligent coding tools**, and reinforce access control for development tools and code repositories. Research security technologies for **agent identity, trusted interconnection, data security, and behaviour control**… develop **behaviour-verifiable** industrial agents… strengthen **IP compliance governance for AI-generated code**.

In engineering language: prompt injection, skill-package and code-repository supply chains, and agent identity plus behavioural traceability have just been written into a national task list. This is not an abstract signal. It maps onto what actually happened over the past six months — agents using a package registry as a browser, skill packages carrying credential stealers, and attacks surfaced by outside researchers months after the fact. I wrote about that failure of accountability [here](/blog/who-finds-out-who-rules/), and about what an audit actually looks like [here](/blog/ai-generated-code-security-audit/). **When "behaviour-verifiable" becomes policy vocabulary, it is one standard away from becoming a procurement requirement.**

## 3. Skill packages (Skills) become a regulated distribution channel

Clause 9, on building an agent-software application market:

> Promote the construction of an **agent software app store and a skills (Skills) resource library**, regulate listing review and operation management… guide innovators to develop high-quality professional **skills** and knowledge bases.

For anyone who has watched the agent ecosystem, "skills" just moved from community jargon to policy noun. Two readings. The good one: distribution and monetisation gain an officially recognised container. The caution: "listing review" means the same container is now inside the regulatory perimeter. For skill authors, opportunity and compliance cost arrive together.

## 4. The standard list is tomorrow's procurement gate

Clause 16 names three standards to be developed: a **maturity-grading assessment standard for intelligent coding capability**, an **agent interface standard** for hardware-software coordination, and service standards for "**model-as-a-service**" and "**agent-as-a-service**".

"Maturity grading" deserves its own underline. Once a grading exists, it shows up in tender documents, local subsidy conditions and state-owned-enterprise procurement access. The same logic applies to Clause 4's commitment to build **more than 15 adaptation centres** for hardware-software co-verification. **For suppliers these are not academic exercises; they are bid prerequisites for the next two years.**

## 5. The plan admits the displacement effect

Clause 18 is titled "Promoting employment-friendly development of the software industry", and it is unusually candid:

> Guide software enterprises to optimise human-machine collaborative production organisation while improving intelligence, **implement job transformation and skills training** in parallel, and actively develop new job categories… **strengthen assessment of AI's employment impact in the software field**, and improve risk-response mechanisms.

A state document that mandates an employment-impact assessment is conceding that displacement will happen and asking that it be managed. For individuals the conclusion is direct: **policy protects the industry, not the job title.**

## So where does the first money come from?

This is the question I left myself after publishing my own review of the plan, and everything depends on it. The plan itself provides direction — compute vouchers ("算力券"), dedicated fiscal funds, "open competition" mechanisms, first-edition software product certification — but the actual channel was set up eleven days earlier, in a different MIIT document:

**The General Office's notice on a special programme for cultivating AI application service providers (工信厅科函〔2026〕414号, signed August 27; [original MIIT link](https://www.miit.gov.cn/jgsj/kjs/wjfb/art/2026/art_331b6f1d28ad410aa9df711acf42dbfe.html), [full text via a provincial association](https://www.ssia.org.cn/page63?article_id=2908)).** It gives countable, checkable mechanics:

- **A provider registry**: more than **2,000** providers nationally by end-2026; no fewer than **3,000** by end-2027; provinces hosting national AI pilot zones must list at least **100** local providers by end-2027; **local industry authorities must report their registry information to MIIT by 1 December 2026** (an internal reporting deadline for provincial bureaus, **not a deadline for enterprises to apply**).
- **Service teams**: at least **10** "AI application service teams" per region, each led by one provider with at least two upstream or downstream partners.
- **Procurement**: pilot "**first purchase, first use**" and **risk compensation** models, with explicit encouragement to buy more large-model, **agent** and **token** services.
- **People**: explicit encouragement for providers to build **forward-deployed engineer (FDE) teams stationed at customer sites**.
- **Tools**: use "compute vouchers" and similar policy instruments to cut costs, and optimise intelligent coding tools to improve supply capacity.

Read the two documents together and the most easily misread part is that date. **1 December is not a deadline for enterprises to apply.** It is the internal deadline by which provincial bureaus report their registry to MIIT; enterprises are registered by their local authorities (摸排入档), and there is no public application channel for individuals — the notice defines providers as "**enterprises or institutions**", which leaves individuals and tiny teams out of the pool (local registration ties matter too). The path this opens is real for large enterprises, state-owned firms and integrators with local ties; it is not directly open to a solo founder.

What is genuinely worth recording is "**forward-deployed engineer (FDE) teams stationed at customer sites**" — the official name for the layer of people who understand both business and agent deployment, and a position this policy will keep manufacturing demand for. **But the barrier is the entity and its qualifications, not the technology.**

## The capital side answered the other half

In the same week, Zhipu (02513.HK) announced roughly **US$5 billion** in financing on September 13: about **US$2 billion in a share placement** (HK$714 per share, a 9.96% discount to the prior close) plus about **US$3 billion in zero-coupon convertible bonds** (issued at 100.5% of principal, initial conversion price HK$892.50 — a **25%** premium to the placement price).

The structure matters more than the amount: **zero coupon** (investors forgo interest) plus a **25% conversion premium** (they pay up for future equity). That is capital pricing model-as-a-service cash flows, not application-layer stories. The fundamentals agree: H1 2026 MaaS and API revenue of RMB 825 million, up about 2,736% year on year, 86.5% of total revenue, with that segment's gross margin moving from **-0.4% to 24.6%**; MaaS ARR of **US$1.6 billion** by end-August; token volume up more than 40x since January, and average API selling price up about **101%** ([report via eCompany/Sina Finance](https://finance.sina.com.cn/stock/zqgd/2026-09-13/doc-inirszcu4390222.shtml)). Volume up and price up — which runs against the popular notion that the Chinese market is nothing but a price war, and temporarily diverges from Western inference-price deflation. **I have not yet found independent data to cross-check that divergence, so treat it as unverified.** Nothing here is investment advice.

## Three limits worth writing down

The most common error when reading policy is mistaking a target for a budget:

1. **"Coverage of 20,000 enterprises" is not "funding for 20,000 enterprises."** Coverage is a diffusion metric; the 100 technical-transformation projects are the project metric — and that is where fiscal and policy resources actually land. The two differ by two orders of magnitude. Do not blend them.
2. **Compute vouchers are not a general-purpose voucher.** Beijing, Chongqing and Hunan all cap them at compute resources, compute services and model services (including domestic-model adaptation), and explicitly exclude storage, network and security; official interpretation adds that they are meant to subsidise the cost of procuring self-developed coding tools and calling self-developed large-model coding services — **they reimburse tool and model-call fees, not consulting or accompaniment fees.** Their real value to a software firm still depends on whether it is already running models at scale.
3. **The maturity standard is only mandated, not written.** The gate does not exist yet. Whoever starts organising their evidence now — code quality, R&D economics, records of AI usage — skips a hurdle in the 2027 bidding season.

One more thing that is not a limit but is worth remembering: **the ROI of technical transformation depends on your customer mix.** For a firm living on custom projects, AI efficiency gains do not automatically improve gross margin — if you still quote in person-days, the efficiency lands in the quote. Technology and business model have to move together, which is presumably why Section 5 of the plan is devoted to service models.

## If you are one of these people, do this now

- **Engineers and tech leads:** treat AI-generated-code review and agent behavioural traceability as 2027 compliance prerequisites, not as this year's productivity purchase. The plan names both.
- **Small teams and service providers:** the registry path assumes you are an **enterprise or institution with a local tie** — providers are registered (入档) by local authorities, not self-applied — so first check whether your entity qualifies at all. For those who do, the competition bar is usually lower than the bar to win a contract.
- **Skill and tool builders:** the skills library is a new distribution channel; prepare for listing review at the same time.
- **Readers outside China:** the spillover is not "another Chinese industrial policy". It is **the cost curve of Chinese software services**. The same intelligent coding tools plus cheaper engineering hours show up first in custom-development and outsourcing quotes.

## What I take from it

Of the four targets, only two will be truly assessed: the 20,000-enterprise coverage (a diffusion rate) and the 100 transformation projects (a project count). The rest is supporting machinery.

The real information is not in the targets but in what the plan chooses to touch: **the production process.** It does not promise software companies a new market. It asks them to rebuild their own production line with AI — and writes tomorrow's gates (security review, behaviour verification, maturity grading) into today's task list.

The runway is drawn. The remaining question is individual: where in the named, concrete work do you stand — rather than how novel the phrase "AI + software" sounds.

---

**Sources and verification notes.** I cross-checked the plan text across three independent reproductions ([NetEase/China Energy Network](https://www.163.com/dy/article/L6HQ77V505567I2C.html), [Beijing News](https://www.bjnews.com.cn/detail/1789085225129692.html), [China Science and Technology Network](https://www.stdaily.com/web/gdxw/2026-09/11/content_579258.html)); all 21 quotations can be verified in any of them. One correction to my own earlier notes: the widely circulated line "the service model shifts from selling product licences to delivering business value" is **not** in the plan text (the actual wording is "guide software enterprises to transform into AI application service providers and strengthen continuous service and value delivery capability"). I do not use it. The provider-cultivation notice is reproduced in full by a provincial software association and carries the MIIT source link and document number 〔2026〕414. Zhipu's financing figures are as reported from the company announcement (eCompany/Sina Finance); **nothing here is investment advice**. The "China API prices rising while Western inference prices deflate" divergence remains unverified. This article was revised on publication day (2026-09-14) on two points: the plan's issue date was first written as September 11 but is actually **September 2, 2026** (September 11 was MIIT's public-release and press day), with document number **工信部信发〔2026〕209号** (carried in the full-text reproductions, cross-checkable); and 1 December 2026 was first written as an enterprise application deadline but is in fact the internal reporting deadline for provincial authorities, with providers defined as "enterprises or institutions". The same pass added the boundary on compute vouchers (they cover compute/model services and adaptation, not storage/network/security, and not consulting or accompaniment fees).
