import serverless from 'serverless-http'
import createApp from '../src/app.js'
import dotenv from 'dotenv'
import connectDB from '../src/utils/db.js'

dotenv.config()

// ensure DB connects in serverless environment
connectDB()

const app = createApp()

export const handler = serverless(app)
