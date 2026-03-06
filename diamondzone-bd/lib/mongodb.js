import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) throw new Error('MONGODB_URI missing in .env.local')

let cached = global.mongoose || { conn: null, promise: null }
global.mongoose = cached

export async function dbConnect() {
    if (cached.conn) return cached.conn

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false, maxPoolSize: 10 })
    }
    cached.conn = await cached.promise
    return cached.conn
}