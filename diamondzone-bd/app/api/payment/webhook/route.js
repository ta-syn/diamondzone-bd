import { dbConnect } from '@/lib/mongodb'
import Order from '@/models/Order'
import Deposit from '@/models/Deposit'
import User from '@/models/User'
import Transaction from '@/models/Transaction'
import { processRecharge } from '@/lib/recharge'
import { sendWalletDeposit } from '@/lib/email'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

// Verify SSLCommerz Signature
function verifySignature(params, storePassword) {
    const { verify_sign, verify_key } = params
    if (!verify_sign || !verify_key) return false

    // Sort keys and build verify string
    const keys = verify_key.split(',').sort()
    let str = storePassword
    keys.forEach(key => {
        str += `${key}=${params[key] || ''}`
    })

    const hash = crypto.createHash('md5').update(str).digest('hex')
    return hash === verify_sign
}

export async function POST(req) {
    try {
        const formData = await req.formData()
        const params = Object.fromEntries(formData.entries())

        const {
            tran_id,
            status,
            val_id,
            amount,
            currency,
            store_amount,
            bank_tran_id
        } = params

        await dbConnect()

        // 1. Check if it's an Order or a Deposit
        const order = await Order.findOne({ order_id: tran_id })
        const deposit = !order ? await Deposit.findOne({ deposit_id: tran_id }) : null

        if (!order && !deposit) return new Response('Transaction not found', { status: 404 })

        const target = order || deposit
        const redirectBase = order ? 'payment' : 'dashboard?tab=wallet'
        const successRedirect = `${process.env.NEXT_PUBLIC_URL}/${redirectBase}${order ? '/success?order_id=' + tran_id : ''}`
        const failRedirect = `${process.env.NEXT_PUBLIC_URL}/${order ? 'payment/fail?order_id=' : 'dashboard?tab=wallet&error='}${tran_id}`

        // 2. Already Processed Check
        if (target.status !== 'pending') {
            return NextResponse.redirect(successRedirect, { status: 303 })
        }

        // 3. Verify Signature & Status
        const isValid = verifySignature(params, process.env.SSLCOMMERZ_STORE_PASSWORD)

        if (isValid && (status === 'VALID' || status === 'VALIDATED')) {
            if (order) {
                // Update Order Status
                await Order.findByIdAndUpdate(order._id, {
                    status: 'processing',
                    payment_transaction_id: bank_tran_id || val_id,
                    ssl_val_id: val_id,
                    $push: {
                        status_history: {
                            status: 'processing',
                            note: `Payment verified: ${val_id}`
                        }
                    }
                })

                // Trigger Recharge in background
                processRecharge(await Order.findById(order._id))

            } else if (deposit) {
                // Update Deposit and Wallet Balance
                const user = await User.findById(deposit.user_id)
                if (user) {
                    const balanceBefore = user.wallet_balance
                    const depositAmt = parseFloat(amount)
                    user.wallet_balance += depositAmt
                    await user.save()

                    // Record Transaction
                    await Transaction.create({
                        user_id: user._id,
                        type: 'deposit',
                        amount: depositAmt,
                        balance_before: balanceBefore,
                        balance_after: user.wallet_balance,
                        reference_id: deposit.deposit_id,
                        note: `Wallet top-up via SSLCommerz (${bank_tran_id || val_id})`
                    })

                    await Deposit.findByIdAndUpdate(deposit._id, {
                        status: 'completed',
                        ssl_val_id: val_id,
                        bank_tran_id: bank_tran_id
                    })

                    // Send Email Notification
                    await sendWalletDeposit(user, depositAmt)
                }
            }

            return NextResponse.redirect(successRedirect, { status: 303 })
        } else {
            // Mark as Failed
            if (order) {
                await Order.findByIdAndUpdate(order._id, {
                    status: 'cancelled',
                    admin_note: `Payment validation failed: ${status}`,
                    $push: { status_history: { status: 'cancelled', note: 'Payment failed' } }
                })
            } else if (deposit) {
                await Deposit.findByIdAndUpdate(deposit._id, { status: 'cancelled' })
            }

            return NextResponse.redirect(failRedirect, { status: 303 })
        }

    } catch (error) {
        console.error('SSLCommerz Webhook Error:', error)
        return new Response('Webhook Error', { status: 500 })
    }
}