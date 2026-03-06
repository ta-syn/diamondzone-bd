import { dbConnect } from '@/lib/mongodb'
import Game from '@/models/Game'
import Package from '@/models/Package'
import { notFound } from 'next/navigation'
import RechargePageClient from './RechargePageClient'

export async function generateStaticParams() {
    try {
        await dbConnect()
        const games = await Game.find({ status: 'active' }).select('slug').lean()
        return games.map((game) => ({
            slug: game.slug,
        }))
    } catch (e) {
        console.warn('generateStaticParams skipped due to DB error (likely build time)', e.message)
        return []
    }
}

export async function generateMetadata({ params }) {
    try {
        const { slug } = await params
        await dbConnect()
        const game = await Game.findOne({ slug, status: 'active' }).lean()

        if (!game) return { title: 'Game Not Found' }

        return {
            title: `Buy ${game.name} ${game.currency_name} Instantly | DiamondZoneBD`,
            description: `Fastest ${game.name} top-up in Bangladesh. Get ${game.currency_name} at cheapest rate. bKash, Nagad, Rocket and Card payment supported.`,
            keywords: [`buy ${game.name} diamonds bd`, `cheap ${game.name} ${game.currency_name} bangladesh`, `instantly top-up ${game.name}`],
            openGraph: {
                title: `Top-Up ${game.name} | DiamondZoneBD`,
                description: `Instant ${game.name} ${game.currency_name} recharge for Bangladesh players.`,
                url: `/games/${game.slug}`,
                images: [game.image_url],
            },
        }
    } catch (e) {
        console.warn('generateMetadata skipped due to DB error (likely build time)', e.message)
        return { title: 'Game Recharge | DiamondZoneBD' }
    }
}

export const revalidate = 3600 // Cache for 1 hour

export default async function GameRechargePage({ params }) {
    const { slug } = await params

    await dbConnect()

    const game = await Game.findOne({ slug, status: 'active' }).lean()
    if (!game) notFound()

    const packages = await Package.find({
        game_id: game._id,
        status: 'active'
    }).sort({ sort_order: 1 }).lean()

    // Convert to plain objects for client components
    const gameData = JSON.parse(JSON.stringify(game))
    const packagesData = JSON.parse(JSON.stringify(packages))

    return (
        <RechargePageClient
            game={gameData}
            packages={packagesData}
        />
    )
}