---
title: 阿里把内部用了两年的 AI 代码审查工具开源了，免费
title_en: "Alibaba Open-Sources Its Battle-Tested AI Code Review Tool"
description: 阿里把内部用了两年、服务数万开发者的 AI 代码审查助手 Open Code Review 开源了，Apache 2.0 完全免费，GitHub 2.8 万星。它用确定性管线加 AI Agent 的混合架构做行级精确审查，内置空指针、线程安全、XSS、SQL 注入等规则，支持十几种语言，可接任意大模型接口、数据不出内网，token 成本只有 Claude Code 的九分之一。
description_en: "Alibaba open-sourced Open Code Review, the AI code review assistant it ran internally for two years. Apache-2.0 and free, about 28,000 GitHub stars. A hybrid of deterministic pipelines and an LLM agent produces line-level comments, with built-in rules for NPE, thread safety, XSS and SQL injection, ten-plus languages, any model endpoint, and data that stays inside your network — at one-ninth of Claude Code's token cost."
date: 2026-09-16
tags: [AI编程, 代码审查, 开源, 软件工程]
tags_en: [AI Coding, Code Review, Open Source, Software Engineering]
lang: both
draft: false
---

程序员写完代码，要交给别人看一遍，这一步叫代码审查。以前这是人肉活，费时间，还容易看漏。现在 AI 开始接手这件事了。

阿里最近开源了一个叫 Open Code Review 的工具，干的就是这个。它在阿里内部用了两年，服务过几万名开发者，查出过几百万个代码缺陷。今年开源，Apache 2.0 协议，完全免费，[GitHub](https://github.com/alibaba/open-code-review) 上已经有两万八千多颗星。

![GitHub 仓库页](https://oss.hao430.cn/wechat/opencode-review/20260916/03-github-repo-top-99251f.png)

## 它解决什么问题

代码审查就是给代码挑毛病。逻辑有没有漏洞，会不会崩，有没有安全风险。AI 写代码越来越多了，代码谁来把关，变成了新问题。Open Code Review 就是让 AI 来当这个把关的人。

它和普通的 AI 问答不一样。它不是把整段代码丢给大模型，让模型随便评论。它先有一套确定的程序，把这次改动了哪些文件、哪几行、该套用哪条规则，精确定位出来，然后 AI 再去读文件、搜索整个代码库、结合上下文做判断。最后给的评论精确到某一行的具体位置，不是泛泛而谈。

![官网首屏](https://oss.hao430.cn/wechat/opencode-review/20260916/01-official-site-hero-a584a7.png)

它内置了不少针对常见问题的检查规则。空指针、线程安全、XSS、SQL 注入，这些程序员天天要防的坑，它有现成的检查项，支持 Java、Go、Python、TypeScript 等十几种语言。

成本是它一个很实在的卖点。官方给的数据是，同样审一千个代码提交，它消耗的 token 只有 Claude Code 的九分之一。token 是调用大模型按量计费的单位，审得越多，这个差距越值钱。

![官方基准数据](https://oss.hao430.cn/wechat/opencode-review/20260916/04-official-site-benchmark-2adb27.png)

## 小团队也能用

安装就是一条命令。npm 是 Node.js 自带的包管理器，装了 Node 就能装它。装完配一个模型接口就行。

它支持 OpenAI 和 Anthropic 的接口，也预设了阿里云百炼、DeepSeek、智谱这些国内模型，还可以接自己的私有模型地址。数据不用出公司内网，代码是你自己的，审查也留在你自己这边。对很多公司来说这一点很重要，代码是最敏感的资产。

![官网功能区块](https://oss.hao430.cn/wechat/opencode-review/20260916/02-official-site-features-eb2f3a.png)

想省事，可以把它接进 GitHub Actions 或 GitLab CI，每次提交代码自动触发审查，不用人盯着。

## 怎么上手

先装 Node.js，然后执行这条命令安装：

```bash
npm i -g @alibaba-group/open-code-review
```

装完在项目目录里运行 `ocr review`，它会自己读取 git 的改动记录，开始审查。官方文档在 [open-codereview.ai](https://open-codereview.ai)，写得很全。

## 说两句

一个在阿里内部跑了两年、验证过几百万次任务的工具，免费放出来，这个动作本身说明，AI 参与代码审查已经过了实验阶段，成了软件工程里的常规环节。对大模型厂商来说，代码审查是消耗 token 的大场景，对用的人来说，等于多了一个不花钱的把关人。

审代码这事，人还是要看的，但可以先让 AI 过一遍，把明显的问题挑出来，人把精力留给真正需要判断的地方。
