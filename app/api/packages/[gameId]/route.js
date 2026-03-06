import { dbConnect } from '@/lib/mongodb'
import Package from '@/models/Package'
import redis from '@/lib/redis'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req, { params }) {
    try {
        const { gameId } = await params

        // 1. Check Cache
        const cacheKey = `packages:${gameId}`
        const cached = await redis.get(cacheKey)
        if (cached) return successResponse({ packages: JSON.parse(cached), cached: true })

        await dbConnect()

        // 2. Fetch from DB
        const packages = await Package.find({ game_id: gameId, status: 'active' })
            .sort({ sort_order: 1 })
            .lean()

        // 3. Store in Cache (30 minutes - more frequent updates for stock/prices)
        await redis.setex(cacheKey, 1800, JSON.stringify(packages))

        return successResponse({ packages, cached: false })
    } catch (error) {
        console.error('Packages API Error:', error)
        return errorResponse(error.message, 500)
    }
}