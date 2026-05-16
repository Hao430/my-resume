import { Router } from 'express'
import { db } from '../db/index.js'

const router = Router()

// GET /api/briefs — 列表（日期倒序）
router.get('/', async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT date, title, display_date
       FROM daily_briefs
       ORDER BY date DESC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching briefs:', err)
    res.status(500).json({ error: 'Failed to fetch briefs' })
  }
})

// GET /api/briefs/:date — 详情（date 格式 YYYY-MM-DD）
router.get('/:date', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM daily_briefs WHERE date = $1',
      [req.params.date]
    )
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Brief not found' })
      return
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error fetching brief:', err)
    res.status(500).json({ error: 'Failed to fetch brief' })
  }
})

export default router
