# 开发规范

## 技术栈

| 层 | 技术 |
|---|------|
| 前端框架 | Vue 3 + TypeScript |
| 构建工具 | Vite |
| 状态管理 | Pinia |
| 路由 | Vue Router |
| 后端 | Express + TypeScript |
| 数据库 | PostgreSQL (pg) |
| 包管理 | pnpm (前端) / npm (server/) |

## 命名规范

| 领域 | 规范 | 示例 |
|------|------|------|
| API 层类型（src/api/index.ts） | snake_case，与数据库列名一致 | `external_url`, `display_date`, `content_html` |
| 前端逻辑代码（stores/pages/components） | camelCase | `fetchPosts`, `getPostBySlug`, `loading` |
| 前端组件解析 API 数据时 | 引用蛇形字段，内部可用驼峰重命名 | `post.external_url \|\| null` → `externalUrl` |
| 文件名 | kebab-case | `blog-page.vue`, `daily-brief-page.vue` |
| 组件名 | PascalCase 多单词 | `BlogPostCard`, `FilterTabs` |
| 函数/方法 | camelCase | `fetchPosts()`, `getPostBySlug()` |
| Pinia store 名 | 单词命名 | `blog`, `resume`, `slides` |
| 目录名 | 简短单数 | `stores/`, `pages/`, `routes/` |

例外：`externalUrl` 作为组件内部计算后的驼峰别名，用于区分来源是 `external_url` 还是内部路由。

## 代码组织

```
src/
  api/        — API 请求层 + 类型定义
  stores/     — Pinia store（数据获取 + 缓存）
  pages/      — 页面级组件
  components/ — 通用组件
  router/     — 路由定义
server/
  src/
    routes/  — Express 路由模块
    db/      — 数据库连接池 + schema
    seed/    — 数据迁移脚本
```

## 编码规范

- 缩进：2 空格，UTF-8，LF 换行（.editorconfig 已配置）
- 类型：TypeScript strict 模式，避免 `any`
- API 类型定义在 `src/api/index.ts`，前端其他地方引用 `import type`（Vue SFC 中注意与变量名不冲突）
- lint 和 type-check 必须在推送前通过（CI/CD 会拦截失败）
- 后端 API 路径 `/api/*`，Content-Type `application/json`，错误响应格式 `{ "error": string }`
- Vue SFC 中 `<script setup>` 优先

## 开发流程

```bash
pnpm run dev:all    # 同时启动前后端开发服务器
pnpm run lint       # 代码检查
pnpm run type-check # 类型检查
pnpm run build      # 生产构建
```

## Git

- 远程使用 SSH 协议（已配置 `git@github.com:Hao430/my-resume.git`）
- 主分支 `main`，推送即触发 CI/CD
- CI/CD 流水线：质量检查 → 前端构建 → 后端部署到云服务器 / 前端部署到 ESA
