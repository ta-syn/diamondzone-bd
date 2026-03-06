import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import Order from '@/models/Order'
import User from '@/models/User'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'reseller' || !user.reseller_approved) {
            return errorResponse('Forbidden: Reseller clearance required', 403)
        }

        await dbConnect()

        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)

        // Parallel Aggregations for Reseller User
        const [todaySummary, totalSummary, recentOrders, dbUser] = await Promise.all([
            // 1. Today Stats
            Order.aggregate([
                {
                    $match: {
                        user_id: user.userId,
                        createdAt: { $gte: todayStart },
                        status: { $ne: 'cancelled' }
                    }
                },
                {
                    $group: {
                        _id: null,
                        revenue: { $sum: '$amount_paid' },
                        count: { $sum: 1 }
                    }
                }
            ]),

            // 2. Total Lifetime Stats
            Order.aggregate([
                {
                    $match: {
                        user_id: user.userId,
                        status: 'completed'
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 }
                    }
                }
            ]),

            // 3. Recent Orders
            Order.find({ user_id: user.userId })
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            // 4. Current Balance
            User.findById(user.userId).select('wallet_balance reseller_credit_limit').lean()
        ])

        const stats = {
            today: todaySummary[0] || { revenue: 0, count: 0 },
            totalOrders: totalSummary[0]?.totalOrders || 0,
            balance: dbUser?.reseller_credit_limit || 0,
            wallet: dbUser?.wallet_balance || 0,
            recentOrders: JSON.parse(JSON.stringify(recentOrders))
        }

        return successResponse({ stats })
    } catch (error) {
        console.error('Reseller Stats Error:', error)
        return errorResponse(error.message, 500)
    }
}
