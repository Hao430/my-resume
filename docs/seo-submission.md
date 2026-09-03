# 搜索引擎提交清单（一次性的 10 分钟）

站点已经把"能被收录"的部分做完了：`/sitemap.xml`（43 条 URL，构建期自动生成）、
`/robots.txt` 指向它、每篇文章有独立 head、中英文各一份 RSS。
剩下的动作只有**告诉搜索引擎去抓**，其中只有 Google 需要老板本人账号。

## 1. Bing / Yandex / Naver —— 我现在就能做（免账号）

站点根目录已发布 IndexNow key 文件：`https://hao430.cn/02866a4aed2a4b1fb137f69a4c11cbc5.txt`

```bash
cd /root/dev/my-resume && npm run build && npm run indexnow
```

- 一次推送 sitemap 里的全部 URL，Bing 系通常几分钟内开始抓取
- **顺手做**：打开 https://www.bing.com/webmasters → "Verify a site" → 选 **IndexNow key 验证**，
  不需要 Microsoft 账号，也不用改代码；验证后能在 Bing 里看收录状态与反向链接

## 2. Google —— 需要老板授权（二选一）

### 方式 A：域名资产（推荐，一次到位）

1. 打开 https://search.google.com/search-console/about → 添加资产 → 选 **域名** → 输入 `hao430.cn`
2. Google 会给一条 **TXT 记录**，需要老板在域名 DNS（阿里云 DNS）里加一条
   `_googlehosted=...` 的 TXT；加完点验证（几分钟到几十分钟生效）
3. 验证后：资产 → **Sitemaps** → 提交 `https://hao430.cn/sitemap.xml`
4. 左侧 **网址检查** 里对首页和 `/blog/` 各点一次"请求编入索引"

> 域名资产的好处：以后换托管（比如迁 Cloudflare Pages）验证仍然有效。

### 方式 B：URL 前缀资产（不用改 DNS，5 分钟）

1. Search Console → 添加资产 → 选 **网址前缀** → `https://hao430.cn/`
2. 选"替代验证方法" → **HTML 标记**：把给的 `<meta name="google-site-verification" content="XXXX">`
   发我，我加进 `index.html` 的 head 并提交（一行改动，走正常发布流程）
3. 验证通过后同样提交 sitemap

### 我需要老板给我的东西

- 方式 A：DNS 权限（或让老板自己加那条 TXT）
- 方式 B：只要那串 `content="..."` 的验证码，其余我来

## 3. 其他低成本入口（海外流量）

| 渠道 | 动作 |
|------|------|
| GitHub Profile README | 放站点链接 + `/feed.xml`，GitHub 权重高 |
| X / Twitter | 个人简介挂站点；发文章时带上 OG 卡片（已配置，会自动出图） |
| Hacker News | `Ask HN` 或发技术文（AI Agent 权限那篇是天然选题） |
| dev.to / Hashnode | 支持"从 RSS 导入"，把 `/feed-en.xml` 填进去即可自动同步英文文章，白捡海外分发 |
| Feedly / Inoreader | 提交 `/feed.xml`、`/feed-en.xml`，订阅读者从这里进来 |
| 中文侧 | 百度站长（已有 `baidu-site-verification`）主动推送 sitemap；知乎/公众号文末挂链接 |

## 4. 自查命令

```bash
curl -sI https://hao430.cn/sitemap.xml | head -3
curl -s https://hao430.cn/robots.txt
curl -sI https://hao430.cn/02866a4aed2a4b1fb137f69a4c11cbc5.txt | head -1
curl -s https://hao430.cn/feed-en.xml | grep -c '<item>'
```
