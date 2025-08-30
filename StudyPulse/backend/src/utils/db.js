import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  const dbName = process.env.MONGO_DB
  try {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
    if (dbName) opts.dbName = dbName

    await mongoose.connect(uri, opts)

    // log which database we actually connected to
    const connectedDbName = mongoose.connection?.db?.databaseName || mongoose.connection.name
    console.log('MongoDB connected to:', connectedDbName)

    // warn if neither URI nor env provided a DB name (mongodb default is 'test')
    const uriHasDb = uri && /\/[^\/\?]+(?=\?|$)/.test(uri)
    if (!dbName && !uriHasDb) {
      console.warn('[db.js] WARNING: no database name specified in MONGO_URI and MONGO_DB not set — mongoose will connect to the default database (usually "test").')
      console.warn('[db.js] To fix: add the database name to your MONGO_URI (eg: mongodb+srv://user:pass@host/YourDBName?...) or set MONGO_DB=YourDBName in .env')
    }
  } catch (err) {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  }
}

export default connectDB
