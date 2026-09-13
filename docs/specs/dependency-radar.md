# Spec: 依赖漏洞与许可证雷达（构建期长尾页）

- **slug**: `dependency-radar` · **索引页**: `/tools/dependency-radar/` · **包页**: `/tools/dependency-radar/<system>/<package>/`
- **状态**: 已上线（这是 A1 的第一片，不含交互式检查器）
- **数据源**: `api.deps.dev` v3 + `api.osv.dev`（均免认证）

## 1. 目标场景

调研（`projects/hao430cn-tools-backlog.md` A1）结论：企业侧有 Snyk / Mend / FOSSA，CLI 侧有
Syft / OSV-Scanner，但**浏览器端、免安装、免登录的轻量版没有占位者**；且 CRA 义务 2026-09 生效，
与本站已有的 CRA 文章线咬合。

真正的长尾不在一个「检查器」，而在**每包一页**：`is lodash 4.17.20 vulnerable`、`xxx license`。
FOSSA 用 `packages/npm/*` 目录页证明了这条路有流量。用户搜索的是具体某个包，
一个动态页面永远排不上这些词，只有专属页能。

**本片只做零运行时请求的那一半**：构建期把数据抓进仓库，构建期生成静态页。
「贴 package.json 出报告」的交互式检查器是独立的第二片，另行决策（需联网 + 改隐私政策）。

## 2. 硬约束

| 约束 | 说明 |
|---|---|
| **零运行时请求** | 页面是构建期产物，访客不触发任何 API 调用。因此**不触发隐私政策更新**。 |
| **构建期不联网** | `npm run build` 绝不能打 deps.dev。抓取是独立的、手动执行的同步步骤，产物提交进仓库。**理由**：若构建期直连第三方，对方一抖动就会阻塞 ESA 部署（2026-09-12 事故的同类风险——静默的依赖）。 |
| **数据可追溯** | 每份生成数据带 `fetchedAt`，页面上标注数据时间，避免读者以为是实时。 |

## 3. 数据来源与已实测的形状

### 3.1 端点与职责划分

两个数据源分工，**不要混用**：

| 数据源 | 端点 | 负责 |
|---|---|---|
| deps.dev | `GET /v3/systems/{system}/packages/{name}` | 版本列表 |
| deps.dev | `GET /v3/systems/{system}/packages/{name}/versions/{version}` | 许可证、弃用状态、主页/仓库链接 |
| OSV | `POST /v1/query` `{package}` | 该包**全部历史**漏洞 + 受影响区间 |
| OSV | `POST /v1/query` `{package, version}` | **最新版是否受影响**（布尔答案） |

`system` 取 `npm` 与 `pypi`（OSV 的字段名是 `ecosystem`，取 `npm` / `PyPI`）。全部免认证。
每包固定 **2 次 OSV 请求**。

**为什么漏洞不用 deps.dev**：它的 `advisoryKeys` 是**按版本**的，只给"影响该版本"的集合。
实测 156 个包里 155 个的最新版是干净的，按那个语义几乎每页都显示 0 漏洞——
忠实但几乎不承载信息，也答不了「is lodash vulnerable」这类搜索意图（提问者多半拿着旧版本）。
OSV 的按包查询一次给出全部历史漏洞与受影响区间（`introduced`/`fixed`），
且带 `version` 的查询直接回答"最新版是否受影响"，**因此不需要自己实现版本区间比较**——
npm semver 与 PyPI PEP 440 规则不同，自行比较极易出错。

### 3.2 实测踩坑（**必须照做，否则数据是错的**）

1. **版本列表不排序。** lodash 返回 117 个版本，原始顺序末尾停在 `4.9.0`，而真正的最新版是
   `4.18.1`。照抄 `versions[-1]` 会得到**错误的「最新版」**。必须按 `publishedAt` 自行排序。
2. **最新版用 `isDefault: true` 标记**，不要用 semver 最大值推断（预发布版会算错）。
   实测 lodash 的 `isDefault` 唯一命中 `4.18.1`。
3. **`advisoryKeys` 是按版本的，不是按包的。** 实测 lodash：
   `4.17.20 → 5 个`、`4.17.21 → 3 个`、`4.18.1 → 0 个`。
   这决定了页面的核心语义（见 4.3）。
4. **OSV 的严重度是分类标签，不是分数。** `severity[].score` 给的是 CVSS **向量**
   （`CVSS:3.1/AV:N/...`），需要解析才能得到数值；而 `database_specific.severity` 直接给
   `LOW` / `MODERATE` / `HIGH` / `CRITICAL`。用后者。**两个字段都可能缺失**，必须有「未知」兜底。
5. **OSV 的受影响区间是事件数组**，形如 `[{introduced: '4.0.0'}, {fixed: '4.17.21'}]`，
   事件类型除 `introduced` / `fixed` 外还有 `last_affected`。页面**只把区间渲染成文字**，
   不做任何版本比较（见 3.1 末尾的理由）。

### 3.3 生成的数据模型

每个包一份 `src/data/deps/<system>/<slug>.json`：

```jsonc
{
  "system": "npm",
  "name": "lodash",
  "slug": "lodash",
  "path": "/tools/dependency-radar/npm/lodash/",
  "latest": "4.18.1",
  "publishedAt": "2026-04-01T21:01:20Z",
  "licenses": ["MIT"],
  "deprecated": false,
  "deprecatedReason": "",
  "versionCount": 117,
  "homepage": "https://lodash.com/",       // 缺失则省略
  "repo": "https://github.com/lodash/lodash",
  "latestAffected": false,                 // 由带 version 的 OSV 查询直接得出，不做版本比较
  "vulnerabilityCount": 10,                // 历史总数；列表被截断后**仍然准确**
  "severityCounts": { "HIGH": 3, "MODERATE": 5, "UNKNOWN": 2 },
  "vulnerabilities": [                     // 历史漏洞，按 4.6 排序并截断
    {
      "id": "GHSA-29mw-wpgm-hmr9",
      "aliases": ["CVE-2020-28500"],
      "summary": "Regular Expression Denial of Service (ReDoS) in lodash",
      "severity": "MODERATE",              // LOW|MODERATE|HIGH|CRITICAL，缺失为 null
      "published": "2022-01-06T20:30:46Z",
      "ranges": [{ "introduced": "4.0.0", "fixed": "4.17.21" }]
    }
  ],
  "fetchedAt": "2026-09-13"
}
```

另生成一份聚合索引 `src/data/deps/index.json`，供索引页与客户端检索使用，**只含摘要**
（system / name / slug / path / latest / licenses / latestAffected / vulnerabilityCount /
highestSeverity / deprecated），**不含漏洞明细**。

实测理由：156 个包的完整记录是 1.5 MB（gzip 120 KB），整个塞进客户端 bundle 太重；
摘要只有 59 KB（gzip 5 KB）。明细按包分文件、由页面按需动态加载。

## 4. 页面规则

### 4.1 索引页 `/tools/dependency-radar/`

列出全部已收录包，按 `system` 分组，显示：名称、最新版、许可证、`最新版漏洞数`。
支持按名称过滤（纯前端）。顶部标注数据抓取时间与收录范围（**不是全量索引**，见非目标）。

### 4.2 包页 `/tools/dependency-radar/<system>/<name>/`

必须呈现：包名、生态、最新版号与发布日期、许可证、是否弃用（含原因）、版本总数、
主页与源码链接、**历史漏洞清单（含每条的影响区间）**，以及在列表被截断时指向 OSV 完整列表的链接。

### 4.3 漏洞语义（最容易写错，务必守住）

页面要**同时**呈现两个不同的事实，并让读者一眼分清：

1. **这个包历史上有多少已知漏洞**（`vulnerabilityCount`，含已修复的。
   **注意不能用 `vulnerabilities.length`**——列表按 4.5 截断后它只是显示条数）
2. **当前最新版是否受影响**（`latestAffected`）

正例（lodash）：`lodash 有 10 个已知漏洞；最新版 4.18.1 不受影响。`

必须守住的几条：
- **不得**把「最新版不受影响」表述为「这个包安全」。前者是事实，后者是误导——
  读者手里的旧版本可能正在受影响区间内。这是本工具最基本的诚实性要求。
- **不得**只显示数量而不给区间。漏洞条目必须带上受影响区间（渲染成文字，
  如 `>=4.0.0 <4.17.21`），读者才能自己对照手里的版本。
- 列表被截断时，**不得**让读者以为列出的就是全部：须同时给出总数与 OSV 完整列表入口（见 4.5）。
- 历史漏洞为 `0` 时才可说「无已知漏洞记录」；为 `0` 时**不要**下"安全"的结论。
- 页面必须标注数据抓取时间——漏洞库持续更新，静态页会过时。

### 4.4 作用域包（npm scoped）

`@angular/core` 这类包：URL 中**去掉前导 `@`，保留 `/` 作为路径分隔符**，即
`/tools/dependency-radar/npm/angular/core/`。数据文件名同理。

**路由必须用可重复参数**，否则作用域包会 404：普通包是两段（`/npm/lodash/`），
scoped 包是三段（`/npm/angular/core/`），而 `/tools/dependency-radar/:system/:name`
匹配不了三段。vue-router 4 用 `:pkg+`：

```ts
{ path: '/tools/dependency-radar/:system/:pkg+', component: DependencyPackagePage }
// route.params.pkg 是 string[]；join('/') 后，npm 下补回前导 '@' 还原真实包名
```

`pypi` 的包名不含 `/`，永远只有一段，同一套路由可覆盖两种生态。

### 4.5 列表排序与上限（防单页过大）

**问题**：实测 tensorflow 有 861 条历史漏洞，单文件 614 KB，页面还要渲染 861 张卡片——
下载与渲染都是负担。而 861 条 CVE 对读者也不是信息，是噪声。

**规则**：
- 每包**最多存 50 条**漏洞条目，按 `severity` 降序 → `published` 降序 → `id` 升序排序后截断。
  末位用 `id` 兜底是为了**排序确定**：否则每次同步的产物顺序可能不同，git diff 会满是噪声。
- `vulnerabilityCount` 始终是**历史总数**，截断不影响它——绝不能让读者以为只有 50 条。
- 必须有 `severityCounts`，让被截断时的严重度分布仍然可见。
- 被截断时（`vulnerabilityCount > vulnerabilities.length`）页面**必须**给出指向
  OSV 完整列表的链接：`https://osv.dev/list?q=<name>&ecosystem=<ecosystem>`（实测可用）。

**选 50 的依据**（实测分布）：156 个包中仅 6 个超过 50 条、3 个超过 100 条。
截断到 50 后明细总体积从 1.8 MB 降到 0.51 MB，最大单文件从 614 KB 降到约 36 KB。

### 4.6 空数据

某包抓取失败（404 / 网络错误）时：**从生成数据中整体略去**，并在同步脚本结束时列出失败清单。
不得写入半成品数据，也不得让构建失败。

## 5. 包清单

首批 **~100 个**（npm + PyPI），人工精选，落在 `scripts/deps-seed.json`。

**选取标准**：知名度高、常见于安全公告与教程、跨生态分布、覆盖「人们会去搜它有没有漏洞」的包。
典型如 `lodash` / `react` / `express` / `axios` / `@angular/core` / `requests` / `django` / `flask`。

**为什么是人工精选**：没有免费的「热门包排行」API（npm 的 downloads 端点只能查已知包的下载量，
不能排名；libraries.io 需要 key）。所以首批必然是人选，这一点必须对读者诚实——
索引页要说明收录范围，不能让读者以为查不到就是不存在。

扩充只需改 `scripts/deps-seed.json` 再跑一次同步。

## 6. 非目标（明确不做）

- **不做交互式检查器**（贴 `package.json` → 出报告）。那是第二片，需联网 + 改隐私政策。
- **不做全量 npm / PyPI 索引**。首批 100 个是精选子集，索引页会明说这一点。
- **不做逐版本漏洞矩阵**（列出每个版本各自命中哪些漏洞）。只做「全部历史漏洞 + 每个漏洞的受影响区间」
  这一个切面；区间以文字呈现，程序不做版本比较（见 3.1）。
- **不做依赖树分析**（传递依赖的漏洞）。deps.dev 的 `dependencies` 端点可支持，但那是另一个工具。
- **不做定时自动更新**。数据靠手动跑同步脚本刷新；过时由页面上的时间标注暴露。

## 7. 已知限制

1. **数据会过时**：新披露的漏洞不会自动出现在已生成的静态页上，需重跑同步。
2. **只覆盖最新版**：用户手里的旧版本可能比页面显示的更危险——页面必须避免暗示相反结论。
3. **收录范围有限**：精选 156 个包，查不到的包不代表不存在。
4. **漏洞列表每包最多 50 条**（见 4.5）：超出部分只能去 OSV 查看，页面会给出入口与总数。
4. **构建体积**：100 个包页 + 索引。索引会进客户端 bundle，须保持轻量（只放列表展示所需字段）。

## 8. 验收标准

- 同步脚本：可重复执行；对已存在的包做增量更新；失败包不写入且被执行摘要列出。
- 数据正确性：断言 lodash 的 `latest === '4.18.1'`（守 3.2 的排序坑）；断言 `@angular/core`
  的 slug 映射为 `angular/core`；断言 `pickLatestVersion` 读的是 `versionKey.version`
  而不是扁平字段（曾因此 16 个测试全绿而实际全量抓取失败）。
- 漏洞语义：断言 lodash 的 `latestAffected === false` 且 `vulnerabilityCount > 0`
  （两个事实同时成立，正是 4.3 要守的场景）；断言严重度缺失时落为 `null` 而非报错。
- 截断（4.5）：断言超过上限的包其 `vulnerabilities.length === 50` 而 `vulnerabilityCount` 保持原值；
  断言排序确定（同一输入两次排序结果一致）；断言被截断的页面渲染出 OSV 完整列表链接。
- 构建：`npm run build` **不产生任何网络请求**（可用断网或 spy 验证）。
- 产物：每个包页有独立 `dist/tools/dependency-radar/<system>/<name>/index.html`，
  标题/描述/canonical 正确；全部进 sitemap。
- 语义：最新版无漏洞的包，页面文案为「无已知漏洞」而非「安全」（守 4.3）。
- i18n：中英键数对齐；英文页不含中文。
- 路由：`/tools/dependency-radar/`、`/tools/dependency-radar/npm/lodash/` 直链可达。

## 9. 接线

| 位置 | 作用 |
|---|---|
| `scripts/deps-seed.json` | 首批包清单（同步脚本的输入） |
| `scripts/sync-deps.ts` | 抓取 → 写 `src/data/deps/`；**不参与 build**（Node 原生类型擦除直接运行） |
| `src/data/deps/*.json` | 生成的数据，随仓库提交 |
| `src/data/tools.ts` | 工具 slug 改为 `dependency-radar`（须与 `DEPENDENCY_RADAR_SLUG` 一致，否则卡片链到不存在的页面）、status 改为 `active` |
| `src/data/site-pages.ts` | 由数据派生索引页 + 每个包页的 `StaticPage` |
| `src/pages/tools/DependencyRadar*.vue` | 索引页与包页组件 |
| `src/router/index.ts` | `/tools/dependency-radar` 与 `/tools/dependency-radar/:system/:name` |

页面清单由数据驱动（100 个包不可能手写进 `site-pages.ts`），这是本工具与
`markdown-cleaner` 在接线上的主要差别。
