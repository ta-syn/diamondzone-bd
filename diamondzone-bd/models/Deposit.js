import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

const depositSchema = new mongoose.Schema({
    deposit_id: { type: String, unique: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    payment_method: { type: String, required: true }, // e.g., 'bkash', 'nagad' via SSL
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    ssl_val_id: { type: String },
    bank_tran_id: { type: String },
}, { timestamps: true })

depositSchema.pre('save', function (next) {
    if (!this.deposit_id) {
        this.deposit_id = `DEP-${new Date().getFullYear()}-${nanoid(5).toUpperCase()}`
    }
    next()
})

const Deposit = mongoose.models.Deposit || mongoose.model('Deposit', depositSchema)
export default Deposit
