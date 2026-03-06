import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import User from '@/models/User'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)

        const { searchParams } = new URL(req.url)
        const search = searchParams.get('search')
        const role = searchParams.get('role')
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 20
        const skip = (page - 1) * limit

        await dbConnect()
        const query = {}
        if (role && role !== 'all') query.role = role
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ]
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('-password')
                .lean(),
            User.countDocuments(query)
        ])

        return successResponse({
            users,
            pagination: { total, page, limit, pages: Math.ceil(total / limit) }
        })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}