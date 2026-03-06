import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true, required: true },
    emoji: { type: String },
    gradient_from: { type: String },
    gradient_to: { type: String },
    image_url: { type: String },
    banner_url: { type: String },
    description: { type: String },
    currency_name: { type: String },
    server_options: [String],
    player_id_label: { type: String, default: 'Player ID' },
    player_id_hint: { type: String },
    player_id_regex: { type: String },
    smileone_product_id: { type: String },
    smileone_region: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    sort_order: { type: Number, default: 0 },
    total_orders: { type: Number, default: 0 },
}, { timestamps: true })

const Game = mongoose.models.Game || mongoose.model('Game', gameSchema)
export default Game