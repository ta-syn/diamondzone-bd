import redis from '@/lib/redis'
import { getAuthUser } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-helpers'
import { sanitizeString } from '@/lib/validation'

export async function POST(req) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)

        const body = await req.json()
        const otp = sanitizeString(body.otp || '')
        const userId = user.id

        // 1. Check Failure Count Rate Limit: 3 attempts max
        const failKey = `admin_otp_fail:${userId}`
        const failCount = await redis.get(failKey)
        if (failCount && parseInt(failCount) >= 3) {
            return errorResponse('Too many attempts. Signal blocked. Request new OTP.', 429)
        }

        // 2. Retrieve Stored OTP
        const stored = await redis.get(`admin_otp:${userId}`)
        if (!stored) return errorResponse('OTP signal expired or not found.', 404)

        // 3. Match Verification
        if (otp !== stored) {
            // Increment failure count (10min TTL)
            await redis.incr(failKey)
            await redis.expire(failKey, 600)
            return errorResponse('Invalid OTP code. Security alert logged.', 401)
        }

        // 4. On Success: Clear Security Protocol
        await redis.del(`admin_otp:${userId}`)
        await redis.del(failKey)

        // 5. Authorize Admin Session (8 Hours TTL)
        await redis.setex(`admin_verified:${userId}`, 28800, 'true')

        return successResponse({
            success: true,
            message: 'Clearance verified. Terminal access granted.'
        })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}