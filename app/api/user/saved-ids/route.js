import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import User from '@/models/User'
import { successResponse, errorResponse } from '@/lib/api-helpers'
import { sanitizeString } from '@/lib/validation'

export async function GET(req) {
    try {
        const user = await getAuthUser()
        if (!user) return errorResponse('Unauthorized', 401)

        await dbConnect()
        const dbUser = await User.findById(user.id).select('saved_player_ids').lean()
        if (!dbUser) return errorResponse('User not found', 404)
        return successResponse({ saved_player_ids: dbUser.saved_player_ids || [] })
    } catch (error) {
        console.error("SAVED_IDS ERROR:", error)
        return errorResponse(error.message + ' - ' + error.stack, 500)
    }
}

export async function POST(req) {
    try {
        const user = await getAuthUser()
        if (!user) return errorResponse('Unauthorized', 401)

        const rawBody = await req.json()
        const game_slug = sanitizeString(rawBody.game_slug)
        const player_id = sanitizeString(rawBody.player_id)
        const nickname = sanitizeString(rawBody.nickname || '')

        if (!game_slug || !player_id) return errorResponse('Missing required fields', 400)

        await dbConnect()
        const dbUser = await User.findById(user.id)

        // Avoid duplicate ID for the same game
        const exists = dbUser.saved_player_ids.find(i => i.game_slug === game_slug && i.player_id === player_id)
        if (exists) return errorResponse('Player ID already saved for this ecosystem', 400)

        dbUser.saved_player_ids.push({ game_slug, player_id, nickname })
        await dbUser.save()

        return successResponse({
            saved_id: dbUser.saved_player_ids[dbUser.saved_player_ids.length - 1],
            message: 'Target coordinates secured and saved.'
        })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}

export async function DELETE(req) {
    try {
        const user = await getAuthUser()
        if (!user) return errorResponse('Unauthorized', 401)

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        if (!id) return errorResponse('Missing ID parameter', 400)

        await dbConnect()
        const dbUser = await User.findById(user.id)

        dbUser.saved_player_ids = dbUser.saved_player_ids.filter(i => i._id.toString() !== id)
        await dbUser.save()

        return successResponse({ message: 'Target record purged from memory.' })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}