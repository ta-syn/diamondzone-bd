import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import User from '@/models/User'
import { successResponse, errorResponse } from '@/lib/api-helpers'
import { sanitizeString } from '@/lib/validation'

export async function GET() {
    try {
        const user = await getAuthUser()
        if (!user) return errorResponse('Authentication required.', 401)

        await dbConnect()
        const dbUser = await User.findById(user.userId || user.id).select('-password').lean()
        if (!dbUser) return errorResponse('Operative not found in database.', 404)

        return successResponse({ user: dbUser })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}

export async function PUT(req) {
    try {
        const user = await getAuthUser()
        if (!user) return errorResponse('Authentication required.', 401)

        const body = await req.json()
        const updateData = {}

        if (body.name) updateData.name = sanitizeString(body.name)
        if (body.phone) updateData.phone = sanitizeString(body.phone)

        await dbConnect()
        const dbUser = await User.findByIdAndUpdate(user.userId || user.id, updateData, { new: true }).select('-password').lean()

        return successResponse({ user: dbUser, message: 'Profile protocols updated successfully.' })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}