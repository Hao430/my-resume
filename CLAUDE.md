# 开发规范

## 项目定位

个人网站 + 博客（https://hao430.cn），**纯静态**：无后端、无数据库、无运行时 API 请求。
构建产物 `dist/` 由阿里云 ESA Pages 自动构建部署（全球加速，海外走境外边缘节点）。

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Vue 3 + TypeScript（`<script setup>`） |
| 构建 | Vite 7 + vue-tsc |
| 状态 | Pinia（store 只包装构建期数据，不发请求） |
| 路由 | Vue Router history 模式（ESA `notFoundStrategy: singlePageApplication` 兜底） |
| 国际化 | vue-i18n（zh / en，按浏览器语言自动选择，可手动切换） |
| 内容 | `content/posts/*.md`，构建期打包进 bundle |
| 包管理 | **npm**（唯一 lockfile：`package-lock.json`） |

## 目录

```
src/
  components/  通用组件（MarkdownRenderer 渲染文章正文）
  pages/       页面组件
  stores/      blog.ts / resume.ts / slides.ts —— 全部基于静态数据
  data/        resume.ts（手写）、slides.ts（手写）、dailyBriefs.ts（构建期生成）
  utils/       markdown.ts（frontmatter/渲染）、post-catalog.ts（目录构建+双语合并）、
               format.ts（日期/XML）、seo.ts（运行时 head 修正）、site.ts（站点常量）
  i18n/locales/ zh.json / en.json / resume-en.json
content/posts/  文章（发文章只改这里；foo.en.md 是 foo.md 的英文伴生版本）
public/         静态资源；每日早参在 public/每日早参/
build/          static-site.ts：Vite 插件，构建期产出 RSS / sitemap / 预渲染 head
scripts/        new-post.mjs、sync-daily-briefs.cjs
```

## 命名规范

| 领域 | 规范 | 示例 |
|------|------|------|
| 文件 / 目录 | kebab-case | `blog-page.vue`、`post-catalog.ts` |
| 组件名 | PascalCase 多单词 | `MarkdownRenderer` |
| 函数 / 变量 | camelCase | `visiblePosts()`、`readingMinutes` |
| frontmatter（作者手写） | snake_case 对外契约 | `title_en`、`external_url` |
| frontmatter 解析后的内部字段 | camelCase | `titleEn`、`externalUrl` |
| 文章 slug / 任意 URL | ASCII 小写短横线，**禁止中文** | `ai-coding-next` |
| 页面 URL | 统一带尾斜杠，与 canonical / sitemap 一致 | `/blog/ai-coding-next/` |

## 硬性规则

1. **禁止任何运行时后端请求**（`fetch('/api/...')` 一律视为回归）。数据要么在 `content/`、
   `public/`，要么由构建脚本生成到 `src/data/`。
2. **不要在组件之外实例化用了 `useI18n()` 的 store**（例如 `main.ts` 预热）。
   Pinia setup store 里没有组件实例，`useI18n()` 会抛
   `Must be called at the top of a setup function` 并让整页白屏；
   需要语言时读 `i18n.global.locale`（见 `stores/resume.ts` 注释）。
3. **一个 slug 只有一个 URL**：译文写成伴生文件 `slug.en.md`，不要 `slug-en.md`（会产生重复内容）。
4. 旧的独立 HTML（`public/*.html`）若要并入文章体系，就在文章 frontmatter 写
   `legacy: [/旧页面.html]`，构建时会给旧页面补 canonical 指回 `/blog/<slug>/`。
5. i18n 文案里**不要出现裸 `|`**（vue-i18n 当复数分隔符）；站点名带竖线的用 `utils/site.ts` 常量拼接。
6. zh.json 与 en.json 的键必须一一对应（缺键会在页面上直接显示 key）。
7. `npm run check`（lint + type-check + build）必须全绿才能推送；CI 与 githooks 都会拦。
8. TypeScript：strict + `noUncheckedIndexedAccess`，下标/正则分组要显式处理 undefined。
9. 缩进 2 空格、UTF-8、LF（`.editorconfig`）。

## 常用命令

```bash
npm run dev                                      # 本地开发
npm run new-post -- "标题" --slug=english-slug    # 新建文章（默认 draft: true）
npm run lint && npm run type-check               # 质量检查
npm run build                                    # 生成早参清单 → 类型检查 + 构建 + 可发现性资产
npm run preview                                  # 构建后本地验证（含 /blog/<slug>/ 预渲染页）
```

## 部署与验证

- 远程 SSH：`git@github.com:Hao430/my-resume.git`，主分支 `main`
- 推 `main` → GitHub Actions（质量检查 + 构建）与阿里云 ESA（自动构建部署）并行触发
- 部署后自查：
  ```bash
  curl -sI https://hao430.cn/blog/<slug>/ | head -3        # Server: ESA
  curl -s https://hao430.cn/feed.xml | grep -c '<item>'    # 篇数对得上
  curl -s https://hao430.cn/sitemap.xml | grep -c '<loc>'  # 页面 + 文章 + 早参
  ```
