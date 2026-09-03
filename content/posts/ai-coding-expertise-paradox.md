---
title: We Are Training Fewer Engineers Who Can Read AI Code
title_zh: 我们在培养越来越少的、能看懂 AI 代码的人
description: 90% of developers use AI agents weekly while trust in AI accuracy fell from 40% to 29%. Both numbers are real, and the gap between them is where the next years of engineering work live.
description_zh: 90% 的开发者每周都在用 AI，但对 AI 准确性的信任度从 40% 掉到 29%。两个数字都是真的——差距本身就是接下来的工程生意。
date: 2026-09-03
updated: 2026-09-03
tags: [AI, Software Engineering, Career]
tags_zh: [AI, 软件工程, 职业发展]
lang: both
draft: false
---

In late August 2026 a Danish developer, Lars Faye, published a short essay with an unfashionable thesis: [coding expertise is going to collapse because of AI reliance](https://larsfaye.com/articles/ai-coding-will-prevent-expertise). It became [the most argued-about programming thread of the month on Hacker News](https://news.ycombinator.com/item?id=49421554) — 561 points, 545 comments. Reading the thread, the split was not optimists versus pessimists. It was people who had noticed the same quiet thing, comparing notes.

I have been noticing it too, from the "one person shipping products with AI" side of the fence, and this quarter's numbers make the feeling hard to dismiss.

## Two charts that point in opposite directions

- **[JetBrains, Developer Ecosystem Survey 2026](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026)** (15,000+ professional developers, May–July 2026): **90%** use AI coding agents at work at least weekly; **68%** daily.
- **[Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/ai)**: only **29%** trust AI output to be accurate, **down from 40%** the previous year, and **66%** name their biggest frustration as output that is "almost right, but not quite".
- **[Wharton / University of Pennsylvania field experiment](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education)** (Bastani et al., ~1,000 high-school students, four 90-minute sessions): students with open ChatGPT access solved **48% more** practice problems — and then scored **17% worse** on the unassisted test than the group that studied from the textbook. The group using a *tutor-guarded* AI scored the same as the textbook group.
- **[Anthropic's skill-formation study](https://arxiv.org/abs/2601.20245)** (Feb 2026): developers who used AI to generate code mastered the new skill less well ([InfoQ summarised the effect as ~17% lower mastery](https://www.infoq.com/news/2026/02/ai-coding-skill-formation)); those who used it to *explain* did not lose out. The researchers' own worry is that humans "may not possess the necessary skills to validate and debug AI-written code if their skill formation was inhibited by using AI in the first place".

Adoption is up, trust is measurably down, and the two failure studies agree from different directions. That is not a contradiction. It is one specific structural problem.

## The expert–novice trap

The mechanism fits in one sentence: **AI coding tools demand expert judgement while removing the practice that produces experts.**

To use a coding agent well you must already be able to do the thing it does faster than you: read an unfamiliar diff, spot the plausible-but-wrong function, notice that this "clean" refactor just changed retry semantics, judge whether the test it wrote asserts anything real. That is senior-level reading comprehension, not typing speed.

But the only way people acquire that skill is friction: write the thing, be wrong, stare at the failure, slowly build a model of the machine. Remove the friction and you keep the outputs while deleting the lesson. The UPenn result is the cleanest evidence of that — the AI group *looked* better while practising (+48%) and worse where it counted (−17%), and [they also reported being overly optimistic about how much they had learned](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education).

Junior developers are hit hardest. The apprenticeship ladder — take a small ticket, get it reviewed, absorb why — is the exact rung that has been removed. And a reviewer cannot catch what they also would have missed, while the review step is frequently skipped anyway.

## What "using it well" actually looks like

Here is the uncomfortable half: the people extracting the most from these tools treat them as a compiler they argue with, not an author they trust.

For me that is five cheap rules:

1. **Never accept a diff I cannot narrate.** If I can't explain line by line what changed and why, I ask again — or write it myself. The speed advantage evaporates the moment I need its output explained to me later.
2. **Write the tests first, by hand.** The test is the specification and the boundary of the blast radius. Generated tests around generated code are a feedback loop with no outside reference.
3. **Small scopes, always.** One function, one file, one failure mode. Large AI-shaped changes are where "it worked in the sandbox" goes to die.
4. **Read the failure, not just the fix.** When something breaks I resist pasting the traceback. That reading *is* the practice I'm buying; the model gets the second pass.
5. **Keep one no-AI hour a day** for what I am trying to *understand* rather than deliver. Learning and shipping are different activities and they compete for the same attention.

Notice none of this is about prompting. It is about staying inside the loop where judgement is built.

## The repair economy nobody budgeted for

If the skill curve flattens, money moves to whoever can restore order afterwards — and that market already has price points. [Keyhole's 2026 roundup estimates that of roughly 10,000 startups that attempted production apps with AI assistants, more than 8,000 now need rebuilds or "rescue engineering", at $50K–$500K per engagement](https://keyholesoftware.com/vibe-coding-trends-2026). Treat that as a vendor's estimate, not a census — the direction is corroborated by the security scans: [Escape.tech audited 1,400+ vibe-coded production applications and found 65% with security issues, 58% with at least one critical vulnerability, and over 400 exposed secrets](https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-generated-code-security-vibe-coding-202).

The demographic explains why nobody caught it: the same roundups report [**63%** of vibe-coding users are non-developers](https://keyholesoftware.com/vibe-coding-trends-2026) — product managers, founders, designers. In January 2026 the clearest illustration arrived: the founder of Moltbook built an AI social network without writing code himself and, as [OX Security documented](https://www.ox.security/blog/vibe-coding-security), exposed **1.5 million API tokens and 35,000 email addresses within 72 hours** of launch through a misconfigured database. No exotic exploit — a configuration gap any routine code review would have caught, and there was no review.

So this is a strange economy: we pay a premium to undo work that was nearly free to produce. It is also the honest answer to "will AI replace programmers?" — it replaced the *writing*. The reading, judging and rescuing became more expensive, because volume and opacity both went up.

For an individual practitioner, that is where the leverage sits for the next few years: not generating more code, which is now a commodity, but three less replaceable skills — **specifying** what should exist, **auditing** what does exist, and **recovering** what broke. Independent builders good at those three things are the real beneficiaries of cheap generation: their cost of trusting it went down while everyone else's went up.

## What I would tell someone starting now

Do not refuse the tools — that path is now socially and economically expensive. Refuse to outsource the *struggle*.

Concretely: build one thing a quarter with **no code generation at all**. Write the boring CRUD, the state machine and the migration by hand and feel the friction. Use agents on everything else, and read every line they produce. Keep a written log of the times the model was confidently wrong — that log becomes your intuition, and it is the one asset the model does not have: memory of what *this* system does when it lies.

The pessimistic 2027 is an industry at 90% adoption and 29% trust with nobody left who can explain the system when it fails. The optimistic 2027 has the same tools plus humans who kept the reading skill and spent the saved time on specification and audit.

The difference between those two futures is not model quality. It is whether individual engineers protect the friction that makes them experts — and whether we are willing to charge honestly for the people who do.

---

## Sources

1. Lars Faye — [Coding expertise is going to collapse from AI reliance](https://larsfaye.com/articles/ai-coding-will-prevent-expertise); [Hacker News thread](https://news.ycombinator.com/item?id=49421554) (561 points, 545 comments, 2026-08-24)
2. JetBrains — [AI Coding Agents: Adoption Trends](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026), Developer Ecosystem Survey 2026
3. Stack Overflow — [AI section, Developer Survey 2025](https://survey.stackoverflow.co/2025/ai)
4. Hamsa Bastani et al. — [Without Guardrails, Generative AI Can Harm Education](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education), Knowledge at Wharton
5. Shen & Tamkin — [How AI Impacts Skill Formation](https://arxiv.org/abs/2601.20245) (arXiv:2601.20245); [InfoQ summary](https://www.infoq.com/news/2026/02/ai-coding-skill-formation); [DevClass summary](https://www.devclass.com/ai-ml/2026-02-02/anthropic-research-skilled-devs-make-better-use-of-ai-but-using-ai-is-bad-for-learning-skills/4079561)
6. Keyhole Software — [Vibe Coding Trends 2026](https://keyholesoftware.com/vibe-coding-trends-2026) (vendor compilation; adoption, demographics and rescue-engineering estimates)
7. Cloud Security Alliance research note — [Vibe Coding Security Crisis: Credential Sprawl and SDLC Gaps](https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-generated-code-security-vibe-coding-202) (Escape.tech scan figures)
8. OX Security — [Vibe Coding Security: Why 62% of AI-Generated Code Is Vulnerable](https://www.ox.security/blog/vibe-coding-security) (Moltbook incident)
