import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
    code: { type: String, unique: true, uppercase: true, required: true },
    description: { type: String },
    discount_type: { type: String, enum: ['percentage', 'fixed'], required: true },
    discount_value: { type: Number, required: true },
    min_order_amount: { type: Number, default: 0 },
    max_uses: { type: Number, default: null },
    used_count: { type: Number, default: 0 },
    per_user_limit: { type: Number, default: 1 },
    applicable_games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    expiry_date: { type: Date },
    status: { type: String, enum: ['active', 'expired', 'disabled'], default: 'active' },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema)
export default Coupon