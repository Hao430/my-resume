# 数据库设计

> PostgreSQL 16 数据库设计说明。

## 建表 DDL

### resume — 简历数据

JSONB 存储，每行代表一个 section。避免多表 Join，修改结构无需迁移。

```sql
CREATE TABLE resume (
  id          SERIAL PRIMARY KEY,
  section     TEXT NOT NULL UNIQUE,
  data        JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- sections: personal_info | summary | skills | projects | experience | honors
```

### blog_posts — 博客文章

```sql
CREATE TABLE blog_posts (
  id           SERIAL PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  date         DATE NOT NULL,
  tags         TEXT[] NOT NULL DEFAULT '{}',
  external_url TEXT,
  content_html TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### daily_briefs — 每日早参

```sql
CREATE TABLE daily_briefs (
  id            SERIAL PRIMARY KEY,
  date          DATE NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  content_html  TEXT NOT NULL,
  display_date  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### slides — 演示文稿

```sql
CREATE TABLE slides (
  id           SERIAL PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  page_count   INTEGER NOT NULL DEFAULT 0,
  date         DATE NOT NULL,
  content_html TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 索引

```sql
CREATE INDEX idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX idx_daily_briefs_date ON daily_briefs(date DESC);
CREATE INDEX idx_slides_date ON slides(date DESC);
```

## 设计说明

### 为什么 resume 用 JSONB 而不是拆成 6 张表？

- 简历数据量极小（一条简历 = 6 段），JSONB 避免 6 张表的 Join 开销
- 修改结构（如新增技能分类）无需跑 Migration
- 查询时全部取出（`SELECT * FROM resume`），JSONB 的查询劣势在这个场景下不存在

### content_html 为什么存数据库而不是文件？

- 省去文件系统读写逻辑，部署时少一个 concern
- 每个早参/文章全部走 API 返回，前端无需关心文件路径
- `public/*.html` 在过渡期保留，后期可完全迁移到 DB

### 为什么不要 MongoDB？

- 所有数据都有固定结构，没有非结构化文档或深层嵌套
- 个人站几乎没有并发写入场景
- PostgreSQL JSONB 既保留了字段灵活性，又省去一套运维
