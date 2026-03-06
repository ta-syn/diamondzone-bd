import mongoose from 'mongoose'

const ResellerApplicationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    whatsapp: {
        type: String,
        required: true
    },
    business_name: {
        type: String,
        required: true
    },
    message: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true })

export default mongoose.models.ResellerApplication || mongoose.model('ResellerApplication', ResellerApplicationSchema)
