import mongoose from 'mongoose'

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  }
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/oj-platform'

if (!MONGODB_URI) {
  throw new Error('请在环境变量中定义 MONGODB_URI')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      cached.conn = mongoose
      return cached
    })
  }

  try {
    await cached.promise
    return cached.conn
  } catch (e) {
    cached.promise = null
    throw e
  }
}

export default dbConnect 