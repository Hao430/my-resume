---
title: WorkBuddy 结合 ESA 开发网站实战
title_en: Shipping a Personal Site with WorkBuddy + Aliyun ESA
description: 使用 WorkBuddy 和阿里云 ESA 从零搭建个人网站的完整实战记录。
description_en: Building this personal site from zero with WorkBuddy and Aliyun Edge Security Acceleration (ESA).
date: 2026-02-20
tags: [前端, ESA, 实战]
tags_en: [Frontend, Edge Computing, Case Study]
lang: both
legacy: [/WorkBuddy结合ESA开发网站实战.html]
---

# WorkBuddy 结合 ESA 开发网站实战

本文记录使用 WorkBuddy 辅助开发，结合阿里云 ESA（Edge Security Acceleration）部署个人网站的完整过程。

## 项目背景

个人网站需要满足以下需求：

- 纯静态部署，无需服务器维护
- 支持 SPA 路由（Vue Router history 模式）
- 自动 HTTPS
- 全球加速

阿里云 ESA 的 Pages 功能完美匹配这些需求。

## 技术选型

| 层面 | 选择 | 理由 |
|------|------|------|
| 框架 | Vue 3 + TypeScript | 类型安全，生态成熟 |
| 构建 | Vite | 极速 HMR，构建快 |
| 部署 | 阿里云 ESA | 全球 CDN，SPA 支持 |
| AI 辅助 | WorkBuddy | 上下文理解，代码生成 |

## 开发流程

### 1. 项目初始化

使用 Vite 的 Vue + TypeScript 模板快速创建项目。

### 2. 组件开发

采用 `<script setup>` 语法，Pinia 状态管理，Vue Router 路由。

### 3. 部署配置

ESA 的 `esa.jsonc` 配置非常简洁：

```json
{
  "assets": {
    "directory": "./dist",
    "notFoundStrategy": "singlePageApplication"
  }
}
```

### 4. CI/CD

通过 GitHub Actions 实现推送即部署，质量检查自动运行。

## 经验总结

- 静态站点的优势：零运维、低成本、高可用
- AI 辅助开发能显著提升效率，但需要清晰的上下文
- ESA 的 SPA 模式配置简单，适合 Vue/React 等前端框架
