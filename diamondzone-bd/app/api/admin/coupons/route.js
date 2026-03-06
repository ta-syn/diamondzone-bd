import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import Coupon from '@/models/Coupon'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)

        await dbConnect()
        const coupons = await Coupon.find().sort({ createdAt: -1 }).lean()
        return successResponse({ coupons })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}

export async function POST(req) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)

        const body = await req.json()
        await dbConnect()

        if (body.code) body.code = body.code.toUpperCase().trim()

        const coupon = await Coupon.create(body)
        return successResponse({ coupon, message: 'New mission code generated' })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}