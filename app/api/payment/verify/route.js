import { dbConnect } from '@/lib/mongodb'
import Order from '@/models/Order'
import axios from 'axios'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const val_id = searchParams.get('val_id')

        if (!val_id) return errorResponse('Validation ID required', 400)

        const store_id = process.env.SSLCOMMERZ_STORE_ID
        const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD
        const is_sandbox = process.env.SSLCOMMERZ_IS_SANDBOX === 'true'
        const domain = is_sandbox ? 'sandbox.sslcommerz.com' : 'securepay.sslcommerz.com'

        const url = `https://${domain}/validator/api/validationserverphp.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`

        const response = await axios.get(url)
        const { status, tran_id, amount, bank_tran_id } = response.data

        if (status === 'VALID' || status === 'VALIDATED') {
            await dbConnect()
            const order = await Order.findOne({ order_id: tran_id })
            if (order && order.status === 'pending') {
                order.status = 'processing'
                order.payment_transaction_id = bank_tran_id || val_id
                order.ssl_val_id = val_id
                order.status_history.push({
                    status: 'processing',
                    note: `Payment manually verified: ${val_id}`
                })
                await order.save()
            }
            return successResponse({ message: 'Payment signal verified.', data: response.data })
        }

        return errorResponse('Payment signal invalid: ' + status, 400)

    } catch (error) {
        return errorResponse('Verification system failure: ' + error.message, 500)
    }
}
