import { dbConnect } from '@/lib/mongodb'
import { cacheGet, cacheSet } from '@/lib/redis'
import Game from '@/models/Game'
import Package from '@/models/Package'
import Order from '@/models/Order'

export const revalidate = 300 // 5 minutes

import HeroBanner from '@/components/home/HeroBanner'
import LiveTicker from '@/components/home/LiveTicker'
import GameGrid from '@/components/home/GameGrid'
import PackageCards from '@/components/home/PackageCards'
import ReviewSection from '@/components/home/ReviewSection'
import { Suspense } from 'react'
import { GameCardSkeleton, PackageCardSkeleton } from '@/components/ui/Skeleton'

async function getHomeData() {
    try {
        const CACHE_KEY = 'home:data'
        const cachedData = await cacheGet(CACHE_KEY)
        if (cachedData) return cachedData

        await dbConnect()

        const [games, packages, recentOrders] = await Promise.all([
            Game.find({ status: 'active' }).sort({ sort_order: 1 }).limit(6).lean(),
            Package.find({ is_featured: true, status: 'active' })
                .populate('game_id', 'name slug emoji gradient_from gradient_to currency_name')
                .sort({ sort_order: 1 })
                .limit(6)
                .lean(),
            Order.find({ status: 'completed' })
                .sort({ createdAt: -1 })
                .limit(20)
                .select('package_amount game_name game_slug user_id email')
                .populate('user_id', 'name')
                .lean()
        ])

        const homeData = {
            games: JSON.parse(JSON.stringify(games)),
            packages: JSON.parse(JSON.stringify(packages)),
            recentOrders: JSON.parse(JSON.stringify(recentOrders))
        }

        await cacheSet(CACHE_KEY, homeData, 300) // 5 min TTL
        return homeData
    } catch (e) {
        console.warn('getHomeData skipped due to DB error (likely build time)', e.message)
        return { games: [], packages: [], recentOrders: [] }
    }
}

export default async function HomePage() {
    const { games, packages, recentOrders } = await getHomeData()

    return (
        <div className="flex flex-col min-h-screen">

            {/* 1. HERO SECTION */}
            <HeroBanner />

            {/* 2. LIVE TICKER */}
            <LiveTicker orders={recentOrders} />

            {/* 3. GAMES GRID */}
            <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-6 gap-8 px-6 py-24 max-w-7xl mx-auto"><GameCardSkeleton /><GameCardSkeleton /><GameCardSkeleton /><GameCardSkeleton /><GameCardSkeleton /><GameCardSkeleton /></div>}>
                <GameGrid games={games} />
            </Suspense>

            {/* 4. FEATURED DEALS */}
            <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-24 max-w-7xl mx-auto"><PackageCardSkeleton /><PackageCardSkeleton /><PackageCardSkeleton /></div>}>
                <PackageCards packages={packages} />
            </Suspense>

            {/* 5. REVIEWS */}
            <ReviewSection />

            {/* SEO HELPERS (Invisible) */}
            <div className="hidden">
                <h1>DiamondZoneBD — #1 Gaming Top-Up Platform in Bangladesh</h1>
                <p>Buy Free Fire Diamonds, PUBG UC, and Mobile Legends Diamonds instantly with bKash, Nagad, and Rocket.</p>
            </div>

        </div>
    )
}