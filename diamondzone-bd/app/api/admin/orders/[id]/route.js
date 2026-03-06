import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import Order from '@/models/Order'
import User from '@/models/User'
import Transaction from '@/models/Transaction'
import { successResponse, errorResponse } from '@/lib/api-helpers'
import { sendOrderCompleted, sendOrderFailed } from '@/lib/email'

export async function GET(req, { params }) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'admin') return errorResponse('Forbidden', 403)

        const { id } = await params
        await dbConnect()

        const order = await Order.findById(id).populate('user_id', 'name email wallet_balance').lean()
        if (!order) return errorResponse('Order not found', 404)

        return successResponse({ order })
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
        const { status, admin_note } = body

        await dbConnect()
        const order = await Order.findById(id)
        if (!order) return errorResponse('Order not found', 404)

        // 1. Handle Refund Trigger
        if (status === 'refunded' && order.status !== 'refunded') {
            if (!order.user_id) return errorResponse('Cannot auto-refund guest order', 400)

            const dbUser = await User.findById(order.user_id)
            if (!dbUser) return errorResponse('Buyer not found', 404)

            const balanceBefore = dbUser.wallet_balance
            dbUser.wallet_balance += order.amount_paid
            await dbUser.save()

            await Transaction.create({
                user_id: dbUser._id,
                type: 'refund',
                amount: order.amount_paid,
                balance_before: balanceBefore,
                balance_after: dbUser.wallet_balance,
                reference_id: order.order_id,
                note: `Refund for mission ${order.order_id} - Processed by ${user.name}`
            })

            order.status_history.push({
                status: 'refunded',
                note: `Refunded ৳${order.amount_paid} to wallet. Ref: ${user.name}`
            })
        } else if (status && status !== order.status) {
            order.status_history.push({
                status,
                note: `Mission status re-calibrated. Operative: ${user.name}`
            })
            order.status = status
        }

        if (status === 'completed') {
            order.completed_at = new Date()
        }

        if (admin_note !== undefined) {
            order.admin_note = admin_note
        }

        await order.save()

        // 3. Status Change Notifications
        if (status === 'completed') {
            await sendOrderCompleted(order, await User.findById(order.user_id))
        } else if (status === 'refunded') {
            await sendOrderFailed(order, await User.findById(order.user_id))
        }

        return successResponse({ order, message: 'Mission parameters updated' })

    } catch (error) {
        console.error('Update Order Error:', error)
        return errorResponse(error.message, 500)
    }
}