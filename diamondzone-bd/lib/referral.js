import User from '@/models/User'
import Transaction from '@/models/Transaction'
import { dbConnect } from '@/lib/mongodb'

/**
 * Processes referral commission after a successful order.
 * Rule: Referrer gets 2% of the amount paid as wallet credit.
 */
export async function processReferralCommission(order) {
    if (!order.user_id) return

    try {
        await dbConnect()

        // 1. Find the buyer to see who referred them
        const buyer = await User.findById(order.user_id)
        if (!buyer || !buyer.referred_by) return

        // 2. Find the referrer
        const referrer = await User.findById(buyer.referred_by)
        if (!referrer || referrer.is_banned) return

        // 3. Calculate 2% commission (minimum 1 TK)
        const COMMISSION_RATE = 0.02
        const commissionAmount = Math.max(1, Math.floor(order.amount_paid * COMMISSION_RATE))

        // 4. Update referrer's balance
        const balanceBefore = referrer.wallet_balance
        const balanceAfter = balanceBefore + commissionAmount

        await User.findByIdAndUpdate(referrer._id, {
            $inc: { wallet_balance: commissionAmount }
        })

        // 5. Record Transaction
        await Transaction.create({
            user_id: referrer._id,
            type: 'referral', // Changed to referral per instruction context
            amount: commissionAmount,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            reference_id: order.order_id,
            note: `2% referral commission from order ${order.order_id}`
        })

        console.log(`Referral commission of ৳${commissionAmount} processed for ${referrer.name}`)

    } catch (error) {
        console.error('Referral commission processing error:', error)
    }
}