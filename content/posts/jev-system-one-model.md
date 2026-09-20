---
title: 一家AI媒体把自家27篇文章交给一个不会写字的模型
title_en: "Jev: The Model That Never Writes a Word"
description: TypeSafe 在 9 月 15 号发布了 Jev，一个一个字都不写的模型，只做选择和打分。Every 把 37 篇文章、777 个判断交给它，跑了 0.7 秒，花不到半美分。三篇第三方实测给出的结论跟厂商宣称不完全一样，快和便宜是真的，准不是它的卖点。
date: 2026-09-20
tags: [AI, 大模型, 模型评测, AI行业观察]
tags_en: [AI, LLM, Model Evaluation, AI Industry]
lang: both
cover: /images/jev/cover-3705c4.png
draft: false
---

上周有家做 AI 内容的媒体，叫 [Every](https://every.to/)。它把编辑部写过的 27 篇文章翻出来，另外找了 10 篇一眼 AI 味的稿子，丢给一个新模型。它要干的是一件日常的事，帮你认出哪些文字是 AI 写的。

![左边一个字一个字吐出的长对话气泡，右边一排同时亮起的判断节点](/images/jev/cover-3705c4.png)

21 个问题，37 篇，777 个判断，一次跑完。零点七秒，前后花不到半美分。原文在这儿：[Mini-Vibe Check](https://every.to/also-true-for-humans/mini-vibe-check-typesafe-s-jev-judged-everything-i-ve-written-in-0-7-seconds)。

这个模型叫 Jev，9 月 15 号发布的（[发布公告](https://typesafe.ai/blog/introducing-system-one-models-and-jev)）。它不写字。一个字都不写。你给它一段东西，问它几个问题，它只回你选择和数字，外加一个把握有多大。

问它这篇是不是 AI 写的，它回一个 0.14，意思是它不太信。问它这封读者来信站哪一边，它回 0.62 反对。它不会顺带跟你解释为什么，它没这个功能。

做这个模型的公司叫 [TypeSafe](https://typesafe.ai/)，创始人 Diogo Almeida，InstructGPT 那篇论文的作者名单里他排第四（[论文原文](https://openreview.net/pdf?id=m2fp26Hr2V6)）。那篇论文是 ChatGPT 的地基。他 2024 年离开 OpenAI，藏了两年，出来的第一天宣布拿了 4000 万美元种子轮，DCVC 领投（[通稿](https://www.businesswire.com/news/home/20260915525333/en/)，厂商口径）。

他说了一句话我觉得是真话。模型在聊天这件事上早就超过人了，那自动化在哪。

想想确实是。这一年我们买了那么多聪明的模型，让它写周报、回消息、改简历，剩下那点聪明劲多半闲在那。可软件里跑的活，绝大多数根本不说话，它就想知道要不要、走 A 还是走 B、这条给几分。我们过去非得让一个会写散文的模型去干这个，它偏要把字数凑满。

ChatGPT 和 Claude 是一个字一个字往外蹦的，问它十个问题，它得从第一个字写到最后一个字。Jev 一次把十个答案全推出来，输出的不是句子，是一堆概率。所以快，所以便宜，输入百万 token 四美分出头，输出不要钱，反正也没多少东西可给。

Every 拿它跟 Claude 对过一回。12 段人工埋了毛病的文本，七处毛病。Jev 抓到六处，漏掉的那处扎眼，三次跑，三次都漏同一个。Claude 全抓到，慢二十几倍，贵五百多倍。

要是故事停在这，那又是快是快、但不够准的老套段子。有意思的地方在下一次实测。

奥斯陆一个做数据的人叫 Emil Lindfors，他抢到内测资格，拿挪威政府那份三文鱼税的听证材料试了试，24 份意见书，问它写这份的是公司还是个人、通篇是反对还是支持、论证有没有实质内容。同一套题目交给 DeepSeek 跑，两边准确率打平。Jev 便宜十倍，快二十倍。全文：[A first look at TypeSafe's Jev](https://lindfors.no/blog/a-first-look-at-typesafes-jev/)，评测代码他也开源了（[GitHub](https://github.com/EmilLindfors/jev-horingssvar-eval)）。

| | Jev | DeepSeek（推理开） |
|---|---|---|
| 立场题，四选一 | 20/24 | 22/24 |
| 打分题，有序刻度 | 19/24 | 14/24 |
| 跑一千份的成本 | 0.22 美元 | 3.08 美元 |
| 中位延迟 | 0.32 秒 | 26 秒 |

准不是它的卖点。它那页概率能兑现，这才是。Lindfors 数了一下，Jev 说把握在 0.9 以上的那些判断，192 个里错 4 个。他还把没把握的答案单独挑出来看，把握 0.9 以上的 15 篇判断错 1 篇，0.9 以下的 9 篇错 3 篇。你只放行它有把握的那部分，剩下的转给人，这才敢往生产系统里放。DeepSeek 报的把握近乎随机数，它说 0.7 到 0.9 那一档，实际只有一半对得上。

一个模型值钱的地方，从它能答对，变成它知道自己哪几次会答错。

Jev 这个名字来自 Jevons，一个十九世纪的经济学家。当年蒸汽机效率一提上去，所有人都以为煤该少烧点了。结果反着来，烧煤变划算，各行业全用上了，煤的总消耗翻着跟头涨。效率上去，单次消耗掉下来，总量反而爆了。

发模型的人用这个名字，赌的是智能也走这条路。一次像样的判断如果便宜到不要钱，那会有多少活重新变得值得自动化。这个模型眼下接不了写东西这活，它瞄准的是那种一天要判几百万次、又不需要谁给你讲道理的时刻。官网上有个演示让它打毁灭战士，一秒决策十次，玩一小时七美元。看个乐，重点是那一百毫秒和那几美分。

也有人不买账。Linear 的工程师 Sean Goedecke 写了一篇[反驳](https://www.seangoedecke.com/jev-means-structured-output-is-interesting-again)：快和结构化输出这件事现在就有，给普通大模型预填一个引号再加约束解码，只让它生成一个 token，就能拿到 Jev 大部分好处。他自己拿 1.5B 的小模型试了，快了两三倍。他的意思是这不是新物种，只是把一件早就可行的事做成了产品，而且它做不了长文本，也做不了 test-time compute。发布公告当天，社区里就有人复现出类似效果。HN 主帖冲到 [1906 分、498 条评论](https://news.ycombinator.com/item?id=49717558)，一大半在吵这个。

该泼的冷水也得泼。我跑不了它，要排队拿授权，这是个闭源的美国服务，国内看着热闹实际用不上。上面的数字我核了两边，发布方的博客和三篇第三方实测，Every 那篇、Lindfors 那篇，还有一个叫 kingy.ai 的[综合评测](https://kingy.ai/blog/typesafe-jev-review-the-ai-model-that-doesnt-generate-text)。三篇口径不一样，结论也不完全一样。kingy.ai 提醒了一句，发布方公开的那套评测拿另一个模型的打分当标准答案，那不是真值，发票处理这一项它的分数还低于对手。

发布方自己在博客末尾写了一段限定。百倍那个数来自他们挑得最合手的用例，参考答案取的是两个对手模型的平均，速度是他们西海岸的笔记本测出来的，价格他们也没法证明没在补贴。他们甚至开了一页列这个模型的[已知弱点](https://docs.typesafe.ai/model-jaggedness/jev-1.13)。一家公司肯自己写但书，比只讲突破可信一点。

如果你今天要带走一个动作，就是下次再看 AI 新闻，别先问它多强。问它会不会说不确定。会说的，才敢让它自己干活。

## 来源与核验说明

- 厂商一手：[TypeSafe 发布公告](https://typesafe.ai/blog/introducing-system-one-models-and-jev)（2026-09-15，含官方限定段）、[模型弱点页](https://docs.typesafe.ai/model-jaggedness/jev-1.13)、定价行
- 独立第三方：[Every 的 777 个判断](https://every.to/also-true-for-humans/mini-vibe-check-typesafe-s-jev-judged-everything-i-ve-written-in-0-7-seconds)、[Lindfors 的 24 份挪威语实测](https://lindfors.no/blog/a-first-look-at-typesafes-jev/)（2026-09-18）、[kingy.ai 综合评测](https://kingy.ai/blog/typesafe-jev-review-the-ai-model-that-doesnt-generate-text)
- 反方观点：[Sean Goedecke](https://www.seangoedecke.com/jev-means-structured-output-is-interesting-again)（2026-09-16）
- 4000 万美元种子轮出自 [Business Wire 通稿](https://www.businesswire.com/news/home/20260915525333/en/)，属厂商口径，未独立核实。另有约 2 亿美元估值的传闻只找到二手转述，本文不采用
- 速度、成本、贵五百多倍这些倍数，都是测试者自己的估算口径，不是实验室基准。Lindfors 本人说明他那份结果是快照不是基准，样本只有 24 份，四选一那一项的差距，他自己说落在噪声里
- 官方对 RLCD 的解释是 Reinforcement Learning for Calibrated Decisions。部分中文报道把它展开成了别的词组，属误写
- Jev 目前早期访问排队制，闭源，美国托管，本文作者没有自测过
