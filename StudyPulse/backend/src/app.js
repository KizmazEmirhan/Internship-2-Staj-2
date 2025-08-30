import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/auth.js'
import sessionRoutes from './routes/sessions.js'

const createApp = () => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(morgan('dev'))

  app.use('/api/auth', authRoutes)
  app.use('/api/sessions', sessionRoutes)

  app.get('/', (req, res) => res.json({ ok: true }))

  return app
}

export default createApp
