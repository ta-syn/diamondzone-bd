import { dbConnect } from '@/lib/mongodb'
import Order from '@/models/Order'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req, { params }) {
    try {
        const { id } = await params
        await dbConnect()

        // Find order strictly by the human-readable order_id (e.g. DZ-2025-XXXXX)
        const order = await Order.findOne({ order_id: id })
            .populate('game_id', 'name emoji slug gradient_from gradient_to currency_name')
            .populate('package_id', 'name amount badge_text')
            .lean()

        if (!order) return errorResponse('Order not found', 404)

        // MASK PLAYER ID: first 3 + X* + last 2
        let maskedId = order.player_id
        if (maskedId && maskedId.length > 5) {
            const first3 = maskedId.substring(0, 3)
            const last2 = maskedId.substring(maskedId.length - 2)
            const middleX = 'X'.repeat(maskedId.length - 5)
            maskedId = `${first3}${middleX}${last2}`
        }

        // Sanitize sensitive fields for public tracking
        const sanitizedOrder = {
            order_id: order.order_id,
            game_name: order.game_name,
            game_slug: order.game_slug,
            package_name: order.package_name,
            package_amount: order.package_amount,
            amount_paid: order.amount_paid,
            player_id: maskedId,
            server: order.server,
            payment_method: order.payment_method,
            status: order.status,
            status_history: order.status_history,
            createdAt: order.createdAt,
            completed_at: order.completed_at,
            game: order.game_id,
            package: order.package_id,
            // Explicitly exclude sensitive internal data
            cost_price: undefined,
            profit: undefined,
            recharge_api_response: undefined,
            payment_transaction_id: undefined,
            ssl_val_id: undefined,
            admin_note: undefined
        }

        return successResponse({ order: sanitizedOrder })
    } catch (error) {
        return errorResponse(error.message, 500)
    }
}