import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import Package from '@/models/Package'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)

        const { searchParams } = new URL(req.url)
        const gameId = searchParams.get('game_id')

        await dbConnect()
        const query = gameId ? { game_id: gameId } : {}
        const packages = await Package.find(query).sort({ game_id: 1, sort_order: 1 }).populate('game_id', 'name slug emoji').lean()

        return successResponse({ packages })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}

export async function POST(req) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)

        const body = await req.json()
        await dbConnect()

        const pkg = await Package.create(body)
        return successResponse({ pkg, message: 'New diamond cargo registered' })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}