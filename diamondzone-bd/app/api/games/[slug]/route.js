import { dbConnect } from '@/lib/mongodb'
import Game from '@/models/Game'
import redis from '@/lib/redis'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req, { params }) {
    try {
        const { slug } = await params

        // 1. Check Cache
        const cacheKey = `game:${slug}`
        const cached = await redis.get(cacheKey)
        if (cached) return successResponse({ game: JSON.parse(cached), cached: true })

        await dbConnect()

        // 2. Fetch from DB
        const game = await Game.findOne({ slug, status: 'active' }).lean()
        if (!game) return errorResponse('Ecosystem not found', 404)

        // 3. Store in Cache (1 hour)
        await redis.setex(cacheKey, 3600, JSON.stringify(game))

        return successResponse({ game, cached: false })
    } catch (error) {
        console.error('Game Details API Error:', error)
        return errorResponse(error.message, 500)
    }
}