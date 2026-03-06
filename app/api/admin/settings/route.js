import { dbConnect } from '@/lib/mongodb'
import { requireAdmin } from '@/lib/auth'
import { getSettings, updateSetting } from '@/lib/settings'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req) {
    try {
        await requireAdmin()
        const settings = await getSettings()
        return successResponse({ settings })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}

export async function POST(req) {
    try {
        const user = await requireAdmin()
        const body = await req.json()
        const { key, value } = body

        if (!key) return errorResponse('Key is required', 400)

        const success = await updateSetting(key, value, user.id)
        if (success) {
            return successResponse({ message: `Setting ${key} updated successfully.` })
        } else {
            return errorResponse('Failed to update setting', 500)
        }
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}
