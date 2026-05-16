import { Router } from 'express'
import { db } from '../db/index.js'

const router = Router()

// GET /api/posts — 列表，支持 ?tag=xxx 筛选
router.get('/', async (req, res) => {
  try {
    const tag = req.query.tag as string | undefined
    let query = `SELECT slug, title, description, date, tags, external_url
                 FROM blog_posts`
    const params: string[] = []

    if (tag) {
      query += ' WHERE $1 = ANY(tags)'
      params.push(tag)
    }
    query += ' ORDER BY date DESC'

    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching posts:', err)
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

// GET /api/posts/:slug — 单篇详情
router.get('/:slug', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM blog_posts WHERE slug = $1',
      [req.params.slug]
    )
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Post not found' })
      return
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error fetching post:', err)
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

// POST /api/posts — 新增
router.post('/', async (req, res) => {
  try {
    const { title, description, date, tags, content_html } = req.body
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9一-龥]+/g, '-')
      .replace(/^-|-$/g, '')

    const result = await db.query(
      `INSERT INTO blog_posts (slug, title, description, date, tags, content_html)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [slug, title, description || '', date, tags || [], content_html || null]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error creating post:', err)
    res.status(500).json({ error: 'Failed to create post' })
  }
})

// PUT /api/posts/:slug — 更新
router.put('/:slug', async (req, res) => {
  try {
    const { title, description, date, tags, content_html } = req.body
    const result = await db.query(
      `UPDATE blog_posts
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           date = COALESCE($3, date),
           tags = COALESCE($4, tags),
           content_html = COALESCE($5, content_html),
           updated_at = NOW()
       WHERE slug = $6
       RETURNING *`,
      [title, description, date, tags, content_html, req.params.slug]
    )
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Post not found' })
      return
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error updating post:', err)
    res.status(500).json({ error: 'Failed to update post' })
  }
})

// DELETE /api/posts/:slug — 删除
router.delete('/:slug', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM blog_posts WHERE slug = $1 RETURNING *',
      [req.params.slug]
    )
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Post not found' })
      return
    }
    res.json({ message: 'Post deleted', slug: req.params.slug })
  } catch (err) {
    console.error('Error deleting post:', err)
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

export default router
