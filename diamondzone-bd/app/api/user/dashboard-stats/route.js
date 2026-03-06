import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import Order from '@/models/Order'
import Transaction from '@/models/Transaction'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req) {
    try {
        const user = await getAuthUser()
        if (!user) return errorResponse('Unauthorized', 401)

        await dbConnect()

        const [ordersTotal, ordersCompleted, recentOrders, referralTransactions] = await Promise.all([
            Order.countDocuments({ user_id: user.id }),
            Order.aggregate([
                { $match: { user_id: user.id, status: 'completed' } },
                { $group: { _id: null, totalSpent: { $sum: '$amount_paid' } } }
            ]),
            Order.find({ user_id: user.id })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
            Transaction.aggregate([
                { $match: { user_id: user.id, type: 'referral' } },
                { $group: { _id: null, totalEarned: { $sum: '$amount' } } }
            ])
        ])

        const totalSpent = ordersCompleted[0]?.totalSpent || 0
        const referralEarnings = referralTransactions[0]?.totalEarned || 0

        return successResponse({
            stats: {
                totalOrders: ordersTotal,
                totalSpent,
                recentOrders,
                referralEarnings
            }
        })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}
