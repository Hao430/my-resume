# 怎么在 hao430.cn 上发文章

纯静态站点，**一篇文章 = 一个 Markdown 文件**。没有后台、没有数据库：写完提交，推 `main` 即发布。

## 3 步发布

```bash
cd /root/dev/my-resume

# 1. 生成骨架（会强制校验 slug 是 ASCII 短横线）
npm run new-post -- "我怎么看 AI 编程的下一步" --slug=ai-coding-next --tags=AI,开发工具

# 2. 写正文：编辑 content/posts/ai-coding-next.md
npm run dev      # 本地预览 http://localhost:5173/blog/ai-coding-next/

# 3. 发布：把 frontmatter 的 draft 改成 false
git add content/posts/ai-coding-next.md
git commit -m "post: ai coding next"
git push origin main      # 阿里云 ESA 自动构建部署到 https://hao430.cn（海外走境外边缘节点）
```

改完想先自检：`npm run check`（lint + type-check + build，和 CI 一致）。

## frontmatter 字段

```yaml
---
title: 中文标题                 # 必填
title_en: English Title         # 建议：英文列表 / 英文 RSS / 分享卡片
description: 一句话摘要          # 必填：列表摘要 + meta description + OG 描述
description_en: Short summary   # 建议
date: 2026-09-03                # 必填，YYYY-MM-DD
updated: 2026-09-05             # 可选，改过内容就填（影响 RSS / sitemap lastmod）
tags: [AI, 开发工具]             # 也支持多行 `- 标签`
tags_en: [AI, DevTools]         # 可选
lang: both                      # zh | en | both，默认 both：控制出现在哪一侧的列表
external_url: /some.html        # 可选：整篇指向 public 下现成的 HTML
cover: /images/xxx.png          # 可选：分享卡片配图（缺省 /og-image.png）
draft: true                     # true 时构建产物完全不含这篇
---
```

`title_en` / `description_en` / `tags_en` 只是「元数据翻译」：英文访客在列表和分享卡片上
看到的是英文，正文仍是原文，页面顶部会提示「原文为中文」。

## 海外优先：新文章默认双写

站点的战略是**先服务海外读者**，所以新文章的推荐顺序是：

1. 先写英文版，作为无后缀的原始文件（`foo.md`）——它决定 URL slug、预渲染 head、`og:locale`
2. 再写中文版 `foo.zh.md`
3. 反过来也行（中文原始 + `foo.en.md`），已有文章就是这种做法

这样英文侧不只是"标题被翻译"，而是**同一 URL 下的完整英文正文**，
英文读者从 `/feed-en.xml` 订到的也是全文。

## 想要真正的英文版正文：写伴生文件

在同目录放 `文章slug.en.md`（或 `文章slug.zh.md`），它会与 `文章slug.md` 合并成**同一个 URL**（不会多出一份重复内容）：

```
content/posts/ai-agent-permission-management.md      # 英文原文（决定 slug 与 head）
content/posts/ai-agent-permission-management.zh.md   # 中文正文，同一条 URL
content/posts/harness-development-paradigm.md        # 中文原文
content/posts/harness-development-paradigm.en.md     # 英文正文
```

伴生文件里直接写 `title` / `description` / `tags`（就是本语言的版本）；
`title_en` / `title_zh` 这类字段只在"只翻译元数据、不翻译正文"时用作兜底。

伴生文件写的是该语言版本的完整正文，`title` / `description` / `tags` 就是该语言的文案。
两个方向都支持：中文原文配 `foo.en.md`，或英文原文配 `foo.zh.md`。
**但不要**同时存在 `foo.en.md` 和另一个 `foo-en.md`——后者会被当成另一篇文章，制造重复内容。
`/feed.xml`（中文侧）与 `/feed-en.xml`（英文侧）会自动分别收录。

参考实现：`ai-agent-permission-management.md` + `.zh.md`、`harness-development-paradigm.md` + `.en.md`。

## 旧的独立 HTML 文章

`public/*.html` 里那几篇早期文章（`如何发现生活中的需求.html` 等）已经有对应的 Markdown 版本。
在 md 里写 `legacy: [/如何发现生活中的需求.html]`，构建时会给旧 HTML 注入
`<link rel="canonical" href="https://hao430.cn/blog/discover-needs-in-life/">`，
老链接继续能打开，搜索权重归并到新地址，不会出现重复内容。

## 写作约束（海外可访问性）

- **slug 只用 ASCII 小写短横线**：`/blog/ai-coding-next/`。中文文件名会变成
  `%E6%AF%8F%E6%97%A9%E5%8F%82` 这类转义 URL，Google 与 X/Telegram 抓取都吃亏。
- URL **统一带尾斜杠**，与 canonical、sitemap 保持一致。
- 图片放 `public/images/`，相对路径引用；构建时自动加 `loading="lazy"`。
- 正文**不允许内嵌 HTML**（渲染器 `html: false`，防 XSS 与样式污染）；
  外链自动补 `target="_blank" rel="noopener noreferrer"`。
- 二三级标题自动获得锚点 id；超过 2 个标题时页面显示目录。

## 构建期自动生成（别手改）

| 产物 / 文件 | 生成者 | 说明 |
|------|--------|------|
| `dist/feed.xml`、`dist/feed-en.xml` | `build/static-site.ts` | RSS 2.0，全文 `content:encoded`，Feedly / Inoreader 等可直接订阅 |
| `dist/briefs.xml` | 同上 | 每日早参订阅源 |
| `dist/sitemap.xml` | 同上 | 主页面 + 每篇文章 + 每期早参，`lastmod` 取 frontmatter 日期 |
| `public/og/<slug>.png` | 同上（本机有时） | 英文文章的专属分享图；构建环境没有 librsvg 时用仓库里已提交的这张 |
| `dist/blog/<slug>/index.html` | 同上 | 每篇文章独立 head（title / canonical / OG / Twitter / JSON-LD BlogPosting），不执行 JS 的抓取器也能拿到摘要 |
| `dist/briefs/YYYY-MM-DD/index.html` | 同上 | 早参的 ASCII 路径副本；`public/每日早参/` 原件保留并补 canonical |
| `dist/robots.txt` | 同上 | 指向 sitemap（`public/robots.txt` 只是开发期占位，构建时会被覆盖） |
| ~~`public/sitemap.xml`~~ | — | 已删除：sitemap 只由构建生成，避免仓库里留一份过期的和线上打架 |
| `src/data/dailyBriefs.ts` | `scripts/sync-daily-briefs.cjs` | 早参清单 |

解析逻辑只有一份：`src/utils/markdown.ts` + `src/utils/post-catalog.ts`，
浏览器端（`src/stores/blog.ts`）与构建脚本共用，避免「站内 4 篇、RSS 3 篇」的漂移。

## 收录提交（海外搜索引擎）

| 引擎 | 方式 | 状态 |
|------|------|------|
| Bing / Yandex / Naver / Seznam | **IndexNow**：站点根目录已放 key 文件，构建后执行 `node scripts/submit-indexnow.mjs` | 免账号，可立即推送全部 URL |
| Google | Google Search Console → Sitemaps → 提交 `https://hao430.cn/sitemap.xml` | 需老板登录账号（见 `docs/seo-submission.md`） |
| Bing Webmaster Tools | 可用 IndexNow key 直接验证站点所有权，无需 Microsoft 账号 | 建议顺手做 |

## 专属分享图（OG image）

- 只有**标题为拉丁字符**的文章会生成带自身标题的分享图（X / LinkedIn 上带标题的卡片点击率明显更高）。
- 本机构建装了 librsvg 时会自动重绘并写回 `public/og/`，记得连同图片一起提交。
- **ESA 构建容器没有 librsvg**，所以这些图必须提交进仓库；只改标题不提交图片时，线上会继续用上一张。
- 中文标题一律使用品牌图 `/og-image.png`（构建容器不保证有中文字体，避免渲染成豆腐块）。

## 每日早参（HTML 流水）

把 `article_YYYYMMDD.html` 放进 `public/每日早参/`，然后 `npm run build`（或 `npm run sync-daily-briefs`）
就会出现在早参页与 `briefs.xml` 中，标题取自文件里的 `<title>`。
