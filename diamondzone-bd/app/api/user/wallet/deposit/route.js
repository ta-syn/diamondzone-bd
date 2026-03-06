import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import { rateLimit } from '@/lib/redis'
import { sanitizeString } from '@/lib/validation'
import Deposit from '@/models/Deposit'
import { successResponse, errorResponse } from '@/lib/api-helpers'
import SSLCommerzPayment from 'sslcommerz-lts'

export async function POST(req) {
    try {
        const user = await getAuthUser()
        if (!user) return errorResponse('Unauthorized', 401)

        const rawBody = await req.json()
        const amount = parseFloat(rawBody.amount)
        const payment_method = sanitizeString(rawBody.payment_method || 'sslcommerz')

        // 1. Rate Limiting: 10 per user per hour
        const isAllowed = await rateLimit(`deposit:${user.id}`, 10, 3600)
        if (!isAllowed) return errorResponse('Too many deposit attempts. Request limited to 10 per hour.', 429)

        if (!amount || amount < 10) return errorResponse('Minimum deposit ৳10 required', 400)

        await dbConnect()

        // 2. Create Pending Deposit Record
        const deposit = await Deposit.create({
            user_id: user.id,
            amount,
            payment_method,
            status: 'pending'
        })

        // 3. Initiate SSLCommerz
        const sslcz = new SSLCommerzPayment(
            process.env.SSLCOMMERZ_STORE_ID,
            process.env.SSLCOMMERZ_STORE_PASSWORD,
            process.env.SSLCOMMERZ_IS_LIVE === 'true'
        )

        const paymentData = {
            total_amount: amount,
            currency: 'BDT',
            tran_id: deposit.deposit_id,
            success_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/webhook`,
            fail_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?tab=wallet&error=${deposit.deposit_id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?tab=wallet&cancelled=1`,
            ipn_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/webhook`,
            product_name: 'Wallet Deposit',
            product_category: 'Top-Up',
            product_profile: 'non-physical-goods',
            cus_name: user?.name,
            cus_email: user?.email,
            cus_phone: user?.phone || '01700000000',
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
                deposit_id: deposit.deposit_id
            })
        }

        throw new Error('SSLCommerz initiation failed')

    } catch (error) {
        console.error('Deposit initiation error:', error)
        return errorResponse(error.message, 500)
    }
}