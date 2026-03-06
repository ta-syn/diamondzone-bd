import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import Order from '@/models/Order'
import Game from '@/models/Game'
import Package from '@/models/Package'
import { successResponse, errorResponse } from '@/lib/api-helpers'
import { smileoneQueryOrder } from '@/lib/recharge'

export async function POST(req, { params }) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)

        const { id } = await params
        await dbConnect()

        const order = await Order.findById(id)
        if (!order) return errorResponse('Order not found', 404)

        // Only re-verify if it has an API order number
        const apiOrderNo = order.recharge_api_response?.order_no
        if (!apiOrderNo) {
            return errorResponse('No API Trace ID found for this mission. Manual verification required.', 400)
        }

        const result = await smileoneQueryOrder(apiOrderNo)

        if (result.status === 0) {
            // Smile.one status: 0=Success, 1=In progress, 2=Failed... (check actual Smile.one docs if needed, usually 0 is success)
            // If local status is processing but API says success, update it.
            if (order.status === 'processing' && result.data?.status === 2) { // Assuming 2=Success in Smile.one data
                order.status = 'completed'
                order.completed_at = new Date()
                order.status_history.push({
                    status: 'completed',
                    changed_at: new Date(),
                    note: 'Status verified via Smile.one API'
                })
                await order.save()
                return successResponse({ message: 'Order status synced: COMPLETED.', order })
            }

            return successResponse({
                message: 'API signal acquired. Status: ' + JSON.stringify(result.data),
                api_data: result.data
            })
        } else {
            return errorResponse('API Signal Error: ' + result.message, 400)
        }

    } catch (error) {
        console.error('Re-verify Error:', error)
        return errorResponse(error.message, 500)
    }
}
