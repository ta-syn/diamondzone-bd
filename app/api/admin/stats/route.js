import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import Order from '@/models/Order'
import User from '@/models/User'
import Game from '@/models/Game'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') {
            return errorResponse('Forbidden: Administrative protocols required', 403)
        }

        await dbConnect()

        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)

        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        sevenDaysAgo.setHours(0, 0, 0, 0)

        // Parallel Aggregations
        const [
            todaySummary,
            totalSummary,
            pendingCount,
            totalUsers,
            topGames,
            weeklyData
        ] = await Promise.all([
            // 1. Today Stats
            Order.aggregate([
                { $match: { createdAt: { $gte: todayStart }, status: { $ne: 'cancelled' } } },
                { $group: { _id: null, totalRevenue: { $sum: '$amount_paid' }, orderCount: { $count: {} } } }
            ]),

            // 2. Total Lifetime Stats
            Order.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, totalRevenue: { $sum: '$amount_paid' }, totalOrders: { $count: {} } } }
            ]),

            // 3. Current Pending Load
            Order.countDocuments({ status: { $in: ['pending', 'processing'] } }),

            // 4. Users Overview
            User.countDocuments({ role: 'user' }),

            // 5. Popular Ecosystems
            Order.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: '$game_name', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]),

            // 6. Weekly Revenue Trend
            Order.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo }, status: 'completed' } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%m-%d', date: '$createdAt' } },
                        revenue: { $sum: '$amount_paid' },
                        orders: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ])
        ])

        const stats = {
            today: todaySummary[0] || { totalRevenue: 0, orderCount: 0 },
            total: totalSummary[0] || { totalRevenue: 0, totalOrders: 0 },
            pending_orders: pendingCount,
            total_users: totalUsers,
            success_rate: totalSummary[0] ? ((totalSummary[0].totalOrders / (await Order.countDocuments({ status: { $ne: 'pending' } }))) * 100).toFixed(1) : 0,
            top_games: topGames.map(g => ({ name: g._id, value: g.count })),
            weekly_revenue: weeklyData.map(d => ({ date: d._id, revenue: d.revenue, orders: d.orders })),
            system_time: new Date()
        }

        return successResponse({ stats })
    } catch (error) {
        console.error('Admin Stats Error:', error)
        return errorResponse(error.message, 500)
    }
}