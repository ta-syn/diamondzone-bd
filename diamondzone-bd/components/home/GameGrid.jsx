import Link from 'next/link'
import GameCard from '@/components/games/GameCard'

export default function GameGrid({ games = [] }) {
    return (
        <section className="max-w-7xl mx-auto px-6 py-24">

            {/* SECTION HEADER */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
                <div className="text-center md:text-left">
                    <div className="inline-block border border-accent/20 bg-accent/5 text-accent font-bold text-[10px] tracking-[0.4em] uppercase px-6 py-1.5 rounded-full mb-4 shadow-glow">
                        🎮 TOP GAMES
                    </div>
                    <h2 className="font-orbitron font-black text-4xl md:text-5xl text-white tracking-tighter uppercase filter drop-shadow-lg">
                        POPULAR <span className="text-accent">GAMES</span>
                    </h2>
                </div>

                <Link href="/games" className="btn-outline px-8 py-3 rounded-lg text-xs font-black tracking-[0.2em] group inline-flex items-center gap-3">
                    VIEW ALL ECOSYSTEMS
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
                {games.map((game, index) => (
                    <GameCard
                        key={game._id}
                        game={game}
                        priority={index < 2}
                    />
                ))}
            </div>

        </section>
    )
}