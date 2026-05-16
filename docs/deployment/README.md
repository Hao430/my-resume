# 部署

## 架构

```
GitHub (main 分支)
    │
    ├── ESA 自动监听 → 构建前端 → hao430.cn (CDN)
    │
    └── GitHub Actions → SSH 部署后端 → 8.156.68.107 (PM2 + Express)
```

## 前端：阿里云 ESA

GitHub 推送 `main` 分支后，ESA 自动从仓库拉取代码、构建、部署。

配置见 [`esa.jsonc`](../../esa.jsonc)。

## 后端：云服务器 + PM2

GitHub Actions 通过 SSH 将编译后的后端文件同步到服务器，安装生产依赖后 PM2 自动重启。

配置见 [服务器部署指南](server-setup.md)。
