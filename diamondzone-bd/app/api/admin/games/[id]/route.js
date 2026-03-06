import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import Game from '@/models/Game'
import { cacheDel } from '@/lib/redis'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req, { params }) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)
        const { id } = await params
        await dbConnect()
        const game = await Game.findById(id).lean()
        return successResponse({ game })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}

export async function PUT(req, { params }) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)
        const { id } = await params
        const body = await req.json()
        await dbConnect()

        await Game.findByIdAndUpdate(id, body)
        await cacheDel('games:all')

        return successResponse({ message: 'Ecosystem re-calibrated successfully.' })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}

export async function DELETE(req, { params }) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)
        const { id } = await params
        await dbConnect()

        await Game.findByIdAndDelete(id)
        await cacheDel('games:all')

        return successResponse({ message: 'Ecosystem dismantled.' })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}