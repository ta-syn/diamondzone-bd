import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

const orderSchema = new mongoose.Schema({
    order_id: { type: String, unique: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guest_email: { type: String },
    game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    game_name: { type: String },
    game_slug: { type: String },
    package_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    package_name: { type: String },
    package_amount: { type: Number },
    player_id: { type: String, required: true, trim: true },
    server: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    amount_paid: { type: Number, required: true },
    cost_price: { type: Number },
    profit: { type: Number },
    payment_method: { type: String, enum: ['bkash', 'nagad', 'rocket', 'card', 'wallet'] },
    payment_transaction_id: { type: String },
    ssl_val_id: { type: String },
    coupon_code: { type: String, default: null },
    discount_amount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'], default: 'pending' },
    status_history: [{
        status: String,
        changed_at: { type: Date, default: Date.now },
        note: String
    }],
    recharge_api_response: { type: mongoose.Schema.Types.Mixed, default: null },
    retry_count: { type: Number, default: 0 },
    completed_at: { type: Date, default: null },
    admin_note: { type: String },
    is_reseller: { type: Boolean, default: false },
}, { timestamps: true })

orderSchema.pre('save', function (next) {
    if (!this.order_id) {
        this.order_id = `DZ-${new Date().getFullYear()}-${nanoid(5).toUpperCase()}`
    }
    next()
})

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)
export default Order