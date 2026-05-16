import { Router } from 'express'
import { db } from '../db/index.js'

const router = Router()

// GET /api/slides — 列表
router.get('/', async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT slug, title, description, page_count, date
       FROM slides
       ORDER BY date DESC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching slides:', err)
    res.status(500).json({ error: 'Failed to fetch slides' })
  }
})

// GET /api/slides/:slug — 详情
router.get('/:slug', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM slides WHERE slug = $1',
      [req.params.slug]
    )
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Slide not found' })
      return
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error fetching slide:', err)
    res.status(500).json({ error: 'Failed to fetch slide' })
  }
})

export default router
