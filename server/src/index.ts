import express from 'express'
import cors from 'cors'
import { db } from './db/index.js'
import resumeRoutes from './routes/resume.js'
import postsRoutes from './routes/posts.js'
import briefsRoutes from './routes/briefs.js'
import slidesRoutes from './routes/slides.js'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Routes
app.use('/api/resume', resumeRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/briefs', briefsRoutes)
app.use('/api/slides', slidesRoutes)

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await db.end()
  process.exit(0)
})
