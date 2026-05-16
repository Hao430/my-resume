# API 接口规范

> Express 后端 API 定义。基准路径：`/api`，Content-Type：`application/json`。

## 错误格式

```json
{ "error": "描述信息", "details": {} }
```

---

## Resume

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/resume` | 全部简历数据（合并所有 section） |
| GET | `/api/resume/:section` | 单段数据 |

### `GET /api/resume`

```json
{
  "personalInfo": { ... },
  "professionalSummary": { ... },
  "skills": [ ... ],
  "projectExperiences": [ ... ],
  "workExperiences": [ ... ],
  "honors": [ ... ]
}
```

### `GET /api/resume/skills`

```json
{ "section": "skills", "data": [ ... ] }
```

---

## Blog Posts

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/posts` | 列表，支持 `?tag=xxx` |
| GET | `/api/posts/:slug` | 单篇详情 |
| POST | `/api/posts` | 新增 |
| PUT | `/api/posts/:slug` | 更新 |
| DELETE | `/api/posts/:slug` | 删除 |

### `GET /api/posts`

```json
[
  { "slug": "...", "title": "...", "description": "...",
    "date": "2026-04-09", "tags": ["工具"], "external_url": null }
]
```

### `GET /api/posts/harness-gong-ju-tuijian`

```json
{
  "slug": "harness-gong-ju-tuijian",
  "title": "Harness开发范式的工具推荐",
  "description": "分享我在日常开发中使用的效率工具...",
  "date": "2026-04-09",
  "tags": ["工具", "效率", "AI"],
  "content_html": "<h1>...</h1>"
}
```

### `POST /api/posts`

请求体：
```json
{
  "title": "新文章",
  "description": "摘要",
  "date": "2026-05-01",
  "tags": ["标签1"],
  "content_html": "<p>正文</p>"
}
```
返回 `201` + 创建的完整对象。

---

## Daily Briefs

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/briefs` | 列表（日期倒序） |
| GET | `/api/briefs/:date` | 详情 |

### `GET /api/briefs`

```json
[
  { "date": "2026-05-14", "title": "每日早参标题",
    "display_date": "5月14日 周四" }
]
```

### `GET /api/briefs/2026-05-14`

```json
{
  "date": "2026-05-14",
  "title": "每日早参标题",
  "display_date": "5月14日 周四",
  "content_html": "<h1>...</h1>"
}
```

---

## Slides

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/slides` | 列表 |
| GET | `/api/slides/:slug` | 详情 |

### `GET /api/slides`

```json
[
  { "slug": "xin-fazhan-linian", "title": "新发展理念的个人视角",
    "description": "...", "page_count": 8, "date": "2026-04-09" }
]
```
