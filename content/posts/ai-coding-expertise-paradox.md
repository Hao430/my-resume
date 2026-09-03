---
title: We Are Training Fewer Engineers Who Can Read AI Code
title_zh: 我们在培养越来越少的、能看懂 AI 生成代码的工程师
description: 90% of developers use AI weekly while trust in it fell from 40% to 29% in a year. Both numbers are correct, and the gap is where the next few years of engineering work will live.
description_zh: 90% 的开发者每周都在用 AI，但对它的信任度一年内在下降。两个数字都是真的——差距本身就是接下来的工程生意所在。
date: 2026-09-03
tags: [AI, Software Engineering, Career]
tags_zh: [AI, 软件工程, 职业发展]
lang: both
draft: false
---

In late August 2026 a Danish developer, Lars Faye, published a short essay with an unfashionable thesis: **coding expertise is going to collapse because of AI reliance**. It became the most argued-about programming thread of the month on Hacker News — 561 points, 545 comments. Reading the thread, the split was not optimists versus pessimists. It was people who had noticed the same quiet thing, comparing notes.

I have been noticing it too, from the side of "one person shipping products with AI", and the numbers this quarter make the feeling hard to dismiss.

## Two charts that point in opposite directions

- **JetBrains' 2026 survey**: roughly **90%** of developers now use AI assistants weekly, while trust in the output fell from **40% to 29%**.
- **A University of Pennsylvania study**: students allowed AI assistance scored about **17% lower** than peers who worked from textbooks alone.
- **Anthropic's own research** on AI-assisted learning concluded that the most productive learning happened when AI was *not* used to generate the code.
- And in February 2026, security researchers reported that vibe-coded apps had leaked on the order of **1.5 million API keys** — with something like **63%** of vibe-coding users being non-developers.

So adoption is up, trust is down, skill formation is measurably weaker, and the failure modes are landing on people who cannot recognise them. That is not a contradiction. It is a very specific structural problem.

## The expert–novice trap

The mechanism is simple enough to state in one sentence: **AI coding tools demand expert judgement while removing the practice that produces experts.**

To use a coding agent well you must already be able to do the thing it does faster than you: read an unfamiliar diff, spot the plausible-but-wrong function, know that this "clean" refactor just broke the retry semantics, decide whether the test it wrote is testing anything. That is senior-level reading comprehension, not typing speed.

But the way people actually learn that skill is friction: writing the thing, being wrong, staring at the failure, and eventually building a model of the machine. Remove the friction and you keep the outputs while deleting the lesson. UPenn's -17% is the same finding from the other direction, and Anthropic's study says it most cleanly: the learning happens when the model is used to *explain*, not to *produce*.

Junior developers are the group hit hardest. The apprenticeship ladder — take a small ticket, get it reviewed, absorb why — is the exact rung that has been taken away. A reviewer cannot catch what they also would have missed, and the review step is often skipped anyway.

## What the "expert" side actually looks like

Here is the uncomfortable half: the people gaining the most from these tools are those who treat them as a compiler they argue with rather than an author they trust.

For me that means a few concrete rules, and they are all cheap:

1. **Never accept a diff I cannot narrate.** If I cannot explain line by line what changed and why, I ask again, or write it myself. The agent's speed advantage evaporates the moment I need its output explained to me later.
2. **Write the tests first, by hand.** The test is the specification and the boundary of the blast radius. A generated test of generated code is a feedback loop with no outside reference.
3. **Small scopes, always.** One function, one file, one failure mode. Big AI-shaped changes are where "it worked in the sandbox" goes to die.
4. **Read the failure, not just the fix.** When something breaks I resist the urge to paste the traceback. That reading is the practice I am paying for; the tool gets the second pass.
5. **Keep one no-AI hour a day** for the thing I am trying to understand rather than deliver. Learning and shipping are different activities and they compete.

Notice none of these are about prompting. They are about staying inside the loop where judgement is built.

## The repair economy nobody budgeted for

If the skill curve is flattening, the money moves to whoever can restore order afterwards, and that market already has a price. Reports this summer put roughly **8,000 startups** in need of a rebuild of AI-generated codebases, with "code rescue" engagements quoted at **$50K–$500K** each.

That is a very strange shape of an economy: we pay a premium to undo work that was nearly free to produce. It is also the honest answer to "will AI replace programmers?" — it replaced the writing part. The reading, judging and rescuing part got more expensive, because the volume and opacity of code went up.

For an individual practitioner this is where the leverage sits over the next few years. Not in generating more code, which is now a commodity, but in three less replaceable skills: **specifying** what should exist, **auditing** what does exist, and **recovering** what broke. Independent builders who are good at exactly those three things are the ones who benefit from cheap generation, because their cost of trusting it went down while everyone else's went up.

## What I would tell a junior starting now

Do not refuse the tools — that path is now socially and economically expensive. Refuse to outsource the *struggle*.

Concretely: build one thing a quarter with no code generation at all, where you write the boring CRUD, the state machine and the migration by hand and feel the friction. Use agents on everything else, and read every line they produce. Keep a written log of the times the model was confidently wrong, because that log becomes your intuition, and it is the one asset the model does not have: the memory of what this specific system does when it lies.

The pessimistic version of 2027 is a industry with 90% adoption, 29% trust, and nobody left who can explain the system when it fails. The optimistic version is the same tools, with humans who kept the reading skill and used the time saved to specify and audit instead of type.

The difference between those two futures is not model quality. It is whether individual engineers protect the friction that makes them experts — and whether we are willing to charge honestly for the people who do.

---

*Sources: JetBrains State of AI Developer Survey 2026 · University of Pennsylvania study on AI-assisted learning (2026) · Anthropic research on AI-assisted skill formation · Lars Faye, "Coding expertise is going to collapse from AI reliance" (Hacker News, 2026.08) · 2026 vibe-coding security incident reporting · 2026 code-rescue market reporting.*
