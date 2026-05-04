import { env } from '#/env'
import mongoose from 'mongoose'

const MONGODB_URI = env.DB_URL

if (!MONGODB_URI) {
  throw new Error('Missing DB_URL in environment')
}

const cached = globalThis as typeof globalThis & {
  mongoose?: typeof mongoose
  conn?: typeof mongoose | null
}

export async function connectDB() {
  if (cached.conn) return cached.conn
  cached.conn = await mongoose.connect(MONGODB_URI)
  return cached.conn
}
