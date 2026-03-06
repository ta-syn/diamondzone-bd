import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import Order from '@/models/Order'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') {
            return errorResponse('Forbidden: Administrative protocols required', 403)
        }

        const { searchParams } = new URL(req.url)
        const status = searchParams.get('status')
        const search = searchParams.get('search')
        const game = searchParams.get('game')
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 20
        const skip = (page - 1) * limit

        await dbConnect()

        const query = {}
        if (status && status !== 'all') query.status = status
        if (game && game !== 'all') query.game_slug = game
        if (search) {
            query.$or = [
                { order_id: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { player_id: { $regex: search, $options: 'i' } }
            ]
        }

        const [orders, total] = await Promise.all([
            Order.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('user_id', 'name email wallet_balance')
                .lean(),
            Order.countDocuments(query)
        ])

        return successResponse({
            orders,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}