import express from 'express'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/auth.js'
import sessionRoutes from './routes/sessions.js'

dotenv.config()

const PORT = process.env.PORT || 4000

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/sessions', sessionRoutes)

app.get('/', (req, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
