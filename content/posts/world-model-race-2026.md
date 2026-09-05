---
title: The Next AI War Is Not in the Chat Window: A Field Guide to the 2026 World Model Race
title_zh: AI 的下一场战争不在对话框里：2026 世界模型竞赛全景
description: In seven days, World Labs shipped a world model that turns one image into a full 3D world, Meta pushed million-token retrieval to 98.1% and promised open weights, OpenAI confirmed it is building humanoid robots, and Chinese startups raised over $1 billion in three months betting on the same idea. Here is who is racing, which routes they are taking, and what it means for engineers.
description_zh: 七天之内：World Labs 用一张图生成一个完整 3D 世界；Meta 把百万级上下文检索做到 98.1% 并宣布开源；OpenAI 确认自研人形机器人；中国创业公司三个月融资超百亿押注同一件事。谁在参赛、各自走什么路线、对工程师意味着什么——这篇全景解读一次说清。
date: 2026-09-05
updated: 2026-09-05
tags: [World Models, AI, Robotics, Spatial Intelligence, China AI]
tags_zh: [世界模型, AI, 机器人, 空间智能, 中国AI]
lang: both
draft: false
---

The biggest AI week of the year barely mentioned the chat window.

Between September 1 and September 4, 2026: [World Labs released Atlas](https://www.worldlabs.ai/blog/atlas), a world model that turns a single image into a minute of 1440p video and a reconstructable 3D scene. Meta [shipped Muse Spark 1.3](https://www.latent.space/p/ainews-muse-spark-13-matches-gpt), hitting 98.1% on million-token retrieval and promising open weights. [Forbes confirmed OpenAI is building a humanoid robot](https://www.forbes.com/sites/johnkoetsier/2026/09/03/openai-is-making-a-humanoid-robot-everyone-should-have-one), with Sam Altman saying everyone should eventually own a personal robot. And in China, three startups raised a combined over $1 billion in three months on the same bet — that the next foundation model does not predict words, it predicts *worlds*.

This is the world model race. Here is who is in it, which routes they are taking, and what it changes for people who build software.

## The paradigm shift: from next token to next state

The phrase "world model" has been floating around for years. What changed in 2026 is that it became a **funding category and a talent magnet**, not just a research agenda.

The intellectual case is straightforward. LLMs predict the next token — a string of text. A world model predicts the next **state** of a physical or spatial system: where a camera would move, what an object does when pushed, what a scene looks like from an angle no camera ever captured. Beijing-based think tank BAAI's 2026 trends report framed the shift as "Next Token Prediction → Next State Prediction," and Yann LeCun has been making the stronger claim — that the text-only path will not reach human-level understanding — while his startup AMI Labs raised a record seed round on it.

The practical case is stacking up at the product level, and the week of September 1 made it concrete.

## The Silicon Valley route: spatial intelligence as a product

**World Labs (Fei-Fei Li)** is the clearest "spatial intelligence as a product" bet. Atlas generates camera-controlled video up to 1 minute at 1440p from as few as one reference image, and reconstructs real scenes into explicit 3D outputs — filling in regions no camera ever saw. The company has raised about $1.23 billion (including a $1B round with Autodesk, Nvidia and AMD) at a reported $5B valuation. Notably, in head-to-head ratings Atlas beat MiniMax H3, Gemini Omni Flash, FLUX 3 and Seedance 2.5 by wide margins on camera-controlled generation.

**Meta's Muse Spark 1.3** matters for a different reason: it is a reminder that "world" does not only mean "3D." Meta pushed long-context retrieval to 98.1% on the MRCR benchmark at 512K–1M tokens (vs. 73.8 for GPT-5.6 Sol) and announced open weights are coming — which the open-source community is already reading as the strongest non-Chinese model option for long-context work. For AI coding teams, the long-context frontier is the one that changes what an agent can hold in its head.

**OpenAI** closed the week by confirming what was long rumored: it is building the robot, not just the software inside it. Altman's May hiring post and September confirmation signal that the frontier labs now treat *physical embodiment* as part of the AGI endgame, not a side project.

## The China route: capital density, industrial landing

China's entries read differently: less "research showcase," more "industrial deployment now."

- **极佳视界 (Jijia Vision)** raised ¥3.5 billion (about $0.5B) in three months across three rounds, becoming the country's first world-model unicorn. Its GigaWorld-1 topped the WorldArena leaderboard at 62.34 — the first model to break 60 — and its DriveDreamer autonomous-driving world model already serves 30+ automakers.
- **千寻智能 (Qianxun Intelligence)** raised ¥4.5 billion across four rounds in the first three months of the year for lightweight world-action models.
- **智平方 (AI² Robotics)** closed a Series B tranche exceeding ¥1 billion at a ¥10B+ valuation; **星海图 (Xinghaitu)** raised nearly ¥3 billion in two rounds for its Fast-WAM route.
- **群核科技 (Manycore)** — the "shovel seller" — IPO'd in April as the first spatial-intelligence-backed public company, up 144% on day one, monetizing a decade of physically-correct home-design data as a virtual training ground for embodied AI.

The pattern: China's capital is going to companies that can already point at a factory line, a warehouse, or a road. Jijia Vision's robots are doing real work at FAW tooling plants with Alibaba Cloud, with a plan for 1,000 units in Wuxi over three years. Tencent open-sourced its HY-World 3D model; Alibaba shipped a real-time interactive model; Geely announced a World Action Model; Huawei's Qiankun publicly rejected VLA in favor of a world-action approach.

## Five routes, one playbook

The interesting part is that the contenders do not agree on the architecture. The current map:

1. **Imagined practice** — Jijia Vision trains skills in simulated worlds before touching real hardware.
2. **Simulation infrastructure** — Xinghaitu and Zhiyuan build the sim-to-real substrate.
3. **Latent-space prediction** — LeCun's AMI Labs skips pixels entirely, predicting futures in abstract space.
4. **Lightweight action models** — Qianxun argues against heavy frame-by-frame prediction: fewer parameters, cheaper pretraining.
5. **Straight onto the road** — automakers treat the world model as the next driver-assistance layer, the closest route to revenue.

That divergence is exactly how the LLM race looked in 2021–2022. The consensus is forming not on the architecture, but on the *position*: a world model is the pretraining stage for embodied intelligence, just as LLMs became the pretraining stage for language agents. Whoever builds the best world simulator gets to feed the robots.

## What this means for engineering teams

Three practical takeaways, none of which requires you to buy a robot:

1. **The long-context frontier is real and shipping.** Muse Spark 1.3's 98.1% at 512K–1M tokens changes what coding agents can hold: whole repos, full agent traces, long dependency chains, in one context. If your team's AI workflow degrades on large codebases, the fix may be as simple as re-evaluating which model you route long tasks to — and re-auditing what those agents were trusted with.
2. **Data and simulation are becoming the moat.** World-model companies are monetizing physical data and virtual training loops. If you sit next to an industry that generates physically-meaningful data (manufacturing, logistics, construction, retail), that data is starting to have a market.
3. **The API surface is widening beyond chat.** World Labs ships a World API; embodied models need evaluators, simulators and audit tooling. New infrastructure layers mean new security surfaces — and new consulting opportunities around them.

The takeaway is not "go buy world-model tokens." It is that the frontier has moved past the chat window, and the teams that treat AI as a system to be *engineered* — not a prompt to be written — are the ones who will see the difference first. That has been the running theme on this site: whether it is [auditing AI-generated code](/blog/ai-generated-code-security-audit/) or [the week AI learned to attack](/blog/ai-cyber-offense-era/), the practical work is in the integration layer, not the demo layer.

If your team is adopting AI coding and wants a clear picture of where your workflow and your code actually stand — productionization, security, compliance — [that is the conversation we are set up for](/services/).
