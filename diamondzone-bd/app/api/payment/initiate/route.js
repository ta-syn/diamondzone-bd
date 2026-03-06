import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import { rateLimit } from '@/lib/redis'
import { validateOrderBody, sanitizeString } from '@/lib/validation'
import { successResponse, errorResponse } from '@/lib/api-helpers'
import Order from '@/models/Order'
import Game from '@/models/Game'
import Package from '@/models/Package'
import Coupon from '@/models/Coupon'
import User from '@/models/User'
import Transaction from '@/models/Transaction'
import SSLCommerzPayment from 'sslcommerz-lts'
import { processRecharge } from '@/lib/recharge'

export async function POST(req) {
    try {
        const user = await getAuthUser()
        const rawBody = await req.json()

        // 1. Sanitize Inputs
        const body = {
            package_id: sanitizeString(rawBody.package_id),
            player_id: sanitizeString(rawBody.player_id),
            server: sanitizeString(rawBody.server || ''),
            email: sanitizeString(rawBody.email || ''),
            phone: sanitizeString(rawBody.phone || ''),
            payment_method: sanitizeString(rawBody.payment_method || ''),
            coupon_code: sanitizeString(rawBody.coupon_code || '')
        }

        // 2. Validate Order Body
        const validationError = validateOrderBody(body)
        if (validationError) return errorResponse(validationError, 400)

        const {
            package_id,
            player_id,
            server,
            email,
            phone,
            payment_method,
            coupon_code
        } = body

        // 3. Rate Limiting: 10 orders per user per hour
        const limitId = user ? `order:${user.id}` : `order_guest:${req.headers.get('x-forwarded-for') || 'anon'}`
        const isAllowed = await rateLimit(limitId, 10, 3600)
        if (!isAllowed) return errorResponse('Too many order attempts. Request limited to 10 per hour.', 429)

        await dbConnect()

        // 4. Fetch Package & Game (SERVER-SIDE SOURCE OF TRUTH)
        const pkg = await Package.findById(package_id).populate('game_id')
        if (!pkg || pkg.status !== 'active') return errorResponse('Package not found or inactive', 404)

        const game = pkg.game_id
        if (!game || game.status !== 'active') return errorResponse('Game not found or inactive', 404)

        // 5. Atomic Stock Update
        if (pkg.stock !== null) {
            const updated = await Package.findOneAndUpdate(
                { _id: pkg._id, stock: { $gt: 0 } },
                { $inc: { stock: -1 } },
                { new: true }
            )
            if (!updated) return errorResponse('Package out of stock', 400, 'OUT_OF_STOCK')
        }

        // 6. Calculate Final Price (SERVER-SIDE)
        let finalAmount = pkg.sell_price
        let discountAmount = 0

        if (coupon_code) {
            const coupon = await Coupon.findOne({
                code: coupon_code.toUpperCase(),
                status: 'active',
                expiry_date: { $gt: new Date() }
            })

            if (coupon) {
                // Server-side loyalty validation
                if (coupon.type === 'percentage') {
                    discountAmount = Math.floor((finalAmount * coupon.value) / 100)
                } else {
                    discountAmount = coupon.value
                }

                if (coupon.max_discount && discountAmount > coupon.max_discount) {
                    discountAmount = coupon.max_discount
                }

                if (coupon.min_order && finalAmount < coupon.min_order) {
                    // Ignore coupon if min order not met
                    discountAmount = 0
                }

                finalAmount = Math.max(0, finalAmount - discountAmount)
            }
        }

        // 7. Handle Wallet Payment
        if (payment_method === 'wallet') {
            if (!user) return errorResponse('You must be logged in to use wallet', 401)

            const dbUser = await User.findById(user.id)
            if (dbUser.wallet_balance < finalAmount) {
                // Rollback Stock if failure
                if (pkg.stock !== null) await Package.findByIdAndUpdate(pkg._id, { $inc: { stock: 1 } })
                return errorResponse('Insufficient wallet balance', 400)
            }

            // Deduct balance
            const balanceBefore = dbUser.wallet_balance
            dbUser.wallet_balance -= finalAmount
            await dbUser.save()

            // Create Order
            const order = await Order.create({
                user_id: user.id,
                game_id: game._id,
                game_name: game.name,
                game_slug: game.slug,
                package_id: pkg._id,
                package_name: pkg.name,
                package_amount: pkg.amount,
                player_id,
                server,
                email,
                phone,
                amount_paid: finalAmount,
                cost_price: pkg.cost_price,
                profit: finalAmount - pkg.cost_price,
                payment_method: 'wallet',
                coupon_code,
                discount_amount: discountAmount,
                status: 'processing',
                status_history: [{ status: 'processing', note: 'Paid via wallet' }]
            })

            // Record Transaction
            await Transaction.create({
                user_id: user.id,
                type: 'purchase',
                amount: finalAmount,
                balance_before,
                balance_after: dbUser.wallet_balance,
                reference_id: order.order_id,
                note: `Purchased ${pkg.name} for ${game.name}`
            })

            // Trigger Recharge
            processRecharge(order)

            return successResponse({
                message: 'Order placed via wallet',
                order_id: order.order_id
            })
        }

        // 8. Handle SSLCommerz Payment Initiation
        const order = await Order.create({
            user_id: user?.id || null,
            game_id: game._id,
            game_name: game.name,
            game_slug: game.slug,
            package_id: pkg._id,
            package_name: pkg.name,
            package_amount: pkg.amount,
            player_id,
            server,
            email,
            phone,
            amount_paid: finalAmount,
            cost_price: pkg.cost_price,
            profit: finalAmount - pkg.cost_price,
            payment_method,
            coupon_code,
            discount_amount: discountAmount,
            status: 'pending'
        })

        const sslcz = new SSLCommerzPayment(
            process.env.SSLCOMMERZ_STORE_ID,
            process.env.SSLCOMMERZ_STORE_PASSWORD,
            process.env.SSLCOMMERZ_IS_LIVE === 'true'
        )

        const paymentData = {
            total_amount: finalAmount,
            currency: 'BDT',
            tran_id: order.order_id,
            success_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/webhook`,
            fail_url: `${process.env.NEXT_PUBLIC_URL}/payment/fail?order_id=${order.order_id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/fail?order_id=${order.order_id}&cancelled=1`,
            ipn_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/webhook`,
            product_name: `${game.name} - ${pkg.name}`,
            product_category: 'Gaming Top-Up',
            product_profile: 'non-physical-goods',
            cus_name: user?.name || 'Guest',
            cus_email: email,
            cus_phone: phone || '01700000000',
            cus_add1: 'Dhaka',
            cus_city: 'Dhaka',
            cus_country: 'Bangladesh',
            shipping_method: 'NO',
            num_of_item: 1,
            weight_of_item: 0,
        }

        const apiResponse = await sslcz.init(paymentData)

        if (apiResponse?.GatewayPageURL) {
            return successResponse({
                url: apiResponse.GatewayPageURL,
                order_id: order.order_id
            })
        }

        // Rollback stock on fail
        if (pkg.stock !== null) await Package.findByIdAndUpdate(pkg._id, { $inc: { stock: 1 } })
        throw new Error('SSLCommerz initiation failed')

    } catch (error) {
        console.error('Payment initiation error:', error)
        return errorResponse(error.message || 'Payment initiation failed', 500)
    }
}