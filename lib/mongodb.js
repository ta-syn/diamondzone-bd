import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

let cached = global.mongoose || { conn: null, promise: null }
global.mongoose = cached

export async function dbConnect() {
    if (cached.conn) return cached.conn

    if (!MONGODB_URI) {
        console.warn('MONGODB_URI is missing. Database features will be unavailable.')
        return null
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false, maxPoolSize: 10 })
    }
    cached.conn = await cached.promise
    return cached.conn
}