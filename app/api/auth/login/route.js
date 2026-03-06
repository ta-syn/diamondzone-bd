import { dbConnect } from '@/lib/mongodb.js'
import User from '@/models/User.js'
import { comparePassword, generateToken } from '@/lib/auth.js'
import { apiResponse, apiError } from '@/lib/api-helpers.js'
import { rateLimit } from '@/lib/redis.js'
import { sanitizeString } from '@/lib/validation.js'
import { cookies } from 'next/headers'

export async function POST(request) {
    try {
        const body = await request.json()
        const email = sanitizeString(body.email)
        const password = body.password // Don't sanitize password
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'

        // 1. Rate Limiting: 10 attempts per IP per 15min
        const isAllowed = await rateLimit(`login_ip:${ip}`, 10, 900)
        if (!isAllowed) return apiError('Too many login attempts. Please try again in 15 minutes.', 429)

        await dbConnect()

        // 2. Find user
        const user = await User.findOne({ email: email?.toLowerCase() }).select('+password')

        // 3. Authenticate
        if (!user) return apiError('Invalid email or password', 401)

        // 4. Check status
        if (user.is_banned) return apiError(`Your account has been banned. Reason: ${user.ban_reason || 'Unknown'}`, 403)

        if (user.locked_until && user.locked_until > new Date()) {
            const remainingMinutes = Math.ceil((user.locked_until - new Date()) / 60000)
            return apiError(`Account locked due to multiple failed attempts. Try again in ${remainingMinutes} minutes.`, 423)
        }

        // 5. Compare Password
        const isMatch = await comparePassword(password, user.password)

        if (!isMatch) {
            // Failed attempt logic
            user.failed_login_attempts = (user.failed_login_attempts || 0) + 1

            if (user.failed_login_attempts >= 5) {
                // Lock for 15 mins
                const lockTime = user.failed_login_attempts >= 10 ? 24 * 60 : 15
                user.locked_until = new Date(Date.now() + lockTime * 60000)
            }

            await user.save()
            return apiError('Invalid email or password', 401)
        }

        // 6. Success
        user.failed_login_attempts = 0
        user.locked_until = null
        user.last_login = new Date()
        await user.save()

        // 7. Token and Cookie
        const token = generateToken({ userId: user._id, email: user.email, role: user.role })
        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 604800, // 7 days
            path: '/',
            sameSite: 'strict',
        })

        return apiResponse({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                wallet_balance: user.wallet_balance,
                referral_code: user.referral_code,
            }
        })

    } catch (error) {
        console.error('Login error:', error)
        return apiError('Server error during login', 500)
    }
}