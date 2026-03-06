import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['deposit', 'purchase', 'refund', 'commission', 'adjustment', 'referral'],
        required: true
    },
    amount: { type: Number, required: true },
    balance_before: { type: Number, required: true },
    balance_after: { type: Number, required: true },
    reference_id: { type: String },
    note: { type: String },
}, { timestamps: true })

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema)
export default Transaction