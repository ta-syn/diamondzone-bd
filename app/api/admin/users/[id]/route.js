import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import User from '@/models/User'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req, { params }) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)
        const { id } = await params
        await dbConnect()
        const targetUser = await User.findById(id).select('-password').lean()
        if (!targetUser) return errorResponse('Operator not found', 404)
        return successResponse({ user: targetUser })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}

export async function PUT(req, { params }) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)
        const { id } = await params
        const rawBody = await req.json()
        await dbConnect()

        // Explicit field selection for security
        const updates = {}
        const allowed = ['role', 'is_banned', 'ban_reason', 'reseller_approved', 'reseller_credit_limit']

        allowed.forEach(field => {
            if (rawBody[field] !== undefined) {
                updates[field] = rawBody[field]
            }
        })

        const targetUser = await User.findByIdAndUpdate(id, updates, { new: true })
        if (!targetUser) return errorResponse('Target operator not found in localized database.', 404)

        return successResponse({
            message: `Operator clearance re-calibrated. [Fields: ${Object.keys(updates).join(', ')}]`,
            user: targetUser
        })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}