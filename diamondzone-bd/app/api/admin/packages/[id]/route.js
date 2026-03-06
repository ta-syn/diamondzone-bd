import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import Package from '@/models/Package'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req, { params }) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)
        const { id } = await params
        await dbConnect()
        const pkg = await Package.findById(id).lean()
        return successResponse({ package: pkg })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}

export async function PUT(req, { params }) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)
        const { id } = await params
        const body = await req.json()
        await dbConnect()

        await Package.findByIdAndUpdate(id, body)
        return successResponse({ message: 'Cargo re-calibrated successfully.' })
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

        await Package.findByIdAndDelete(id)
        return successResponse({ message: 'Cargo dismantled.' })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}