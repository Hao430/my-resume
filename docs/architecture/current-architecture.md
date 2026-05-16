# 当前架构

> 前后端分离改造前的纯静态前端架构。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API) |
| 类型系统 | TypeScript |
| 构建工具 | Vite 7 |
| 状态管理 | Pinia |
| 路由 | Vue Router 5 (History 模式) |
| 包管理器 | pnpm |

## 架构特点

```
┌──────────────────────────────┐
│          阿里云 ESA           │  自动构建 + CDN
│     (静态站点托管)             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      Vite 构建产物 (dist/)    │
│  ┌─────────────────────────┐ │
│  │   Vue SPA (js/css/html) │ │
│  └─────────────────────────┘ │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     浏览器端渲染               │
│  ┌─────────────────────────┐ │
│  │  Pinia Store ← 硬编码数据 │ │  ← 当前：数据在 JS 里
│  │  组件 → 渲染              │ │
│  └─────────────────────────┘ │
└──────────────────────────────┘
```

## 数据流（当前）

所有页面数据通过在 `src/data/*.ts` 或 `src/stores/*.ts` 中硬编码的 TypeScript 变量提供：

```
resume-data.json
      ↓ (sync-resume.js 转换)
src/data/resume.ts ───→ 页面组件渲染

src/stores/blog.ts  ───→ BlogPage.vue / BlogPostPage.vue

src/stores/slides.ts ───→ SlidesPage.vue / SlideViewerPage.vue

src/data/dailyBriefs.ts ──→ DailyBriefPage.vue
```

**问题**：修改任何内容都需要重新 `git push → ESA 自动构建部署`，无法在线更新。

## 部署

- **托管**：阿里云 ESA Pages
- **触发**：推送 `main` 分支 → ESA 自动监听 → 构建 → 部署
- **配置**：`esa.jsonc` 定义构建命令和静态目录
- **CI**：GitHub Actions 做质量检查和构建验证

## 目录结构

```
my-resume/
├── src/
│   ├── components/      # Vue 组件
│   ├── pages/           # 页面组件（8个）
│   ├── stores/          # Pinia Store（blog, slides）
│   ├── data/            # 静态数据（resume, dailyBriefs）
│   ├── router/          # 路由配置
│   ├── types/           # 类型定义
│   └── App.vue          # 根组件
├── public/              # 静态 HTML 文章
├── scripts/             # 同步脚本
├── esa.jsonc            # ESA 配置
└── vite.config.ts       # Vite 配置
```
