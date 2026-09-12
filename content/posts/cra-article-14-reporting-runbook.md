---
title: The Clock Is Already Running - A Practical Runbook for CRA Article 14 Reporting
title_zh: 倒计时已经在跑：CRA 第 14 条上报义务实操手册
description: EU CRA Article 14 took effect on September 11, 2026. If you place a product with digital elements on the EU market, you now have 24 hours to file an early warning once an actively exploited vulnerability is confirmed. Here is the runbook - what to file, where to register, and the ten questions to answer before the clock starts.
description_zh: 欧盟《网络弹性法》第 14 条已于 2026 年 9 月 11 日生效。只要你的数字产品进入欧盟市场，一旦确认漏洞被主动利用，24 小时内必须提交预警。这份手册给出可执行动作：报什么、在哪里注册、以及时钟启动前必须回答的十个问题。
date: 2026-09-12
updated: 2026-09-12
tags: [EU CRA, Compliance, Security, AI Coding]
tags_zh: [欧盟法规, 合规, 安全, AI 编码]
lang: both
draft: false
---

The obligation started yesterday. Not "next year," not "when the guidance lands" — [Article 14 of Regulation (EU) 2024/2847](https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act) has applied since **11 September 2026**, and the 24-hour clock does not wait for onboarding.

This is the follow-up to [the countdown piece I published before the deadline](/blog/eu-cra-vulnerability-reporting-2026/). That one explained why the rule matters. This one is the runbook: what to file, where to register, and what to settle inside your team before the clock ever starts.

## The three clocks

| Clock | What triggers it | Who receives it |
|---|---|---|
| **24 hours** | You become aware of an **actively exploited vulnerability** in your product | Your coordinator CSIRT + ENISA |
| **72 hours** | Follow-up notification with severity, impact and remediation status | Same channel |
| **14 days** | Final report after a corrective measure is available | Same channel |

A **severe incident** affecting the security of the product follows the same 72-hour / 14-day path. The 24-hour early warning is the one that catches teams off guard, because "aware" is the trigger — not "confirmed by your vendor," not "patch released."

Two facts worth restating because they change scope:

- **Existing products count.** Article 69(3) extends the reporting duty to products placed on the market before 11 December 2027. A product you shipped in 2021 and never touched is in scope.
- **The penalty is real.** Breaching the reporting duty can cost up to **€15 million or 2.5% of worldwide annual turnover**, whichever is higher (Article 64).

Note the two timelines: the broad manufacturer obligations under Article 13 apply from 11 December 2027, but Article 14 applies **now**. Being mid-compliance on Article 13 is not a defense for missing a 24-hour report.

## The single reporting platform: do this before you need it

Article 16 requires ENISA to run a **Single Reporting Platform (SRP)** so a manufacturer reports once, and the coordinator CSIRT circulates it to ENISA and other relevant CSIRTs. The SRP went live alongside the obligation. The registration mechanics, per [ENISA's own guidance](https://www.enisa.europa.eu/topics/product-security/single-reporting-platform-srp/frequently-asked-questions):

1. **Create an EU Login account** — with multi-factor authentication enabled. This can be done today, in advance.
2. **Register on the SRP as an Assigned Representative (AR)** — select your role, then pick the **CSIRT designated as coordinator** for your main establishment from the drop-down.
3. **Authenticate via EU Login**, accept the legal agreement, confirm your details.
4. **Enter the manufacturer record** (name, address, additional information) — the platform creates the manufacturer entity on submission.

Three practical details that determine whether you can actually file on day one:

- **The CSIRT choice is made at registration.** If you have not decided which coordinator CSIRT applies to your main establishment, you cannot complete the flow — decide it now, not during an incident.
- **The AR role is a named person.** The platform's terms require users to confirm they are authorised to act for the organisation. Whoever holds the account needs the mandate to file, plus MFA on their phone at 3 a.m.
- **Authority is validated after first access**, in parallel with reporting — a CSIRT may come back to verify that your AR is duly assigned. Keep that mandate in writing.

## The ten questions to answer before the clock starts

Work through this list as a team exercise, not a solo reading. Anything you cannot answer is a gap the first incident will find.

1. **Who owns the clock?** One named person, plus a backup, who is reachable within the hour.
2. **Which CSIRT is your coordinator?** Decided and recorded, with the SRP registration done.
3. **Where do vulnerability reports land today?** Security reports, customer tickets, bug bounty, an angry email — all of them need one intake path.
4. **What counts as "actively exploited" for your product**, and who makes that call?
5. **What is your evidence trail?** Screenshots, logs, timestamps, versions — the 72-hour notification is much cheaper when the first hour was documented.
6. **Who writes the 24-hour filing?** A pre-approved template beats composing under pressure.
7. **Which products are in scope?** List them, including the legacy ones you would rather forget.
8. **Do you know which parts of the product are AI-generated?** More on this below.
9. **What do you tell customers, and when?** The regulatory report and the customer advisory are different documents with different clocks.
10. **When did you last rehearse?** A dry run of the SRP flow and the template, once, before you need it.

## Why AI-generated code sharpens the problem

Teams that ship AI-generated code face a specific version of this: **the 24-hour clock starts whether or not you can trace the code that broke.**

If a vulnerability is reported in a module nobody remembers writing, the first hours disappear into archaeology — which model wrote it, what it was instructed to do, which agents touched it since. Article 14 does not care about provenance, but your ability to file a credible 72-hour notification and a 14-day final report depends on it. That is the practical link between compliance and engineering hygiene: **footprint, supply chain, permissions, agent boundaries** — the same five-step audit loop we walk through [here](/blog/ai-generated-code-security-audit/), now with a regulatory clock attached.

The teams in the best shape are not the ones with the longest compliance documents. They are the ones who can answer "what happened, what did we do, and how do we know" within a day.

## A note on scope

This is an engineering runbook, not legal advice. Whether your specific product, role (manufacturer, importer, distributor, open-source steward) and main establishment put you in scope under Article 14 is a question for counsel — the [ENISA SRP FAQ](https://www.enisa.europa.eu/topics/product-security/single-reporting-platform-srp/frequently-asked-questions) and the European Commission's [CRA hub](https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act) are the primary sources, and both are being updated as the platform matures.

What is not in question is the clock. It is running now.

If your team ships AI-assisted code and you want to know whether you could actually file a 24-hour report today — traceability, evidence, the reporting path — [that is the conversation we are set up for](/services/).
