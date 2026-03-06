import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
        if (times > 3) return null // Stop retrying after 3 attempts
        return Math.min(times * 50, 2000)
    }
})

redis.on('error', (err) => console.error('Redis error:', err.message))

export async function cacheGet(key) {
    try {
        const data = await redis.get(key)
        return data ? JSON.parse(data) : null
    } catch (e) {
        console.warn('cacheGet failed', e.message)
        return null
    }
}

export async function cacheSet(key, value, ttlSeconds = 3600) {
    try {
        await redis.setex(key, ttlSeconds, JSON.stringify(value))
    } catch (e) {
        console.warn('cacheSet failed', e.message)
    }
}

export async function cacheDel(pattern) {
    try {
        const keys = await redis.keys(pattern)
        if (keys.length > 0) await redis.del(...keys)
    } catch (e) {
        console.warn('cacheDel failed', e.message)
    }
}

export async function rateLimit(key, max, windowSeconds) {
    try {
        const current = await redis.incr(key)
        if (current === 1) await redis.expire(key, windowSeconds)
        return current <= max
    } catch (e) {
        console.warn('rateLimit failed', e.message)
        return true
    }
}

export default redis