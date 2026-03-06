import { dbConnect } from '@/lib/mongodb'
import Game from '@/models/Game'
import Package from '@/models/Package'
import { cacheGet, cacheSet } from '@/lib/redis'
import GamesListClient from './GamesListClient'

export const revalidate = 1800 // 30 minutes

export const metadata = {
    title: 'All Games Ecosystems — Buy Diamonds, UC, VP | DiamondZoneBD',
    description: 'Select your favorite game and top-up instantly. Safe, secure, and fastest delivery in Bangladesh for elite gamers.',
    keywords: ['game topup bd', 'free fire recharge', 'pubg mobile uc bd', 'mobile legends diamond recharge'],
}

async function getAllGamesData() {
    try {
        const CACHE_KEY = 'games:all'
        const cached = await cacheGet(CACHE_KEY)
        if (cached) return cached

        await dbConnect()

        const games = await Game.find({ status: 'active' })
            .sort({ sort_order: 1 })
            .lean()

        // For each game, find the minimum package price
        const gamesWithPricing = await Promise.all(
            games.map(async (game) => {
                const minPkg = await Package.findOne({ game_id: game._id, status: 'active' })
                    .sort({ sell_price: 1 })
                    .select('sell_price')
                    .lean()

                return {
                    ...game,
                    min_price: minPkg?.sell_price || 0,
                    total_orders: Math.floor(Math.random() * 5000) + 12000 // Simulated for UI
                }
            })
        )

        const data = JSON.parse(JSON.stringify(gamesWithPricing))
        await cacheSet(CACHE_KEY, data, 3600) // 1hr TTL
        return data
    } catch (e) {
        console.warn('getAllGamesData skipped due to DB error (likely build time)', e.message)
        return []
    }
}

export default async function GamesPage() {
    const games = await getAllGamesData()

    return (
        <GamesListClient initialGames={games} />
    )
}