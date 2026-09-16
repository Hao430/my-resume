---
title: "Alibaba Open-Sources Its Battle-Tested AI Code Review Tool"
description: "Alibaba open-sourced Open Code Review, the AI code review assistant it ran internally for two years. Apache-2.0 and free, about 28,000 GitHub stars. A hybrid of deterministic pipelines and an LLM agent produces line-level comments, with built-in rules for NPE, thread safety, XSS and SQL injection, ten-plus languages, any model endpoint, and data that stays inside your network — at one-ninth of Claude Code's token cost."
date: 2026-09-16
tags: [AI Coding, Code Review, Open Source, Software Engineering]
lang: both
draft: false
---

Code review is the last fully human step in shipping software. Someone reads the diff, checks for logic holes, crash paths, and security mistakes. It is slow, and easy to miss things. Alibaba just open-sourced the tool it uses internally for this job.

Open Code Review started as the official AI code review assistant inside Alibaba Group. Two years of internal use, tens of thousands of developers, millions of code defects found. Now it is Apache-2.0, free, and sitting at roughly 28,000 stars on [GitHub](https://github.com/alibaba/open-code-review).

![GitHub repository](https://oss.hao430.cn/wechat/opencode-review/20260916/03-github-repo-top-99251f.png)

## Why the hybrid architecture matters

Plain LLM review means dumping a diff at a model and hoping for useful comments. OCR does the opposite. A deterministic pipeline first works out which files changed, which exact lines matter, and which rules apply. The LLM agent then reads files, searches the codebase, and makes the call with surrounding context. Comments come back pinned to a specific line, not as generic advice.

![Official site](https://oss.hao430.cn/wechat/opencode-review/20260916/01-official-site-hero-a584a7.png)

The ruleset covers the recurring failure modes: null pointer exceptions, thread safety, XSS, SQL injection. Ten-plus languages are supported, including Java, TypeScript, Go, Python, Kotlin, C++ and C.

Cost is the selling point most teams will notice. Alibaba's own numbers: for the same 1,000 pull requests, OCR consumes about one-ninth the tokens of Claude Code. Tokens are what you pay for when you call a model, so the gap compounds the more you review.

![Benchmark data](https://oss.hao430.cn/wechat/opencode-review/20260916/04-official-site-benchmark-2adb27.png)

## Any model, data stays private

OCR works with OpenAI- and Anthropic-compatible endpoints and ships presets for DashScope, DeepSeek and Z.AI. You can also point it at your own private endpoint. That last part matters: the code under review is sensitive, and this way it never leaves your network.

![Feature section](https://oss.hao430.cn/wechat/opencode-review/20260916/02-official-site-features-eb2f3a.png)

## Install and run

You need Node.js. One command:

```bash
npm i -g @alibaba-group/open-code-review
```

Then, in your project directory, run `ocr review`. It reads the git diff itself and starts reviewing. Wire it into GitHub Actions or GitLab CI and every push gets reviewed automatically.

## What the move signals

A tool validated on millions of real tasks, given away free, tells you AI code review has left the experimental stage. Reviewing code is a token-heavy workload, so the economics work out for whoever provides the model. For everyone else, it is a free second pair of eyes on every diff.

Humans should still read the final diff. Letting the AI take the first pass and catch the obvious ones is a better use of everyone's attention.

Docs at [open-codereview.ai](https://open-codereview.ai). Source at [github.com/alibaba/open-code-review](https://github.com/alibaba/open-code-review).
