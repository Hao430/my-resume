-- 前后端分离改造 · 数据库建表
-- 运行：psql -U resume -d resume -f src/db/schema.sql

-- 简历数据（JSONB 存储各段，避免频繁改表结构）
CREATE TABLE IF NOT EXISTS resume (
  id          SERIAL PRIMARY KEY,
  section     TEXT NOT NULL UNIQUE,
  data        JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 博客文章
CREATE TABLE IF NOT EXISTS blog_posts (
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

-- 演示文稿
CREATE TABLE IF NOT EXISTS slides (
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

-- 每日早参
CREATE TABLE IF NOT EXISTS daily_briefs (
  id            SERIAL PRIMARY KEY,
  date          DATE NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  content_html  TEXT NOT NULL,
  display_date  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_briefs_date ON daily_briefs(date DESC);
CREATE INDEX IF NOT EXISTS idx_slides_date ON slides(date DESC);
