import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import createApp from './app.js'

dotenv.config()

const PORT = process.env.PORT || 4000

const app = createApp()

connectDB()

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
