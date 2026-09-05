---
title: AI 的下一场战争不在对话框里：2026 世界模型竞赛全景
title_en: The Next AI War Is Not in the Chat Window: A Field Guide to the 2026 World Model Race
description: 七天之内：World Labs 用一张图生成一个完整 3D 世界；Meta 把百万级上下文检索做到 98.1% 并宣布开源；OpenAI 确认自研人形机器人；中国创业公司三个月融资超百亿押注同一件事。谁在参赛、各自走什么路线、对工程师意味着什么——这篇全景解读一次说清。
description_en: In seven days, World Labs shipped a world model that turns one image into a full 3D world, Meta pushed million-token retrieval to 98.1% and promised open weights, OpenAI confirmed it is building humanoid robots, and Chinese startups raised over $1 billion in three months betting on the same idea. Who is racing, which routes they are taking, and what it means for engineers.
date: 2026-09-05
updated: 2026-09-05
tags: [世界模型, AI, 机器人, 空间智能, 中国AI]
tags_en: [World Models, AI, Robotics, Spatial Intelligence, China AI]
lang: both
draft: false
---

这一年里最大的一周 AI 新闻，几乎没怎么提到对话框。

2026 年 9 月 1 日到 4 日之间：[World Labs 发布了 Atlas](https://www.worldlabs.ai/blog/atlas)——用一张图生成一分钟 1440p 视频并重建可编辑的 3D 场景；Meta [发布 Muse Spark 1.3](https://www.latent.space/p/ainews-muse-spark-13-matches-gpt)，百万级上下文检索做到 98.1%，并承诺开源权重；[Forbes 证实 OpenAI 正在自研人形机器人](https://www.forbes.com/sites/johnkoetsier/2026/09/03/openai-is-making-a-humanoid-robot-everyone-should-have-one)，奥特曼说未来人人都该拥有一台个人机器人；而在中国，三家创业公司三个月合计融资超百亿，押注的是同一件事——下一代基础模型预测的不是单词，而是**世界**。

这就是世界模型竞赛。谁在参赛、各走什么路线、对写软件的人意味着什么，下面一次说清。

## 范式迁移：从预测下一个词，到预测下一个状态

「世界模型」这个词已经流传多年。2026 年真正变化的是，它从研究议程变成了**融资品类和人才磁铁**。

道理并不复杂。大语言模型预测下一个 token——一串文本。世界模型预测一个物理或空间系统的下一个**状态**：相机该往哪动、推一个物体会发生什么、从一个从未有相机拍过的角度看场景长什么样。北京智源《2026 十大趋势》把这次迁移概括为「Next Token Prediction → Next State Prediction」；LeCun 的立场更激进——纯文本路线到不了人类级理解，他的 AMI Labs 靠这个论点拿了创纪录的种子轮。

而产品层面的证据，从 9 月 1 日这一周开始密集落地。

## 硅谷路线：把空间智能做成产品

**World Labs（李飞飞）** 是「空间智能即产品」最清晰的押注。Atlas 用一张参考图就能生成最长 1 分钟、1440p 的相机可控视频，并把真实场景重建为显式 3D 输出——补上没有任何相机拍过的区域。公司累计融资约 12.3 亿美元（含 Autodesk、Nvidia、AMD 领投的 10 亿美元轮），估值约 50 亿美元。在人测对比中，Atlas 在相机可控生成上大幅领先 MiniMax H3、Gemini Omni Flash、FLUX 3 与 Seedance 2.5。

**Meta 的 Muse Spark 1.3** 的意义在另一个维度：它提醒我们「世界」不只是「3D」。Meta 把 MRCR 基准上 512K–1M token 的长上下文检索做到 98.1%（GPT-5.6 Sol 只有 73.8），并宣布开源权重在即——开源社区已经把它视为非中国模型里长上下文任务的最强选项。对 AI 编码团队来说，长上下文前沿决定了 agent「脑子里」能装下多大的世界：整个仓库、整条 agent 轨迹、完整的依赖链。

**OpenAI** 用一周的尾声确认了流传已久的传闻：它要造机器人本体，不只是机器人里的软件。奥特曼五月的人手招募帖和九月的确认，说明前沿实验室已经把**物理具身**当作 AGI 终局的一部分，而不是副业。

## 中国路线：资本密度 + 产业落地

中国的打法读起来很不一样：少一点「研究展示」，多一点「现在就进厂」。

- **极佳视界**：三个月三轮合计融资 35 亿元，成为国内首个世界模型独角兽。GigaWorld-1 以 62.34 分登顶 WorldArena——榜单首个破 60 分的模型；自动驾驶世界模型 DriveDreamer 已服务 30+ 主机厂。
- **千寻智能**：开年三个月四轮融资 45 亿元，走轻量化世界行为模型路线。
- **智平方（AI² Robotics）**：B 轮系列融资超 10 亿元，估值过百亿；**星海图**两轮近 30 亿元，押注 Fast-WAM 路线。
- **群核科技**——「卖水人」——4 月作为首家空间智能上市公司 IPO，首日涨 144%，把十几年家装软件沉淀的物理正确数据，变成具身智能的虚拟训练场。

规律很明显：中国的钱流向已经能指着一座工厂、一个仓库、一条路说「就是这里」的公司。极佳视界的机器人在一汽模具的真实产线上和阿里云一起干活，并规划三年内在无锡部署 1000 台；腾讯开源了混元 3D 世界模型；阿里发布了实时交互模型；吉利发布世界行为模型；华为乾崑公开拒绝 VLA，坚持世界行动路线。

## 五条路线，同一个剧本

最有趣的是，参赛者对架构并没有共识。当前地图：

1. **想象训练**——极佳视界：先在虚拟世界里练技能，再碰真硬件。
2. **仿真基础设施**——星海图、智元：做 sim-to-real 的底座。
3. **隐空间预测**——LeCun 的 AMI Labs：完全跳过像素，在抽象空间里预测未来。
4. **轻量行动模型**——千寻智能：反对高能耗的逐帧预测，更少参数、更省预训练。
5. **直接上路**——车企：世界模型就是下一代智驾层，离钱最近。

这种分歧，正是 2021–2022 年大模型竞赛的样子。共识不在架构上，而在**位置**上：世界模型就是具身智能的「预训练」阶段，正如大语言模型成为语言 agent 的预训练阶段。谁造出最好的世界模拟器，谁就给机器人供粮。

## 对工程团队意味着什么

三条务实结论，都不需要你买机器人：

1. **长上下文前沿是真的，而且已经落地。** Muse Spark 1.3 在 512K–1M token 上的 98.1%，改变了编码 agent 能「握住」的东西：整个仓库、完整 agent 轨迹、长依赖链，一个上下文装下。如果你的团队 AI 工作流在大型代码库上退化，修复可能只是把长任务换给更合适的模型——然后重新审计这些 agent 被信任过什么。
2. **数据与仿真正在变成护城河。** 世界模型公司在把物理数据和虚拟训练闭环变现。如果你旁边就有一个产生物理意义数据的行业（制造、物流、建筑、零售），那些数据开始有市场了。
3. **API 面正在超出聊天。** World Labs 发布了 World API；具身模型需要评测器、模拟器和审计工具。新的基础设施层意味着新的安全面——也意味着新的咨询机会。

结论不是「快去买世界模型 token」。而是：前沿已经越过对话框，把 AI 当作**被工程化的系统**（而不是被写出来的 prompt）的团队，会先看到差异。这也是本站在反复讲的主题：无论是[审计 AI 生成代码](/blog/ai-generated-code-security-audit/)还是[AI 学会进攻的那一周](/blog/ai-cyber-offense-era/)，实务工作都在集成层，不在演示层。

如果你的团队正在落地 AI 编码，想知道工作流和代码的真实状态——生产化、安全、合规——[这个对话就是为我们准备的](/services/)。
