---
title: "GitHub 最火的 AI 项目不再发模型了，它们发工作流"
title_en: "GitHub's Hottest AI Projects Don't Ship Models Anymore. They Ship Workflows."
description: "GitHub 八月趋势里增速最快的仓库——MoneyPrinterTurbo，一个月 +17.1K star——不包含任何新模型。它封装了整条流水线：选题 → 脚本 → 素材 → 配音 → 字幕 → 剪辑 → 成片。开发者 star 的是完整可运行的 AI 工作流，而不是权重。与此同时，AI 产物溯源（C2PA、AI-Origin 检测）正在成为独立软件类别，持久记忆 agent 在卖'第二大脑'的承诺。开源的价值单元变了——每个人都该问的问题也变了。"
description_en: "The fastest-growing repo in GitHub's August trends — MoneyPrinterTurbo, +17.1K stars in a month — does not contain a single new model. It packages an entire pipeline: topic → script → stock footage → voiceover → subtitles → edit → finished video. Developers are starring complete runnable AI workflows, not weights. Alongside it, AI-output provenance (C2PA, AI-Origin detection) is becoming its own software category, and persistent-memory agents are selling the promise of a second brain. The star unit of open source has changed — and so has the question everyone should be asking."
date: 2026-09-08
updated: 2026-09-08
tags: [AI, 开源, 工作流, GitHub, 记忆]
tags_en: [AI, Open Source, Workflows, GitHub, Memory]
lang: both
---

四年以来，开源 AI 的雷达上只有一个亮点：*谁发布了什么模型。* 每一次发布都是奔向更好权重的赛跑中的检查点。然后 2026 年 8 月悄悄发生了：GitHub 上增速最快的仓库根本不含模型。

**MoneyPrinterTurbo** 单月涨了约 17,100 个 star（[GitHub](https://github.com/harry0703/MoneyPrinterTurbo)、[ByteByteGo 2026 榜单](https://www.verdent.ai/guides/moneyprinterturbo-github)）。它不发布任何东西。它*就是*一条流水线——而且是一条名副其实 MIT 许可、文档良好的：给它一个主题，语言模型写脚本、派生搜索词、抓素材、生成配音、建字幕、合成一条成品短视频（[verdent.ai](https://www.verdent.ai/guides/moneyprinterturbo-github)）。

工程师的本能反应是翻白眼。那是错误反应（[一篇诚实的解读](https://mrzacsmith.medium.com/moneyprinterturbo-read-honestly-the-pipeline-pattern-thats-worth-more-than-the-product-ee9112916f18)）。MoneyPrinterTurbo 传递的信号，是开源价值观正在发生的结构性迁移——而它改变了每个构建者都该问的问题。

## 迁移：从权重到工作流

star 驱动者追捧的价值单元已经移动。除了 star 数本身，还有三条证据：

1. **工作流包是新的 star 单元。** MoneyPrinterTurbo 的价值不在任何单一模型——里面的模型都是可替换的商品化 API。它的价值在*组合*：排序、交接、错误处理、多阶段 AI 流水线周围的界面。开发者 star 的是整台机器，而不是引擎。
2. **agent 可消费的工作流（技能）正在成为分发格式。** 项目越来越多地以"把这个技能给你的 agent，它就能做 X"的方式售卖——MoneyPrinterTurbo 自己就是如此，它的 README 就宣传一个可被 agent 安装的技能：配置、运行、返回成片路径（[GitHub README](https://github.com/harry0703/MoneyPrinterTurbo/blob/main/README-en.md)）。技能——agent 能消费的打包工作流——是 agent 经济的新应用商店。
3. **溯源成了产品。** 站在工作流浪潮旁边的，是 AI 产物可追溯性（C2PA provenance、AI-Origin 检测、隐私清理）已固化成一个独立软件类别。当每件产物都是机器生成时，"这东西从哪来、谁做的"就是产品。

## 第二大脑正在被卖爆

同一周更安静的信号：持久记忆 agent——"整理你一生的第二大脑"这个品类——正在被产品化，OpenClaw 式系统把跨会话记忆当作核心卖点，评价问题转向*哪个 agent 记得住我、且不泄露我的数据*（[Vellum/fast.io 综述](https://www.fast.io)）。手工第二大脑（Notion、Obsidian）正让位于 agent 自动维护的版本。

把这些拼起来，模式不容错认：**模型是商品；记忆与工作流才是资产。** 与 2023-2025 的心智模型完全相反。

## 对构建者意味着什么

三条后果，按重要性排序：

1. **如果你在选择做什么，做组合，别做组件。** 谁都能调 LLM API。可防御的工作是把一组模型变成对特定工作有用的流水线——排序、交接、评估循环、安全护栏。开源正在那里拥挤，那也是个人构建者仍能赢的地方。
2. **如果你在选择用什么，决策不再是"哪个模型"，而是"哪套栈"：** 模型 + agent + 技能 + 网关 + 记忆 + 权限，为任务而配。孤立地优化模型选择是昨天的提问。
3. **如果你生产内容，溯源是特性，不是税。** 证明"这是人做的，以及如何做的"的工具正在成为标配。现在把信任信号建进流水线很便宜；事后补很痛苦。

"这周哪个模型赢了"的时代结束了。"哪个工作流真的能用——以及谁能证明"的时代开始了。
