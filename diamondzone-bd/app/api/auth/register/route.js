import { dbConnect } from '@/lib/mongodb.js'
import User from '@/models/User.js'
import { hashPassword, generateToken } from '@/lib/auth.js'
import { apiResponse, apiError } from '@/lib/api-helpers.js'
import { validateEmail, validatePhone, sanitizeString } from '@/lib/validation.js'
import { rateLimit } from '@/lib/redis.js'
import { sendWelcomeEmail } from '@/lib/email.js'
import { nanoid } from 'nanoid'
import { cookies } from 'next/headers'

export async function POST(request) {
    try {
        const body = await request.json()
        const name = sanitizeString(body.name)
        const email = sanitizeString(body.email)
        const password = body.password // Do not sanitize
        const phone = sanitizeString(body.phone)
        const referral_code_input = sanitizeString(body.referral_code || '')
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'

        // 1. Rate Limiting: 5 attempts per IP per hour
        const isAllowed = await rateLimit(`reg_ip:${ip}`, 5, 3600)
        if (!isAllowed) return apiError('Too many registration attempts. Please try again in 1 hour.', 429)

        // 2. Validation
        if (!name || name.length < 2) return apiError('Full name is required')
        if (!email || !validateEmail(email)) return apiError('Valid email is required')
        if (!password || password.length < 6) return apiError('Password must be at least 6 characters')
        if (phone && !validatePhone(phone)) return apiError('Invalid phone number (format: 01xxxxxxxxx)')

        await dbConnect()

        // 3. Check duplicates
        const existing = await User.findOne({ email: email.toLowerCase() })
        if (existing) return apiError('Email already registered', 409)

        // 4. Hash password
        const hashedPassword = await hashPassword(password)

        // 5. Generate referral code
        let referralCode = nanoid(8).toUpperCase()
        let duplicateCode = await User.findOne({ referral_code: referralCode })
        while (duplicateCode) {
            referralCode = nanoid(8).toUpperCase()
            duplicateCode = await User.findOne({ referral_code: referralCode })
        }

        // 6. Handle referral_by
        let referred_by = null
        if (referral_code_input) {
            const referrer = await User.findOne({ referral_code: referral_code_input.toUpperCase() })
            if (referrer) referred_by = referrer._id
        }

        // 7. Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            referral_code: referralCode,
            referred_by,
            is_verified: false,
        })

        // 8. Token and Cookie
        const token = generateToken({ userId: user._id, email: user.email, role: user.role })
        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 604800, // 7 days
            path: '/',
            sameSite: 'strict',
        })

        // 9. Welcome Email
        await sendWelcomeEmail(user)

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
        console.error('Registration error:', error)
        return apiError('Server error during registration', 500)
    }
}