import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import User from '@/models/User'
import Order from '@/models/Order'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET() {
    try {
        const user = await getAuthUser()
        if (!user) return errorResponse('Unauthorized', 401)

        await dbConnect()

        const [dbUser, referrals] = await Promise.all([
            User.findById(user.userId || user.id).select('referral_code referral_count').lean(),
            User.find({ referred_by: user.userId || user.id }).select('name createdAt').lean()
        ])

        // Get total commissions (stub logic - in production you'd have a Commission model)
        const commissionTotal = await Order.aggregate([
            { $match: { referred_by: dbUser.referral_code, status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$referral_commission' } } }
        ])

        return successResponse({
            referral_code: dbUser.referral_code,
            referral_count: dbUser.referral_count || referrals.length,
            commission_earned: commissionTotal[0]?.total || 0,
            referrals: referrals.map(r => ({
                name: r.name,
                joined_at: r.createdAt
            }))
        })
    } catch (error) {
        console.error('Referral API Error:', error)
        return errorResponse(error.message, 500)
    }
}