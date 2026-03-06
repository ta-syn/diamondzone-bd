import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import { rateLimit } from '@/lib/redis'
import { validateOrderBody, sanitizeString } from '@/lib/validation'
import { successResponse, errorResponse } from '@/lib/api-helpers'
import Order from '@/models/Order'
import Game from '@/models/Game'
import Package from '@/models/Package'
import User from '@/models/User'
import Transaction from '@/models/Transaction'
import { processRecharge } from '@/lib/recharge'

export async function POST(req) {
    try {
        const user = await getAuthUser()
        if (!user || user.role !== 'reseller' || !user.reseller_approved) {
            return errorResponse('Forbidden: Reseller clearance required', 403)
        }

        const rawBody = await req.json()

        // 1. Sanitize Inputs
        const body = {
            package_id: sanitizeString(rawBody.package_id),
            player_id: sanitizeString(rawBody.player_id),
            server: sanitizeString(rawBody.server || ''),
            email: sanitizeString(rawBody.email || ''),
            phone: sanitizeString(rawBody.phone || '')
        }

        // 2. Validate Order Body (Minimal validation for reseller)
        const validationError = validateOrderBody(body)
        if (validationError) return errorResponse(validationError, 400)

        // 3. Rate Limiting: 50 orders per hour for resellers
        const isAllowed = await rateLimit(`reseller_order:${user.id}`, 50, 3600)
        if (!isAllowed) return errorResponse('Daily mission limit reached. Request limited to 50 per hour.', 429)

        await dbConnect()

        // 4. Fetch Package & Game
        const pkg = await Package.findById(body.package_id).populate('game_id')
        if (!pkg || pkg.status !== 'active') return errorResponse('Target package offline', 404)

        const game = pkg.game_id
        if (!game || game.status !== 'active') return errorResponse('Ecosystem offline', 404)

        // 5. Atomic Stock Update
        if (pkg.stock !== null) {
            const updated = await Package.findOneAndUpdate(
                { _id: pkg._id, stock: { $gt: 0 } },
                { $inc: { stock: -1 } },
                { new: true }
            )
            if (!updated) return errorResponse('Target package depleted (Out of Stock)', 400)
        }

        // 6. Reseller Pricing & Balance Check
        const finalCost = pkg.price_reseller || pkg.sell_price

        const dbUser = await User.findById(user.id)
        if (dbUser.reseller_credit_limit < finalCost) {
            // Rollback Stock if failure
            if (pkg.stock !== null) await Package.findByIdAndUpdate(pkg._id, { $inc: { stock: 1 } })
            return errorResponse('Insufficient command credit reserve', 400)
        }

        // 7. Atomic Credit Deduction
        const balanceBefore = dbUser.reseller_credit_limit
        dbUser.reseller_credit_limit -= finalCost
        await dbUser.save()

        // 8. Create Reseller Order
        const order = await Order.create({
            user_id: user.id,
            game_id: game._id,
            game_name: game.name,
            game_slug: game.slug,
            package_id: pkg._id,
            package_name: pkg.name,
            package_amount: pkg.amount,
            player_id: body.player_id,
            server: body.server,
            email: body.email,
            phone: body.phone,
            amount_paid: finalCost,
            cost_price: pkg.cost_price,
            profit: finalCost - pkg.cost_price,
            payment_method: 'wallet', // Internal credit behaves like wallet
            is_reseller: true,
            status: 'processing',
            status_history: [{ status: 'processing', note: 'Paid via Reseller Credit' }]
        })

        // 9. Record Transaction Telegram
        await Transaction.create({
            user_id: user.id,
            type: 'purchase',
            amount: finalCost,
            balance_before: balanceBefore,
            balance_after: dbUser.reseller_credit_limit,
            reference_id: order.order_id,
            note: `Reseller Purchase: ${pkg.name} for ${game.name}`
        })

        // 10. Direct Execute Recharge
        processRecharge(order)

        return successResponse({
            message: 'Mission accepted. Execution in progress.',
            order_id: order.order_id,
            remaining_credit: dbUser.reseller_credit_limit
        })

    } catch (error) {
        console.error('Reseller Recharge Error:', error)
        return errorResponse(error.message || 'Mission execution failed', 500)
    }
}