# Spec: AI 输出清理器 · Markdown 工具箱

- **slug**: `markdown-cleaner` · **URL**: `/tools/markdown-cleaner/`
- **状态**: 已上线（首个工具）
- **对应实现**: `src/utils/text-clean.ts`、`src/pages/tools/MarkdownCleanerPage.vue`
- **对应测试**: `src/__tests__/text-clean.test.ts`、`src/__tests__/markdown-cleaner-page.test.ts`

> 本 spec 是回写的：实现先于 spec 完成，规则边界当时是被测试逼出来的。
> 后续工具请按 CLAUDE.md 的要求**先写 spec 再写实现**。

## 1. 为什么做这个工具

调研结论（`projects/hao430cn-tools-backlog.md` B8）：通用「去 Markdown」是**有量无痛感**的填空页——
GitHub 上 42–706 个仓库、StackOverflow 存量仅 2–12，说明不难、只是懒得写脚本，因此无留存、无付费意愿。
差异化不在「去格式」本身，而在**组合清理**：把 AI 回答从「能读」变成「能直接贴」。

需求语言的实证：`markdowntools.io` 明确以 "including ChatGPT and Claude answers" 为卖点，
验证需求来自 **AI 输出清洗**，而非文档工程。

## 2. 目标场景

从 ChatGPT / Claude / Notion / Word 复制出来的内容，贴进公众号、知乎、邮件或 Word 编辑器时
带格式残留。用户需要一步得到干净文本。

**核心承诺（对应卡片文案）**：去 Markdown 格式 / 去 emoji / 压缩多余空行 / 规范中英标点全半角 /
HTML 与 Markdown 互转 / 适配公众号·知乎·Word 直贴。

## 3. 硬约束

| 约束 | 说明 |
|---|---|
| **零网络请求** | 全部在浏览器本地完成，粘贴内容不上传任何服务器。因此不触发隐私政策更新。 |
| **零运行时依赖** | 不使用 `remove-markdown` / `turndown` 等库，避免引入 lockfile 变更面。 |
| **剪贴板只出不进** | 只提供「复制结果」，不读取用户剪贴板。 |

## 4. 清理规则（测试断言的即此表）

### 4.1 stripMarkdown —— 去语法，保文字

| 输入 | 输出 | 说明 |
|---|---|---|
| `# 标题` | `标题` | ATX 标题，去 `#` |
| `> 引用` | `引用` | 去引用标记 |
| `- 项` / `1. 项` | `项` | 去列表标记（不生成 bullet） |
| `**粗**` `*斜*` `~~删~~` | `粗` `斜` `删` | 强调与删除线 |
| `[文字](url)` | `文字` | 链接**只留文字**，URL 丢弃 |
| `![alt](url)` | `alt` | 图片留 alt |
| `` `code` `` | `code` | 行内代码去反引号 |
| ```` ```lang … ``` ```` | 代码内容（围栏行移除） | 语言标注行丢弃 |
| `\*` | `*` | 反转义 |

**边界（重要，勿回归）**：
- `snake_case` / `file_name.txt` 里的下划线**不得**被当作斜体标记。
  判定：`_` 仅在其两侧都不是 `[A-Za-z0-9_]` 时才成对匹配。
- 水平线 `---` 必须在**无序列表之前**处理，否则会被吃掉成列表项。
- 表格分隔行 `\|---\|---\|` 整行移除；表格数据行的 `|` 换成**两个空格**。
- `stripMarkdown` **只去语法，不做空白整理**——围栏行留下的空行属于 `trimLines` 的职责。

### 4.2 removeEmoji

移除 `\p{Extended_Pictographic}`、肤色修饰符（U+1F3FB–U+1F3FF）、变体选择符（U+FE0E/FE0F）与零宽连接符（U+200D）。
**不得**误伤中日韩文字、全角括号、破折号与 `%` 等普通符号。

### 4.3 stripHtmlTags

`script` / `style` 连同内容丢弃；`<br>` 转 `\n`；块级闭合标签（p/div/li/h1-6/tr/blockquote…）转 `\n`；
其余标签直接去除；常见实体（`&amp;` `&lt;` `&gt;` `&quot;` `&#39;` `&nbsp;`）解码。

### 4.4 空白

- `collapseBlankLines(input, maxBlank = 1)`：连续 3 个以上换行压缩为 `maxBlank + 1` 个换行。
- `trimLines`：去每行首尾空白，并去掉整段首尾空行。

### 4.5 标点与全半角

- `normalizeCjkPunctuation`：**仅当半角标点紧跟中日韩字符之后**才转全角（`,.?!:;` → `，。？！：；`）。
  `Hello, world.` 必须保持原样——这是该规则存在的全部意义。
- `toHalfWidth` / `toFullWidth`：全角 ASCII（U+FF01–FF5E）与半角 ASCII（U+0021–007E）互转，U+3000 与空格互转。

### 4.6 cleanText —— 组合入口与执行顺序

顺序有意为之，不可随意调整：

```
stripHtml → stripMarkdown → removeEmoji → toHalfWidth → normalizeCjkPunctuation → trimLines → collapseBlankLines
```

- 先剥 HTML 再剥 Markdown：AI 输出常是 HTML 里嵌 Markdown。
- 标点规范化放末尾：避免中间步骤产生的符号被二次转换。
- 空白处理放最后：前面的步骤会引入新的空行。

### 4.7 htmlToMarkdown

基于浏览器原生 `DOMParser`。覆盖：h1–h6、p/div/section/article、strong/b、em/i、del/s、code、pre、
a（纯锚点 `#` 不产生链接）、img、ul/ol/li（嵌套缩进）、blockquote、hr、table（生成表头分隔行）。
`script`/`style`/`noscript` 丢弃。无 `DOMParser` 环境（如构建期）回退到 `stripHtmlTags`。

## 5. UI 行为

- 输入即实时输出（`computed`，无防抖）。
- 7 个清理开关，默认值见 `DEFAULT_CLEAN_OPTIONS`；开关顺序即 `OPTION_FIELDS` 顺序。
- 「载入示例」填入 `tools.cleaner.sampleText`（含 Markdown、emoji、连续空行、链接、引用、列表）。
- 「HTML 转 Markdown」**就地改写输入框**，便于二次清理。
- 「清空」清空输入并复位复制状态。
- 统计：`输入 N 字 → 输出 M 字 · 减少 X%`，输入为空时缩减比例记为 0。
- 复制成功后按钮文案变「已复制」并在 1.6s 后复位。

## 6. 非目标（明确不做）

- **不做 token 计数**——用户 2026-09-12 明确推迟（原计划是 A2 工具）。
- 不做 Markdown 渲染 / 预览。
- 不做 PDF / Word / docx 导出。
- 不做服务端处理或任何上传。
- 不做「粘贴 URL 抓取并转换」——受 CORS 限制，纯前端不可行。

## 7. 已知限制

1. **HTML→Markdown 对复杂表格不稳**：`rowspan` / `colspan` 会丢失，深度嵌套结构可能失真。自写序列化器
   的取舍，如需更强应换 `turndown`（MIT）。
2. **实时计算无防抖**：典型 AI 输出（几 KB）无感，几百 KB 输入会卡顿。
3. **复制在无剪贴板权限时静默失败**：有 try/catch，但用户看不出区别（只是不显示「已复制」）。
4. **`_` 词边界判定基于 ASCII**：`中文_英文_中文` 这类 CJK 相邻下划线可能不被识别为斜体。

## 8. 架构接线（新增工具时照此）

| 位置 | 作用 |
|---|---|
| `src/data/tools.ts` | 工具元数据单一来源（slug / i18nKey / tags / status） |
| `src/data/site-pages.ts` | 由 `LIVE_TOOLS` 派生预渲染外壳与 sitemap 条目 |
| `src/router/index.ts` | 路由 `/tools/<slug>` + `meta.titleKey` |
| `src/i18n/locales/{zh,en}.json` | `tools.items.<i18nKey>.*`、`tools.<tool>.*`、`seo.<key>` |

只有 `status === 'active'` 的工具会生成页面、外壳与 sitemap 条目。
