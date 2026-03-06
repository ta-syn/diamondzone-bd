import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import { rateLimit } from '@/lib/redis'
import { sanitizeString } from '@/lib/validation'
import { successResponse, errorResponse } from '@/lib/api-helpers'
import Coupon from '@/models/Coupon'

export async function POST(req) {
    try {
        const user = await getAuthUser()
        const body = await req.json()
        const code = sanitizeString(body.code || '').toUpperCase()

        // 1. Rate Limiting: 20 per user per 5min
        const limitId = user ? `coupon:${user.id}` : `coupon_guest:${req.headers.get('x-forwarded-for') || 'anon'}`
        const isAllowed = await rateLimit(limitId, 20, 300)
        if (!isAllowed) return errorResponse('Too many coupon attempts. Try again in 5 minutes.', 429)

        if (!code) return errorResponse('Code is required', 400)

        await dbConnect()

        // 2. Fetch Coupon
        const coupon = await Coupon.findOne({
            code,
            status: 'active',
            expiry_date: { $gt: new Date() }
        })

        if (!coupon) return errorResponse('Invalid or expired coupon signal', 404)

        // 3. Check Usage Limit
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return errorResponse('Coupon signal exhausted', 400)
        }

        return successResponse({
            success: true,
            coupon: {
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                min_order: coupon.min_order,
                max_discount: coupon.max_discount
            }
        })

    } catch (error) {
        return errorResponse(error.message, 500)
    }
}