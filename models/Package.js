import mongoose from 'mongoose'

const packageSchema = new mongoose.Schema({
    game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    name: { type: String, required: true },
    description: { type: String },
    amount: { type: Number },
    cost_price: { type: Number, required: true },
    sell_price: { type: Number, required: true },
    price_reseller: { type: Number },
    bonus_amount: { type: Number, default: 0 },
    is_featured: { type: Boolean, default: false },
    is_popular: { type: Boolean, default: false },
    badge_text: { type: String },
    stock: { type: Number, default: null },
    smileone_product_id: { type: String },
    smileone_sku: { type: String },
    status: { type: String, enum: ['active', 'out_of_stock', 'inactive'], default: 'active' },
    sort_order: { type: Number, default: 0 },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

packageSchema.virtual('profit').get(function () {
    return this.sell_price - this.cost_price
})

packageSchema.virtual('margin_pct').get(function () {
    if (!this.sell_price) return 0
    return ((this.sell_price - this.cost_price) / this.sell_price * 100).toFixed(1)
})

const Package = mongoose.models.Package || mongoose.model('Package', packageSchema)
export default Package