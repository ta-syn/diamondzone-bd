import { dbConnect } from '@/lib/mongodb.js'
import User from '@/models/User.js'
import { getAuthUser } from '@/lib/auth.js'
import { apiResponse, apiError } from '@/lib/api-helpers.js'

export async function GET(request) {
    try {
        // 1. Authenticate (Next.js 15 cookies inside lib/auth.js)
        const userPayload = await getAuthUser()
        if (!userPayload) return apiResponse({ user: null, authenticated: false })

        // 2. Database connection
        await dbConnect()

        // 3. Find user in database
        const user = await User.findById(userPayload.userId).select('-password')

        if (!user) return apiError('User no longer exists', 404)

        return apiResponse({ user })

    } catch (error) {
        console.error('Me error:', error)
        return apiError('Server error', 500)
    }
}