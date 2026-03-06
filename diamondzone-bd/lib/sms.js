import axios from 'axios'

/**
 * Interface for SMS delivery in Bangladesh.
 * Supports popular gateways like BulksmsBD, Infobip, and Elitbuzz.
 */
export async function sendSMS(to, message) {
    if (!process.env.SMS_API_KEY) {
        console.log(`[SMS MOCK] To: ${to} | Message: ${message}`)
        return { success: true, mock: true }
    }

    try {
        // Example integration with BulksmsBD
        const params = {
            api_key: process.env.SMS_API_KEY,
            senderid: process.env.SMS_SENDER_ID,
            number: to,
            message: message,
        }

        const response = await axios.get('https://bulksmsbd.net/api/smsapi', { params })

        if (response.data.response_code === 202) {
            return { success: true, data: response.data }
        } else {
            throw new Error(response.data.success_message || 'SMS delivery failed')
        }
    } catch (error) {
        console.error('SMS Gateway Error:', error.message)
        return { success: false, error: error.message }
    }
}

/**
 * Utility to notify user about order status changes via SMS
 */
export async function notifyOrderStatus(order, status) {
    if (!order.phone) return

    let message = ''
    switch (status) {
        case 'completed':
            message = `[DiamondZoneBD] Your order ${order.order_id} is SUCCESSFUL! Enjoy your ${order.package_amount} ${order.game_name}. Thank you!`
            break
        case 'processing':
            message = `[DiamondZoneBD] Order ${order.order_id} is now PROCESSING. We are delivering your ${order.game_name} top-up shortly.`
            break
        case 'refunded':
            message = `[DiamondZoneBD] Order ${order.order_id} FAILED. A full refund of ৳${order.amount_paid} has been added to your wallet.`
            break
        default:
            return
    }

    return await sendSMS(order.phone, message)
}