import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import Coupon from '@/models/Coupon'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function PUT(req, { params }) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)
        const { id } = await params
        const body = await req.json()
        await dbConnect()

        await Coupon.findByIdAndUpdate(id, body)
        return successResponse({ message: 'Mission code re-calibrated successfully.' })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}

export async function DELETE(req, { params }) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)
        const { id } = await params
        await dbConnect()

        await Coupon.findByIdAndDelete(id)
        return successResponse({ message: 'Mission code dismantled.' })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}