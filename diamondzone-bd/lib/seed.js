import mongoose from 'mongoose'
// Removed static import to handle env loading first
import Game from '../models/Game.js'
import Package from '../models/Package.js'
import Coupon from '../models/Coupon.js'
import fs from 'fs'
import path from 'path'

// Manual .env.local loader for standalone execution
try {
    const envContent = fs.readFileSync('.env.local', 'utf8')
    envContent.split('\n').forEach(line => {
        const [key, ...value] = line.split('=')
        if (key && value) process.env[key.trim()] = value.join('=').trim()
    })
} catch (e) {
    console.warn('.env.local not found or could not be read')
}

const games = [
    {
        name: 'Free Fire', slug: 'free-fire', emoji: '🔥',
        gradient_from: '#ff6b35', gradient_to: '#ff0000',
        currency_name: 'Diamond',
        player_id_label: 'Free Fire UID', player_id_hint: 'Open Free Fire → Profile → Your UID',
        player_id_regex: '^\\d{6,12}$',
        smileone_product_id: '26',
        smileone_region: 'ID',
        server_options: ['Bangladesh', 'India'],
        sort_order: 1,
    },
    {
        name: 'PUBG Mobile', slug: 'pubg-mobile', emoji: '🎯',
        gradient_from: '#f7c52d', gradient_to: '#c8821e',
        currency_name: 'UC',
        player_id_label: 'PUBG Player ID', player_id_hint: 'Open PUBG → Profile → Player ID (below username)',
        player_id_regex: '^\\d{7,10}$',
        smileone_product_id: '224',
        smileone_region: 'ID',
        server_options: ['Bangladesh/SEASIA', 'Asia'],
        sort_order: 2,
    },
    {
        name: 'Mobile Legends', slug: 'mobile-legends', emoji: '⚔️',
        gradient_from: '#00d4ff', gradient_to: '#0066cc',
        currency_name: 'Diamond',
        player_id_label: 'ML User ID', player_id_hint: 'Open ML → Profile → ID (below avatar)',
        player_id_regex: '^\\d{6,12}$',
        smileone_product_id: '14',
        smileone_region: 'ID',
        server_options: ['Bangladesh', 'Global'],
        sort_order: 3,
    },
    {
        name: 'Valorant', slug: 'valorant', emoji: '🎮',
        gradient_from: '#ff4655', gradient_to: '#cc0011',
        currency_name: 'VP',
        player_id_label: 'Riot ID', player_id_hint: 'Your Riot ID format: Username#1234',
        player_id_regex: '^.{3,20}#\\d{4,5}$',
        smileone_product_id: '45',
        smileone_region: 'AS',
        server_options: ['Asia Pacific (AP)'],
        sort_order: 4,
    },
    {
        name: 'Genshin Impact', slug: 'genshin-impact', emoji: '✨',
        gradient_from: '#c8a2ff', gradient_to: '#5500ff',
        currency_name: 'Genesis Crystal',
        player_id_label: 'UID', player_id_hint: 'Genshin Impact UID (9 digits)',
        player_id_regex: '^\\d{9,10}$',
        smileone_product_id: '67',
        smileone_region: 'AS',
        server_options: ['Asia Server'],
        sort_order: 5,
    },
    {
        name: 'Call of Duty Mobile', slug: 'call-of-duty', emoji: '💥',
        gradient_from: '#4a5568', gradient_to: '#1a202c',
        currency_name: 'CP',
        player_id_label: 'Player ID', player_id_hint: 'COD Mobile Player ID',
        player_id_regex: '^.{5,20}$',
        smileone_product_id: '156',
        smileone_region: 'ID',
        server_options: ['Global'],
        sort_order: 6,
    },
]

const packagesData = {
    'free-fire': [
        { name: '100 Diamonds', amount: 100, sell_price: 100, smileone_sku: 'ff_100' },
        { name: '310 Diamonds', amount: 310, sell_price: 270, smileone_sku: 'ff_310', is_popular: true, is_featured: true },
        { name: '520 Diamonds', amount: 520, sell_price: 430, smileone_sku: 'ff_520' },
        { name: '1060 Diamonds', amount: 1060, sell_price: 850, smileone_sku: 'ff_1060' },
    ],
    'pubg-mobile': [
        { name: '60 UC', amount: 60, sell_price: 80, smileone_sku: 'pubg_60' },
        { name: '325 UC', amount: 325, sell_price: 390, smileone_sku: 'pubg_325', is_popular: true, is_featured: true },
        { name: '660 UC', amount: 660, sell_price: 750, smileone_sku: 'pubg_660' },
        { name: '1800 UC', amount: 1800, sell_price: 1950, smileone_sku: 'pubg_1800' },
    ],
    'mobile-legends': [
        { name: '86 Diamonds', amount: 86, sell_price: 130, smileone_sku: 'ml_86' },
        { name: '172 Diamonds', amount: 172, sell_price: 250, smileone_sku: 'ml_172', is_popular: true, is_featured: true },
        { name: '514 Diamonds', amount: 514, sell_price: 720, smileone_sku: 'ml_514' },
        { name: '1050 Diamonds', amount: 1050, sell_price: 1400, smileone_sku: 'ml_1050' },
    ],
}

async function seed() {
    try {
        const { dbConnect } = await import('./mongodb.js')
        await dbConnect()
        console.log('Connected to MongoDB')

        await Game.deleteMany({})
        await Package.deleteMany({})
        await Coupon.deleteMany({})
        console.log('Cleared existing data')

        for (const gameData of games) {
            const game = await Game.create(gameData)
            console.log(`Created game: ${game.name}`)

            const pkgs = packagesData[game.slug] || []
            for (const p of pkgs) {
                await Package.create({
                    ...p,
                    game_id: game._id,
                    cost_price: p.sell_price * 0.85,
                })
            }
            if (pkgs.length > 0) console.log(`Created ${pkgs.length} packages for ${game.name}`)
        }

        const expiry = new Date()
        expiry.setFullYear(expiry.getFullYear() + 1)
        await Coupon.create({
            code: 'WELCOME10',
            description: 'Welcome discount 10%',
            discount_type: 'percentage',
            discount_value: 10,
            expiry_date: expiry,
            status: 'active'
        })
        console.log('Created WELCOME10 coupon')

        console.log('Seed complete!')
        process.exit(0)
    } catch (err) {
        console.error('Seed error:', err)
        process.exit(1)
    }
}

seed()
