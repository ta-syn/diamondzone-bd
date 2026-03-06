import { dbConnect } from '@/lib/mongodb'
import Game from '@/models/Game'
import ResellerRechargeClient from './ResellerRechargeClient'

export const metadata = {
    title: 'Fast Top-Up Command — Reseller Hub | DiamondZoneBD',
    description: 'Execute instant gaming top-up missions with elite reseller discounts.',
}

async function getGames() {
    try {
        await dbConnect()
        const games = await Game.find({ status: 'active' }).sort({ sort_order: 1 }).lean()
        return JSON.parse(JSON.stringify(games))
    } catch (e) {
        console.warn('getGames skipped due to DB error (likely build time)', e.message)
        return []
    }
}

export default async function ResellerRechargePage() {
    const games = await getGames()

    return (
        <div className="space-y-12 animate-fade-in relative z-10">
            {/* 1. Header Protocol */}
            <div className="space-y-2">
                <h1 className="font-orbitron font-black text-3xl md:text-5xl text-white tracking-widest uppercase italic">
                    FAST <span className="text-secondary underline">TOP-UP</span>
                </h1>
                <p className="font-rajdhani text-muted text-xs font-black uppercase tracking-[0.4em] opacity-60">
                    Select Ecosystem · Configure Payload · Execute
                </p>
                <div className="w-16 h-1 bg-secondary mt-6 shadow-glow" />
            </div>

            <ResellerRechargeClient initialGames={games} />
        </div>
    )
}