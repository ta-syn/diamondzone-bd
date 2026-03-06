import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import ResellerApplication from '@/models/ResellerApplication'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function POST(req) {
    try {
        const user = await getAuthUser()
        if (!user) return errorResponse('Authentication required to upload operative data.', 401)

        const body = await req.json()
        const { whatsapp, business_name, message } = body

        if (!whatsapp || !business_name) {
            return errorResponse('Critical coordinates missing: WhatsApp and Business Name required.', 400)
        }

        await dbConnect()

        // Check for existing pending application
        const existing = await ResellerApplication.findOne({ user_id: user.userId || user.id, status: 'pending' })
        if (existing) return errorResponse('You already have a pending application. Please wait for calibration.', 400)

        // Create application
        await ResellerApplication.create({
            user_id: user.userId || user.id,
            whatsapp,
            business_name,
            message
        })

        return successResponse({
            message: 'Application transmission successful. Stand by for response from High Command.'
        })
    } catch (error) {
        console.error('Reseller Application Error:', error)
        return errorResponse(error.message, 500)
    }
}
