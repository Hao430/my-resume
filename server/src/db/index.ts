import pg from 'pg'
const { Pool } = pg

export const db = new Pool({
  connectionString: process.env.DATABASE_URL
    || 'postgres://resume:secret@localhost:5432/resume',
  // Allow server to start without DB connection
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

// Log connection errors without crashing
db.on('error', (err) => {
  console.error('Database pool error:', err.message)
})
