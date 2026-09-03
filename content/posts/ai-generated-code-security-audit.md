---
title: How to Audit AI-Generated Code: A Five-Step Walkthrough
title_zh: AI 生成代码安全审计实操：五步走
description: AI now writes a large share of new code, and most teams cannot say which parts. Here is a concrete audit loop — footprint, supply chain, permissions, agent boundary, disclosure — that you can run this week.
description_zh: AI 已经写下了你代码库里相当一部分新代码，而多数团队说不清哪些是它写的。这是一套可以本周就跑起来的审计流程：画像、供应链、权限、Agent 边界、披露。
date: 2026-09-05
updated: 2026-09-05
tags: [AI Coding, Security, Code Review]
tags_zh: [AI 编码, 安全, 代码审计]
lang: both
draft: false
---

AI assisted with most of the code merged last month, and nobody can tell you which lines. The uncomfortable part is not that AI writes code — it is that the usual review instincts were built for human authors, and they quietly stop working when the author is a very confident language model.

This is the audit loop I use. Five steps, no tooling required beyond what you already have, executable this week.

## Step 1 — Find the AI footprint

There is no perfect fingerprint for AI-generated code, and anyone claiming one is selling something. Use differential evidence instead:

- **Dependency churn.** A PR that adds three new packages without a lockfile change discussion is a signal. AI tools optimise for "this compiles and this is what popular projects do" — they are magnets for the newest shiny package on npm or PyPI.
- **Commit style breaks.** Sudden shifts to dense, commit-message-free pushes, or a repo that went from reviewable diffs to single giant squashes.
- **Comment style.** AI comments explain *what* the code does ("increment the counter by one") — the least useful kind. A cluster of them is a family resemblance, not proof, but it points you where to look.
- **Test asymmetry.** AI code that "works" in the author's head often has happy-path tests only. Files merged with every branch covered except the error cases are worth a second pass.

The goal of this step is not attribution. It is triage: pick the 10% of recent changes most likely to contain AI-written code and audit those first.

## Step 2 — Audit the supply chain first

The highest-probability failure mode of AI-generated code is not logic — it is the dependency it pulled in. When a change introduces a new package:

1. Check **publish date vs popularity**. A package with 4M weekly downloads that was published yesterday is either a takeover or a typo-squatting attempt. AI models happily complete `pip install` commands with packages that look right.
2. Check the **maintainer**. One human maintaining a package your build now hard-depends on is a decision, not an accident.
3. **Pin and review the lockfile diff**, not the package's README. See exactly which transitive dependencies joined the tree.
4. Re-audit **any package that handles credentials, network parsing, or file access** as if it were written by an intern from the internet.

## Step 3 — Audit permissions and secrets

AI-written code tends to be generous with permissions, because "working" is its primary objective. Scan for:

- **Scope creep** — an SDK initialised with admin credentials when it only needs read access; cloud policies that copy the "example" from the docs.
- **Secrets in new places** — `.env` files committed by habit, tokens pasted into config files that are in git, credentials in build scripts. This is the single most common finding in AI-assisted pull requests.
- **Over-broad parsing** — code that takes user input and passes it into a shell, an eval, or an HTML interpolation without a boundary. AI models reproduce injection-prone patterns from training data with high fidelity.

If you have a secret scanner, run it over the diff, not just the repo — the interesting leaks are the recent ones.

## Step 4 — Check the agent boundary

If your AI tooling includes agents, MCP servers, or any tool that can act on your behalf, the audit extends past the commit. Review:

- **What the agent can reach** — which directories, which credentials, which cloud scopes. Run the `id` check from [Your AI Agent Is Running as Root](/blog/ai-agent-permission-management/): whatever user context the agent executes in, that is your attack surface.
- **Which tools are exposed** — every MCP server your editor auto-installs is another tool with another permission surface. Question the ones you did not ask for.
- **Prompt-injection hygiene** — a single web page read by the agent can become an instruction to it. Assume your agent can be redirected, and give it the minimum reach that still lets it do its job.

## Step 5 — Prioritise, fix, disclose

Not every AI-code finding is equal. Rank by exploitability, not by how weird it looks:

1. **Remotely reachable and exploitable** — fix now, treat as incident.
2. **Data exposure** — secrets in git, over-broad permissions — fix this week, rotate credentials.
3. **Supply-chain risk** — suspicious dependencies — replace or quarantine, then re-pin.
4. **Correctness and style** — refactor in the normal flow.

Then decide whether anything is reportable. If your product is in scope of the EU Cyber Resilience Act, the vulnerability reporting duty starts for many products on **11 September 2026** — check whether the finding is "actively exploited" or "known vulnerability" class, and whether your organisation is obligated to notify. When in doubt, documenting the decision is cheaper than explaining its absence.

## The checklist

- [ ] Recent 10% of merges triaged for AI-written code
- [ ] New dependencies: publish date, maintainer, lockfile diff reviewed
- [ ] Permission scopes re-checked against least privilege
- [ ] Secret scan run over the recent diff
- [ ] Agent/MCP reach documented and minimised
- [ ] Findings ranked by exploitability; disclosure obligation checked

## When an external pair of eyes makes sense

A self-audit catches most things. What it cannot do is be indifferent — teams audit their own code the way people proofread their own writing. If you need an independent walkthrough of the five steps above, with a written report and remediation, that is exactly the service I offer at [hao430.cn/services](/services/). Diagnose first, quote after — a free 30-minute call tells you whether it is worth doing.
