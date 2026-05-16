# 前后端分离改造计划

> 将当前 Vue + Vite 纯静态简历站点改造为 Express + PostgreSQL 前后端分离架构。

---

## Level 1 · 30 秒概览

**做什么**：新增 Express 后端和 PostgreSQL 数据库，将硬编码的简历/博客/早参/幻灯片数据从前端代码中剥离，改为 API 获取。

**为什么做**：解决静态站点无法在线更新内容的问题——改简历、发博客不再需要重新构建部署，直接操作数据库即可。

**工作量**：5 个阶段，约 **9.5 小时**。

---

## Level 2 · 阶段路线图

```
Phase 1 ─── Phase 2 ─── Phase 3 ─── Phase 4 ─── Phase 5
搭建基础     数据迁移     API 开发     前端改造     配置收尾
 1.5h         1.5h        2h           3h          1.5h
```

| 阶段 | 核心产出 | 依赖 |
|------|---------|------|
| **1. 基础设施** | Express 项目骨架 + PostgreSQL 容器 + 表创建 | 无 |
| **2. 数据迁移** | 种子脚本，将现有数据写入数据库 | Phase 1 |
| **3. API 开发** | Resume / Posts / Briefs / Slides 四个路由模块 | Phase 2 |
| **4. 前端改造** | API 请求层、Store 改造、页面数据源切换 | Phase 3 |
| **5. 配置收尾** | 部署文档、环境变量、Nginx 配置、清理遗留文件 | Phase 4 |

---

## Level 3 · 各阶段详请

---

### Phase 1：基础设施搭建（预估 1.5h）

**目标**：Express + TypeScript 后端项目跑起来，PostgreSQL 就绪，表建好。

**步骤**：

1. **初始化 server 目录**
   ```bash
   mkdir server && cd server
   npm init -y
   npm install express cors pg
   npm install -D typescript @types/express @types/cors @types/pg \
     @types/node tsx
   npx tsc --init
   ```
   `tsconfig.json` 中设置 `outDir: dist`、`rootDir: src`、`strict: true`。

2. **创建入口文件 `server/src/index.ts`**
   ```typescript
   import express from 'express'
   import cors from 'cors'
   import { db } from './db'

   const app = express()
   app.use(cors())
   app.use(express.json())

   const PORT = process.env.PORT || 3000

   app.get('/api/health', (_req, res) => {
     res.json({ status: 'ok' })
   })

   app.listen(PORT, () => {
     console.log(`Server running on http://localhost:${PORT}`)
   })
   ```

3. **数据库连接 `server/src/db/index.ts`**
   ```typescript
   import { Pool } from 'pg'

   export const db = new Pool({
     connectionString: process.env.DATABASE_URL
       || 'postgres://resume:secret@localhost:5432/resume',
   })
   ```

4. **DDL 建表 `server/src/db/schema.sql`**
   - 4 张表：`resume`、`blog_posts`、`slides`、`daily_briefs`
   - 字段定义见 [Level 4 · 数据库设计](#level-4--技术参考按需查阅)
   - 单独运行：`psql -U resume -d resume -f src/db/schema.sql`

5. **Docker Compose `docker-compose.yml`**
   ```yaml
   services:
     postgres:
       image: postgres:16-alpine
       environment:
         POSTGRES_DB: resume
         POSTGRES_USER: resume
         POSTGRES_PASSWORD: secret
       ports:
         - "5432:5432"
       volumes:
         - pgdata:/var/lib/postgresql/data
       healthcheck:
         test: ["CMD-SHELL", "pg_isready -U resume"]
   volumes:
     pgdata:
   ```

6. **验证**
   ```bash
   docker compose up -d
   cd server && npx tsx src/index.ts
   curl http://localhost:3000/api/health
   # → {"status":"ok"}
   ```

**涉及文件**：
- `server/package.json` (新增)
- `server/tsconfig.json` (新增)
- `server/src/index.ts` (新增)
- `server/src/db/index.ts` (新增)
- `server/src/db/schema.sql` (新增)
- `docker-compose.yml` (新增)

---

### Phase 2：数据迁移（预估 1.5h）

**目标**：把 `src/data/resume.ts`、`src/stores/blog.ts`、`src/stores/slides.ts`、`src/data/dailyBriefs.ts` 中的硬编码数据写入 PostgreSQL。

**步骤**：

1. **读取现有数据源**
   - `resume-data.json`：JSON 文件，直接读取即可
   - `src/stores/blog.ts`：导出 `BlogPost[]`，需要提取常量数组
   - `src/stores/slides.ts`：同上
   - `src/data/dailyBriefs.ts`：较早的文带有对应 `public/*.html` 文件

2. **安装依赖**
   ```bash
   cd server && npm install tsx --save-dev
   ```

3. **编写种子脚本 `server/src/seed/index.ts`**
   - 连接数据库
   - 读取 `resume-data.json`，按 section 拆分为 6 条 INSERT 到 `resume` 表
   - 将 blog posts、slides、daily briefs 分别插入对应表
   - 幂等设计：`ON CONFLICT (section/slug/date) DO NOTHING`
   - 附 `content_html` 读取：每日早参的正文存于 `public/*.html`，迁移时一并读入

4. **运行迁移**
   ```bash
   cd server && npx tsx src/seed/index.ts
   ```

5. **验证**
   ```bash
   psql -U resume -d resume -c "SELECT count(*) FROM resume;"
   psql -U resume -d resume -c "SELECT count(*) FROM blog_posts;"
   psql -U resume -d resume -c "SELECT count(*) FROM daily_briefs;"
   psql -U resume -d resume -c "SELECT count(*) FROM slides;"
   ```

**涉及文件**：
- `server/src/seed/index.ts` (新增)
- `server/package.json` (更新 scripts)

> **注意**：如果数据在开发过程中不断更新，迁移脚本可能需要多次运行。幂等设计确保重复执行安全。

---

### Phase 3：API 开发（预估 2h）

**目标**：编写 4 组 RESTful 路由，覆盖所有前端所需数据。

**步骤**：

1. **简历路由 `server/src/routes/resume.ts`**
   - `GET /api/resume` → 全部 section，合并为一个 JSON 对象返回
   - `GET /api/resume/:section` → 单段数据

2. **文章路由 `server/src/routes/posts.ts`**
   - `GET /api/posts` → 列表，支持 `?tag=xxx` 筛选
   - `GET /api/posts/:slug` → 详情（含 `content_html`）
   - `POST /api/posts` → 新增
   - `PUT /api/posts/:slug` → 更新
   - `DELETE /api/posts/:slug` → 删除

3. **早参路由 `server/src/routes/briefs.ts`**
   - `GET /api/briefs` → 列表（日期倒序）
   - `GET /api/briefs/:date` → 详情

4. **幻灯片路由 `server/src/routes/slides.ts`**
   - `GET /api/slides` → 列表
   - `GET /api/slides/:slug` → 详情

5. **注册路由**：在 `server/src/index.ts` 中挂载所有路由

6. **错误处理中间件**：全局统一格式 `{ error: string, details?: unknown }`

**涉及文件**：
- `server/src/routes/resume.ts` (新增)
- `server/src/routes/posts.ts` (新增)
- `server/src/routes/briefs.ts` (新增)
- `server/src/routes/slides.ts` (新增)
- `server/src/index.ts` (更新)

**API 端点速查**见 [Level 4 · API 接口](#api-接口)。

---

### Phase 4：前端改造（预估 3h）

**目标**：前端从硬编码数据切换到 API 获取，保留现有 UI 和交互不变。

**步骤**：

1. **新增 API 请求层 `client/src/api/index.ts`**
   - 封装 `get<T>(path)` 函数，统一处理 base URL 和错误
   - 导出 `api` 对象：`getResume`、`getPosts`、`getPost`、`getBriefs`、`getSlides`

2. **改造 Pinia Store**
   - **`blog.ts`**：移除硬编码 `posts` 数组，改为 `fetchPosts()` 异步方法 + `loading` / `error` 状态
   - **`slides.ts`**：同上
   - 保持对外接口一致（`getPostBySlug`、`getSlideById` 仍可用）

3. **修改页面数据来源**
   - `HomePage.vue` / `AboutPage.vue`：原 `import { resumeData }` → 改为 Pinia store 或 API 调用
   - `DailyBriefPage.vue`：原 `import { dailyBriefs }` → 改为 API 获取
   - `BlogPage.vue`：store 接口不变，只改 store 内部实现
   - `BlogPostPage.vue`：从本地 `getPostBySlug` 改为调 API `/posts/:slug`

4. **配置 Vite 开发代理** `vite.config.ts`
   ```typescript
   server: {
     proxy: {
       '/api': {
         target: 'http://localhost:3000',
         changeOrigin: true,
       },
     },
   }
   ```

5. **验证**
   ```bash
   # 终端 1：后端
   cd server && npx tsx src/index.ts

   # 终端 2：前端
   cd client && npm run dev

   # 浏览器打开 http://localhost:5173，页面应与之前完全一致
   ```

**涉及文件**：
- `client/src/api/index.ts` (新增)
- `client/src/stores/blog.ts` (重构)
- `client/src/stores/slides.ts` (重构)
- `client/src/pages/HomePage.vue` (修改)
- `client/src/pages/AboutPage.vue` (修改)
- `client/src/pages/BlogPage.vue` (修改)
- `client/src/pages/DailyBriefPage.vue` (修改)
- `client/src/pages/BlogPostPage.vue` (修改)
- `vite.config.ts` (修改)

**注意**：
- `BlogReaderPage.vue` 保持不变（仍是 iframe 加载静态 HTML）
- `public/*.html` 静态文章先保留，后续逐步迁移到数据库

---

### Phase 5：配置与收尾（预估 1.5h）

**目标**：部署方案确认、文档更新、遗留文件清理。

**步骤**：

1. **环境变量**

   `server/.env`：
   ```
   DATABASE_URL=postgres://resume:secret@localhost:5432/resume
   PORT=3000
   ```

2. **生产部署方案**
   - **选项 A（前后端分离）**：
     - 前端 → Vite build → 静态文件托管（阿里云 ESA / CDN）
     - 后端 → Express → 云服务器（Railway / Fly.io）
     - 数据库 → Supabase / Neon / 云 PostgreSQL
   - **选项 B（单机部署）**：
     ```
     Nginx → /api/* → localhost:3000 (Express)
           → /*     → /path/to/client/dist (静态文件)
     ```

3. **更新文档**
   - `docs/deployment/deployment-guide.md`：补充后端部署步骤
   - `docs/README.md`：确认 docs 索引完整

4. **清理**
   - 确认 `src/data/resume.ts`、`src/data/dailyBriefs.ts`、`src/data/` 目录可安全删除
   - 从 `vite.config.ts` 移除 dev proxy（如需）

5. **scripts 更新**
   - `package.json` 新增 `dev:server`、`dev:client` 等便捷脚本

**涉及文件**：
- `server/.env` (新增)
- `package.json` (更新 scripts)
- `docs/deployment/deployment-guide.md` (更新)

---

## Level 4 · 技术参考（按需查阅）

### 数据库设计

4 张表，全部使用 PostgreSQL。

**resume** — 简历各段数据，JSONB 存储避免多表 Join：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | SERIAL PK | |
| `section` | TEXT UNIQUE | `personal_info`、`summary`、`skills`、`projects`、`experience`、`honors` |
| `data` | JSONB | 各段实际数据 |
| `updated_at` | TIMESTAMPTZ | 自动更新 |

**blog_posts** — 博客文章：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | SERIAL PK | |
| `slug` | TEXT UNIQUE | URL 友好标识 |
| `title` | TEXT | |
| `description` | TEXT | 摘要 |
| `date` | DATE | |
| `tags` | TEXT[] | |
| `external_url` | TEXT | 可选外链 |
| `content_html` | TEXT | 文章正文 HTML |
| `created_at` / `updated_at` | TIMESTAMPTZ | |

**daily_briefs** — 每日早参：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | SERIAL PK | |
| `date` | DATE UNIQUE | |
| `title` | TEXT | |
| `content_html` | TEXT | 正文 |
| `display_date` | TEXT | 显示用日期，如"4月13日 周一" |
| `created_at` | TIMESTAMPTZ | |

**slides** — 演示文稿：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | SERIAL PK | |
| `slug` | TEXT UNIQUE | |
| `title` | TEXT | |
| `description` | TEXT | |
| `page_count` | INTEGER | |
| `date` | DATE | |
| `content_html` | TEXT | |
| `created_at` / `updated_at` | TIMESTAMPTZ | |

索引：`blog_posts(date DESC)`、`daily_briefs(date DESC)`、`slides(date DESC)`。

---

### API 接口

**基础约定**：基准路径 `/api`，Content-Type `application/json`，错误响应 `{ "error": string }`。

#### Resume

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/resume` | 全部简历数据（合并所有 section） |
| GET | `/api/resume/:section` | 单段数据 |

#### Blog Posts

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/posts` | 列表，支持 `?tag=xxx` 筛选 |
| GET | `/api/posts/:slug` | 文章详情 |
| POST | `/api/posts` | 新增 |
| PUT | `/api/posts/:slug` | 更新 |
| DELETE | `/api/posts/:slug` | 删除 |

#### Daily Briefs

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/briefs` | 列表（日期倒序） |
| GET | `/api/briefs/:date` | 详情（date 格式：YYYY-MM-DD） |

#### Slides

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/slides` | 列表 |
| GET | `/api/slides/:slug` | 详情 |

---

### 项目结构（完成后）

```
my-resume/
├── client/                      # 前端（现有代码迁移至此）
│   ├── src/
│   │   ├── api/index.ts         # 新增：API 请求层
│   │   ├── stores/              # 改造：Pinia store
│   │   └── pages/               # 调整：数据源切换
│   ├── public/                  # 保留：静态 HTML 文章
│   └── vite.config.ts           # 调整：加 dev proxy
├── server/                      # 新增：Express 后端
│   ├── src/
│   │   ├── db/                  # 连接池 + schema
│   │   ├── routes/              # 4 组路由
│   │   └── seed/               # 数据迁移脚本
│   └── package.json
├── docs/                        # 项目文档
├── docker-compose.yml           # 新增
└── 前后端分离方案.md              # 原始方案
```

---

### 环境变量

```
# server/.env
DATABASE_URL=postgres://resume:secret@localhost:5432/resume
PORT=3000

# client/.env（可选，默认走 Vite proxy）
VITE_API_URL=/api
```
