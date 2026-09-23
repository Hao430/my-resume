---
title: 一次普通对话，导出了整台会话机的根文件系统
title_en: "One Ordinary Conversation, and an Agent's Root Filesystem Walked Out"
description: 研究者让 Meta 的 Muse 把文件归档发到 Google Drive，它交出了整台会话机的根文件系统。压缩包 2.7GB，解开 6.8GB，里面有 SSH 私钥文件、113 条子代理轨迹、约 68 个技能目录。Meta 把赏金报告判为 Not Applicable。这和上周的 ZCode 是同一类问题，出口都是一次普通对话加一个已连接的导出目的地。
date: 2026-09-23
tags: [AI, AI安全, 智能体, AI行业观察]
tags_en: [AI, AI Safety, Agents, AI Industry]
lang: both
cover: /images/agent-export-surface/cover-76a89a.png
draft: false
---

9 月 22 日，研究者 Peter James 公开了对 Meta 智能体 Muse 的取证。他让 Muse 把一些文件归档，发到 Google Drive，对话就这一句。Muse 交回来的是整台会话机的根文件系统。压缩包 2.7GB，解开 6.8GB，里面有 SSH 私钥文件、113 条子代理的工作轨迹、约 68 个技能目录，还有一批没公开的内部连接器线索。他把取证过程写成博客（[原文](https://mouse.dev/blog/muse-runtime-export/)），在 Hacker News 上拿了 292 分。Meta 的赏金系统把这份报告判为 Not Applicable，不适用。

## Muse 是什么

Muse 是 Meta 的自托管会话机。智能体跑在自己的机器环境里，可以自己部署。Meta 内部管它叫 Hatch。

文件系统分几块。/home/hatch 是智能体的人格所在，SOUL、IDENTITY、USER、MEMORY、AGENTS、TOOLS 这些配置文件都在这里，后面跟着 113 条子代理的 JSONL 工作轨迹，还有约 20 份内部文档，内容是浏览器用法、连接器、支付、凭证、WhatsApp、配对的 Mac、Tailscale，甚至一个叫 Meta Home Link 的 ESP32-C5 原型。

/opt/hatch/skills 下是约 68 个技能目录。两份配置文件 skill-scopes.conf 和 bin-scopes.conf 里，露出了还没发布的连接器名字：Slack、Dropbox、Polymarket、Canva、Klaviyo，还有一个 internal-facebook-cli。/opt/hatch/runtime-cell 的 18 个文件描述会话机镜像怎么构建，用的是 systemd-nspawn。

记忆系统也值得说。普通 markdown 加一个 Postgres 库，entries、embeddings、claims 三张表，一条记忆可以被新记忆取代，每晚跑一次梦境，产出 ALIGNMENT_SYNTHESIS.md，还支持分阶段遗忘和撤回。这套结构本身不是漏洞，但它决定了这次导出的含金量。

## 研究者没证明的事

Peter James 的取证有明确边界。他没证明容器逃逸，轻试了一下边界，边界守住了。他没确认那些 SSH 密钥是不是活的、能不能用。Meta 官方没有公开回应这次披露，赏金报告被标记为 Not Applicable。

所以本文的 Muse 部分基于一名研究者的单方取证。核心事实是导出的文件系统确实存在，密钥文件确实在里面。密钥能不能连进别的机器，没人验证过，本文也不作这个论断。

## 和 ZCode 是同一类问题

上周的 ZCode 事件，通道是同一个。

ZCode 是智谱的桌面 AI 编程工具。开发者只要登录，它就在后台把整个工作区打包加密，直传阿里云 OSS，.git 目录占 86.6%，关了开关也照传。一个开发者从磁盘上发现了它，公开到博客，两天后有公司发函追责。智谱 9 月 18 日承认代码库索引功能默认开启，9 月 20 日否认函件内容，两条口径都在公开报道里，本文都保留。

一个是开发者本机的代码，一个是云端会话机的整个文件系统，发起方不同，外泄通道是同一个：一次普通对话，加上一个已连接的导出目的地。Muse 这边，普通对话是归档请求，导出目的地是 Google Drive。ZCode 那边，连对话都不用，登录状态本身就是通道，导出目的地是阿里云 OSS。

## 审查问题变了

以前审查一个智能体，问的是代码里写了什么，有没有后门。这个视角下，Muse 和 ZCode 都不算恶意软件。Muse 的代码里没有一条指令说要把密钥打包发出去，ZCode 的上传功能当初的正当理由是云端生成 Repo Wiki。

现在要问的是两个问题：智能体能看见什么，智能体能往哪发。Muse 的例子说明，一次普通对话就能把能看见的变成发出去的。ZCode 的例子说明，出口可以是静默的，连对话都不用。两个例子指向同一个检查项，出口路径。

落到自己能做的检查，是三件事。

一，智能体能读到哪些文件。文件系统可见范围，决定了它能看见什么。

二，智能体有没有可写的、可发送的目的地。云盘、对象存储、邮箱、剪贴板，连接上了就是通道。

三，这些目的地里，有没有密钥、凭证、没公开的代码。能看见密钥的智能体，加一个已连接的云盘，就是一条现成的出口。

对用智能体的人，盯代码清单不如先问这两句。对做智能体的人，把出口路径当成审计项，和把权限当审计项一样重要。

## 来源与核验说明

本文 Muse 部分依赖研究者 Peter James 的博客（mouse.dev/blog/muse-runtime-export/，2026-09-22），属单方取证，Meta 未公开回应，赏金判 Not Applicable，容器逃逸与密钥有效性未经验证。ZCode 部分的数字与出处沿用上周公众号稿，智谱两轮口径并存。
