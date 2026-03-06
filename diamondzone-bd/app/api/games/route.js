import { dbConnect } from '@/lib/mongodb'
import Game from '@/models/Game'
import redis from '@/lib/redis'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET() {
    try {
        // 1. Check Cache
        const cached = await redis.get('games:all')
        if (cached) return successResponse({ games: JSON.parse(cached), cached: true })

        await dbConnect()

        // 2. Fetch from DB
        const games = await Game.find({ status: 'active' })
            .sort({ sort_order: 1 })
            .lean()

        // 3. Store in Cache (1 hour)
        await redis.setex('games:all', 3600, JSON.stringify(games))

        return successResponse({ games, cached: false })
    } catch (error) {
        console.error('Games API Error:', error)
        return errorResponse(error.message, 500)
    }
}