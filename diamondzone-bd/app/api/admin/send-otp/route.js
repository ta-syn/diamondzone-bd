import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import redis from '@/lib/redis'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function POST(req) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)

        // 1. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // 2. Store in Redis: 5 min TTL
        await redis.setex(`admin_otp:${user.id}`, 300, otp)

        // 3. Send via SMS or Console (Simulated for this mission)
        console.log(`[SECURE_SIGNAL] ADMIN OTP FOR ${user.email} (ID: ${user.id}): ${otp}`)

        // For production, you would integrate Twilio here
        // if (process.env.TWILIO_SID) { await sendSMS(user.phone, `Your DZ Admin OTP: ${otp}`) }

        return successResponse({
            success: true,
            message: 'OTP transmission successful to registered frequency.'
        })
    } catch (error) {
        console.error('OTP Send Error:', error)
        return errorResponse(error.message, 500)
    }
}