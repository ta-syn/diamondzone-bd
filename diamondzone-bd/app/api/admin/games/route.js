import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import Game from '@/models/Game'
import { cacheDel } from '@/lib/redis'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)

        await dbConnect()
        const games = await Game.find().sort({ sort_order: 1 }).lean()
        return successResponse({ games })
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

        const game = await Game.create(body)
        await cacheDel('games:all')

        return successResponse({ game, message: 'New ecosystem deployed' })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}