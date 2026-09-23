---
title: "One Ordinary Conversation, and an Agent's Root Filesystem Walked Out"
description: "A researcher asked Meta's Muse to archive some files and send them to Google Drive. It came back with the session machine's entire root filesystem: a 2.7GB archive, 6.8GB unpacked, containing SSH private key files, 113 subagent traces, and roughly 68 skill directories. Meta marked the bounty report Not Applicable. It is the same defect class as last week's ZCode case: one ordinary conversation plus one connected export destination."
date: 2026-09-23
tags: [AI, AI Safety, Agents, AI Industry]
lang: both
draft: false
---

On September 22, researcher Peter James published his findings on Muse, Meta's agent ([original post](https://mouse.dev/blog/muse-runtime-export/)). He asked Muse to archive some files and send them to Google Drive. That was the whole conversation. What came back was not an archive. It was the root filesystem of the entire session machine: a 2.7GB compressed bundle, 6.8GB unpacked, holding SSH private key files, JSONL traces from 113 subagents, about 68 skill directories, and hints of unreleased internal connectors. The post scored 292 points on Hacker News. Meta's bounty system marked the report Not Applicable.

## What Muse is

Muse is Meta's self-hosted session machine. The agent runs in its own machine environment that you can deploy yourself. Internally, Meta calls it Hatch.

The filesystem splits into a few parts. /home/hatch holds the agent's personality: SOUL, IDENTITY, USER, MEMORY, AGENTS and TOOLS live here, followed by JSONL traces of 113 subagents and about 20 internal documents covering browser use, connectors, payments, credentials, WhatsApp, a paired Mac, Tailscale, even a Meta Home Link ESP32-C5 prototype.

/opt/hatch/skills holds about 68 skill directories. Two config files, skill-scopes.conf and bin-scopes.conf, reveal names of connectors that were never released: Slack, Dropbox, Polymarket, Canva, Klaviyo, and an internal-facebook-cli. The 18 files in /opt/hatch/runtime-cell describe how the session-machine image is built, using systemd-nspawn.

The memory system is worth a look too. Plain markdown plus a Postgres database with three tables, entries, embeddings and claims. One memory can supersede another. A nightly dream job produces ALIGNMENT_SYNTHESIS.md. Forgetting and retraction are staged. None of this structure is a vulnerability by itself, but it is why the export turned out to be so valuable.

## What the researcher did not prove

Peter James drew clear boundaries. He did not demonstrate container escape. He probed lightly and the boundary held. He did not establish whether the SSH keys were live or usable. Meta has not publicly responded to the disclosure, and the bounty report was marked Not Applicable.

So the Muse part of this article rests on one researcher's single-source investigation. The verified facts are that the exported filesystem existed and that key files were in it. Whether those keys could connect to anything, nobody has tested, and this article makes no such claim.

## Same defect class as ZCode

Last week's ZCode incident ran through the same channel.

ZCode is Zhipu's desktop AI coding tool. While logged in, it packaged the entire workspace, encrypted it, and uploaded it to Alibaba Cloud OSS in the background. The .git directory was 86.6% of the bundle. Turning the switch off did not stop it. A developer ([ferstar's write-up](https://blog.ferstar.org/)) found it on his own disk, published the investigation, and two days later a company sent a legal letter. Zhipu admitted on September 18 that the repository-index feature was on by default, then disputed the letter's contents on September 20. Both accounts are in public reporting, and both stay in this article. The upstream was later open-sourced at [zai-org/ZCode](https://github.com/zai-org/ZCode).

One case is a developer's local code, the other is a cloud session machine's entire filesystem. Different starting points, same leak channel: one ordinary conversation, plus one already-connected export destination. For Muse, the conversation was an archiving request and the destination was Google Drive. For ZCode there was no conversation at all. The logged-in state was the channel, and the destination was Alibaba Cloud OSS.

## The audit question has shifted

The old way to audit an agent was to ask what the code does and whether it hides a backdoor. By that lens, neither Muse nor ZCode is malware. Muse's code has no instruction to package keys and send them out. ZCode's upload feature had a stated legitimate purpose, generating Repo Wiki pages in the cloud.

The questions that matter now are two: what can the agent see, and where can the agent send. Muse shows that one ordinary conversation can turn what the agent can see into what it sends. ZCode shows the exit can be silent, with no conversation at all. Both point at the same audit item, the export path.

There are three checks you can run yourself.

One, which files can the agent read. The visible filesystem scope decides what it can see.

Two, does the agent have a writable, sendable destination. Cloud drives, object storage, email, clipboard. Once connected, they are channels.

Three, what sits inside those destinations. Keys, credentials, unpublished code. An agent that can see keys, plus a connected cloud drive, is a ready-made exit.

If you use agents, run these two questions before you read code lists. If you build agents, treat the export path as an audit item with the same weight as permissions.

## Sources and verification

The Muse portion of this article relies on researcher Peter James's post (mouse.dev/blog/muse-runtime-export/, September 22). It is a single-source disclosure. Meta has not publicly responded, the bounty was marked Not Applicable, and container escape and key validity were not tested. ZCode facts and figures follow the previously published Chinese write-up, with Zhipu's two rounds of statements presented side by side.
