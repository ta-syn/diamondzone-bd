import axios from 'axios'
import crypto from 'crypto'
import { dbConnect } from '@/lib/mongodb'
import Game from '@/models/Game'
import Package from '@/models/Package'
import Order from '@/models/Order'
import User from '@/models/User'
import Transaction from '@/models/Transaction'

const SMILE_EMAIL = process.env.SMILEONE_EMAIL
const SMILE_API_KEY = process.env.SMILEONE_API_KEY
const SMILE_BASE_URL = process.env.SMILEONE_API_URL || 'https://www.smile.one/smilecoin/api/'

function generateSign(params) {
    // Sort params alphabetically, concatenate key=value pairs, append api_key
    const sorted = Object.keys(params).sort()
    let str = ''
    sorted.forEach(key => { str += `${key}=${params[key]}` })
    str += SMILE_API_KEY
    return crypto.createHash('md5').update(str).digest('hex')
}

export async function smileoneGetProductList(productId, region) {
    const params = {
        uid: SMILE_EMAIL,
        email: SMILE_EMAIL,
        product: productId,
        time: Math.floor(Date.now() / 1000),
    }
    params.sign = generateSign(params)
    const res = await axios.post(`${SMILE_BASE_URL}getpackage`, new URLSearchParams(params))
    return res.data
}

export async function smileoneCreateOrder({ productId, sku, userId, serverId = '', region = 'ID' }) {
    // userId = player ID, serverId = server ID (for ML it's zone ID)
    const params = {
        uid: SMILE_EMAIL,
        email: SMILE_EMAIL,
        product: productId,
        sku: sku,
        user_id: userId,
        time: Math.floor(Date.now() / 1000),
        quantity: '1',
    }
    if (serverId) params.server_id = serverId
    if (region) params.region = region // Some products require region

    params.sign = generateSign(params)

    try {
        const res = await axios.post(`${SMILE_BASE_URL}createorder`, new URLSearchParams(params), {
            timeout: 30000,
        })
        return res.data
    } catch (error) {
        throw new Error(`Smile.one API error: ${error.message}`)
    }
}

export async function smileoneQueryOrder(orderNo) {
    const params = {
        uid: SMILE_EMAIL,
        email: SMILE_EMAIL,
        order_no: orderNo,
        time: Math.floor(Date.now() / 1000),
    }
    params.sign = generateSign(params)
    const res = await axios.post(`${SMILE_BASE_URL}queryorder`, new URLSearchParams(params))
    return res.data
}

export async function processRecharge(order) {
    // Fetch game + package with smileone fields
    await dbConnect()
    const game = await Game.findById(order.game_id)
    const pkg = await Package.findById(order.package_id)

    if (!game?.smileone_product_id || !pkg?.smileone_sku) {
        // Manual processing fallback (for games without Smile.one)
        await Order.findByIdAndUpdate(order._id, {
            status: 'processing',
            admin_note: 'Manual processing required - no API configured',
            $push: {
                status_history: {
                    status: 'processing',
                    changed_at: new Date(),
                    note: 'Queued for manual processing'
                }
            }
        })

        // Notify user about processing via SMS
        try {
            const { notifyOrderStatus } = await import('./sms.js')
            await notifyOrderStatus(order, 'processing')
        } catch (e) { }

        return
    }

    try {
        let userId = order.player_id
        let serverId = order.server || ''

        if (game.slug === 'mobile-legends') {
            const { parseMLId } = await import('./validation.js')
            const parsed = parseMLId(order.player_id)
            userId = parsed.userId
            serverId = parsed.zoneId
        }

        const result = await smileoneCreateOrder({
            productId: game.smileone_product_id,
            sku: pkg.smileone_sku,
            userId,
            serverId,
            region: game.smileone_region || 'ID'
        })

        if (result.status === 0) {
            // SUCCESS
            const now = new Date()
            await Order.findByIdAndUpdate(order._id, {
                status: 'completed',
                completed_at: now,
                recharge_api_response: result,
                $push: {
                    status_history: {
                        status: 'completed',
                        changed_at: now,
                        note: 'Recharge delivered via Smile.one'
                    }
                }
            })
            await Game.findByIdAndUpdate(order.game_id, { $inc: { total_orders: 1 } })

            // Notifications
            const { sendOrderCompleted } = await import('./email.js')
            const { notifyOrderStatus } = await import('./sms.js')
            const user = order.user_id ? await User.findById(order.user_id) : null

            await sendOrderCompleted(order, user || { email: order.email, name: 'Gamer' })
            await notifyOrderStatus(order, 'completed')

            // Referral commission
            if (order.user_id) {
                const { processReferralCommission } = await import('./referral.js')
                await processReferralCommission(order)
            }
        } else {
            throw new Error(result.message || 'Recharge failed')
        }
    } catch (error) {
        console.error('Recharge error:', error.message)
        await Order.findByIdAndUpdate(order._id, { $inc: { retry_count: 1 } })

        const updatedOrder = await Order.findById(order._id)
        if (updatedOrder.retry_count >= 3) {
            await handleRefund(updatedOrder)
        } else {
            // Retry after 30 seconds
            setTimeout(() => processRecharge(order), 30000)
        }
    }
}

async function handleRefund(order) {
    await Order.findByIdAndUpdate(order._id, {
        status: 'refunded',
        $push: {
            status_history: {
                status: 'refunded',
                changed_at: new Date(),
                note: 'Auto-refund after 3 failed API attempts'
            }
        }
    })

    if (order.user_id) {
        const user = await User.findById(order.user_id)
        const newBalance = user.wallet_balance + order.amount_paid
        await User.findByIdAndUpdate(order.user_id, { wallet_balance: newBalance })
        await Transaction.create({
            user_id: order.user_id,
            type: 'refund',
            amount: order.amount_paid,
            balance_before: user.wallet_balance,
            balance_after: newBalance,
            reference_id: order.order_id,
            note: `Auto-refund: API failed 3 times for ${order.order_id}`
        })
    }

    const { sendOrderFailed } = await import('./email.js')
    await sendOrderFailed(order, { email: order.email })
}