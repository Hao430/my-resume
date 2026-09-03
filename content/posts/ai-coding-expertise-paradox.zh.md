---
title: 我们在培养越来越少的、能看懂 AI 代码的人
description: 90% 的开发者每周都在用 AI，但对 AI 准确性的信任度从 40% 掉到 29%。两个数字都是真的——差距本身就是接下来的工程生意。
date: 2026-09-03
updated: 2026-09-03
tags: [AI, 软件工程, 职业发展]
lang: both
draft: false
---

2026 年 8 月底，丹麦开发者 Lars Faye 发了一篇很短的文章，观点在这个时间点很不合时宜：[因为依赖 AI，编程的专业能力将会塌方](https://larsfaye.com/articles/ai-coding-will-prevent-expertise)。它成了[当月 Hacker News 上吵得最凶的编程帖](https://news.ycombinator.com/item?id=49421554)——561 分，545 条评论。看完评论区会发现，割裂的不是乐观派和悲观派，而是"早就注意到这件小事的人"在互相对答案。

我也是从"一个人用 AI 做产品"这个角度注意到它的。这一季度的数据，让这种直觉很难再被当成情绪。

## 两张指向相反的图

- **[JetBrains《开发者生态调查 2026》](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026)**（15,000+ 专业开发者，2026 年 5–7 月）：**90%** 每周至少在工作中使用 AI 编程 Agent，**68%** 每天都用。
- **[Stack Overflow《开发者调查 2025》](https://survey.stackoverflow.co/2025/ai)**：只有 **29%** 相信 AI 输出的准确性，**前一年是 40%**；**66%** 说最大的痛点是"看起来对，但差一点"的输出。
- **[沃顿商学院 / 宾夕法尼亚大学实地实验](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education)**（Bastani 等，约 1,000 名高中生，四轮 90 分钟）：可以自由使用 ChatGPT 的一组，练习题正确率**高 48%**，但在没有 AI 的测验里比只用教材的一组**低 17%**；而使用"导师模式"（只给提示、不给答案）的一组与教材组持平。
- **[Anthropic 的技能形成研究](https://arxiv.org/abs/2601.20245)**（2026 年 2 月）：用 AI **生成**代码的被试掌握新技能更差（[InfoQ 归纳为掌握度低约 17%](https://www.infoq.com/news/2026/02/ai-coding-skill-formation)），用 AI **解释**代码的不受影响。研究者自己的担心是：如果技能形成过程被 AI 抑制，人将来可能**没有能力去验证和调试 AI 写的代码**。

使用率在涨，信任度在跌，两项从不同方向做的研究给出同一件事。这不是矛盾，是一个非常具体的结构性问题。

## 专家—新手陷阱

机制一句话就能说清：**AI 编程工具要求专家级判断力，同时它拆掉了产生专家的那条路。**

要用好编程 Agent，你本来就得会做它比你快得多的事：读懂陌生的 diff、看出那段"看起来没问题"的函数错在哪、意识到这次"干净"的重构顺手改掉了重试语义、判断它写的测试到底断言了什么。这是资深级的阅读能力，不是打字速度。

而人学会它的唯一路径是摩擦：自己写、写错、盯着失败看，慢慢建立起对这台机器的心智模型。摩擦拿掉了，产出还在，训练没了。宾大那组数据最干净——AI 组**练习时更好看（+48%）、考试时更差（−17%）**，而且[他们对自己学到多少的判断也明显偏乐观](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education)。

受害最重的是初级开发者。学徒阶梯——领一张小票、被 review、吸收"为什么"——被抽掉的正是这一级。而 reviewer 也抓不住他自己本来就会漏的问题，何况这一步通常直接省了。

## 真正"用得好"的人长什么样

让人不太舒服的另一半结论：从这些工具里拿到最大收益的人，是把它当成"可以争论的编译器"，而不是"可以信任的作者"。

对我来说是五条很便宜的规定：

1. **不能逐行讲清楚的 diff 不合。** 讲不出来就重新问，或者自己写。一旦需要它事后向我解释，它的速度优势就归零了。
2. **测试自己先写。** 测试是规格，也是爆炸半径的边界。生成代码 + 生成测试 = 一个没有外部参照的闭环。
3. **范围永远要小。** 一个函数、一个文件、一种失败模式。大而整的 AI 改动，是"它在我机器上能跑"的坟墓。
4. **读失败，而不只是读修复。** 出问题时先忍住，别把 traceback 直接贴进去。这个阅读动作才是我付钱想买的东西，模型负责第二遍。
5. **每天留一小时完全不用 AI**，专门对付我想*搞懂*而不是想交付的东西。学习和交付是两件事，它们在抢同一段注意力。

注意，这些跟提示词工程没关系。它们只关乎一件事：让自己留在长出判断力的那个环路里。

## 没人做预算的"修复经济"

如果能力曲线在变平，钱就会流向事后能收拾秩序的人，而且这个市场已经有报价了。[Keyhole 的 2026 年汇总估计：约 1 万家尝试用 AI 助手做生产应用的初创公司里，超过 8,000 家现在需要重建或"救援式工程"，单案报价 5 万到 50 万美元](https://keyholesoftware.com/vibe-coding-trends-2026)。这是服务商口径、不是普查，但方向被安全扫描佐证：[Escape.tech 审了 1,400 多个 vibe-coded 生产应用，65% 存在安全问题、58% 至少有一个严重漏洞、暴露密钥超过 400 个](https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-generated-code-security-vibe-coding-202)。

人群结构解释了为什么没人拦得住：同一批汇总数据显示 [**63%** 的 vibe coding 用户不是开发者](https://keyholesoftware.com/vibe-coding-trends-2026)——产品经理、创始人、设计师。2026 年 1 月出现了最直白的样本：Moltbook 的创始人一行代码没写、全靠 AI 做了一个社交网络，[OX Security 记录到](https://www.ox.security/blog/vibe-coding-security)上线 **72 小时内泄露 150 万条 API Token 和 3.5 万个邮箱地址**，原因只是一个配错的数据库。不是什么高级手法——任何一次常规代码复核都会抓到的配置问题，只是没有复核。

所以这是一个形状很别扭的经济体：我们为撤销"几乎免费的劳动"支付溢价。它也是对"AI 会不会取代程序员"的诚实回答——被取代的是**写**；变贵的是读、判断和救援，因为代码的量和不透明度都涨了。

对个人来说，未来几年的杠杆就在这里：不是生成更多代码（这已经是大宗商品），而是三种不太可替代的能力——**说清楚该有什么**、**审计已经有什么**、**出事后能救回来**。独立做产品的人如果恰好擅长这三件事，反而是廉价生成能力的真正受益者：别人对它的信任成本在上升，你的在下降。

## 给现在入行的新人

别拒绝工具——这条路现在的代价更高。要拒绝的是"把挣扎外包出去"。

具体做法：每个季度做一个小东西，**完全不用代码生成**。无聊的 CRUD、状态机、数据迁移都手写，去感受那个摩擦。其他项目正常用 Agent，但它写的每一行都要读。另外记一份日志，写下模型什么时候自信地错了——那份日志会变成你的直觉，也是模型唯一没有的资产：你知道*这套*系统在撒谎时长什么样。

2027 年的悲观版本：90% 使用率、29% 信任度，系统出事时没有人能解释它。乐观版本：同样的工具，加上一群保留了阅读能力的人，把省下的时间拿去做规格和审计。

两个未来的差别不在模型质量，在于每个工程师是否护住了那个让自己变专业的摩擦——以及，我们是否愿意诚实地为守住它的人定价。

---

## 来源

1. Lars Faye — [编程专业能力将因依赖 AI 而塌方](https://larsfaye.com/articles/ai-coding-will-prevent-expertise)；[Hacker News 讨论](https://news.ycombinator.com/item?id=49421554)（561 分 / 545 评论，2026-08-24）
2. JetBrains — [AI Coding Agents: Adoption Trends](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026)（开发者生态调查 2026）
3. Stack Overflow — [开发者调查 2025 · AI 章节](https://survey.stackoverflow.co/2025/ai)
4. Hamsa Bastani 等 — [Without Guardrails, Generative AI Can Harm Education](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education)，Knowledge at Wharton
5. Shen & Tamkin — [How AI Impacts Skill Formation](https://arxiv.org/abs/2601.20245)（arXiv:2601.20245）；[InfoQ 摘要](https://www.infoq.com/news/2026/02/ai-coding-skill-formation)；[DevClass 摘要](https://www.devclass.com/ai-ml/2026-02-02/anthropic-research-skilled-devs-make-better-use-of-ai-but-using-ai-is-bad-for-learning-skills/4079561)
6. Keyhole Software — [Vibe Coding Trends 2026](https://keyholesoftware.com/vibe-coding-trends-2026)（服务商汇总口径）
7. Cloud Security Alliance — [Vibe Coding Security Crisis](https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-generated-code-security-vibe-coding-202)（含 Escape.tech 扫描数据）
8. OX Security — [Vibe Coding Security](https://www.ox.security/blog/vibe-coding-security)（Moltbook 事件）
