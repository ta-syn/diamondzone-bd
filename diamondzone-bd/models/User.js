import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, trim: true, match: /^01[3-9]\d{8}$/ },
    wallet_balance: { type: Number, default: 0, min: 0 },
    role: { type: String, enum: ['user', 'admin', 'reseller'], default: 'user' },
    referral_code: { type: String, unique: true, uppercase: true },
    referred_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    saved_player_ids: [{
        game_slug: String,
        player_id: String,
        nickname: String
    }],
    is_verified: { type: Boolean, default: false },
    is_banned: { type: Boolean, default: false },
    ban_reason: { type: String },
    reseller_approved: { type: Boolean, default: false },
    reseller_credit_limit: { type: Number, default: 0 },
    failed_login_attempts: { type: Number, default: 0 },
    locked_until: { type: Date, default: null },
    last_login: { type: Date },
}, { timestamps: true })

userSchema.pre('save', function () {
    if (!this.referral_code) {
        this.referral_code = nanoid(8).toUpperCase()
    }
})

userSchema.index({ role: 1 })
userSchema.index({ createdAt: 1 })

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User