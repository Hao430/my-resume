import { Router } from 'express'
import { db } from '../db/index.js'

const router = Router()

// GET /api/resume — 全部简历数据，合并为一个对象
router.get('/', async (_req, res) => {
  try {
    const result = await db.query('SELECT section, data FROM resume')
    const merged: Record<string, unknown> = {}
    for (const row of result.rows) {
      merged[row.section] = row.data
    }
    res.json(merged)
  } catch (err) {
    console.error('Error fetching resume:', err)
    res.status(500).json({ error: 'Failed to fetch resume data' })
  }
})

// GET /api/resume/:section — 单段数据
router.get('/:section', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT section, data FROM resume WHERE section = $1',
      [req.params.section]
    )
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Section not found' })
      return
    }
    res.json({ section: result.rows[0].section, data: result.rows[0].data })
  } catch (err) {
    console.error('Error fetching resume section:', err)
    res.status(500).json({ error: 'Failed to fetch resume section' })
  }
})

export default router
