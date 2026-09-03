# 文档索引

## 当前状态（纯静态）

- [`writing.md`](writing.md) — **怎么发文章**（内容工作流，日常只用这一份）
- [`../CLAUDE.md`](../CLAUDE.md) — 开发规范、目录约定、硬性规则、部署自查

## 历史文档（后端已删除，仅作存档）

`docs/api/`、`docs/architecture/`、`docs/deployment/`、`docs/plan/`、`docs/reference/`
里描述的是「Vue + Express + PostgreSQL」的旧架构。项目已改为纯静态：
数据在构建期从 `content/posts/*.md` 与 `public/` 生成，运行时不再有任何 API 请求。
这些文档保留是为了追溯决策，**不要按它们改代码**。
