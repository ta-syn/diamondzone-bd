import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import Transaction from '@/models/Transaction'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req) {
    try {
        const user = await getAuthUser()
        if (!user) return errorResponse('Unauthorized', 401)

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 10
        const skip = (page - 1) * limit

        await dbConnect()

        const [transactions, total] = await Promise.all([
            Transaction.find({ user_id: user.id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Transaction.countDocuments({ user_id: user.id })
        ])

        return successResponse({
            transactions,
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