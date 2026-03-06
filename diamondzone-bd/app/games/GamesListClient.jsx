'use client'
import { useState, useMemo } from 'react'
import GamesListCard from '@/components/ui/GamesListCard'

export default function GamesListClient({ initialGames }) {
    const [search, setSearch] = useState('')

    const filteredGames = useMemo(() => {
        return initialGames.filter(game =>
            game.name.toLowerCase().includes(search.toLowerCase()) ||
            game.slug.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, initialGames])

    return (
        <main className="min-h-screen pb-24">

            {/* HEADER SECTION */}
            <section className="relative py-24 bg-surface2 border-b border-border overflow-hidden">
                {/* Animated Background Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-accent2/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="animate-fade-in space-y-4">
                        <h1 className="font-orbitron font-black text-4xl md:text-7xl text-white tracking-[0.2em] uppercase italic drop-shadow-glow">
                            CHOOSE YOUR <span className="text-accent underline">ECOSYSTEM</span>
                        </h1>
                        <p className="font-rajdhani text-muted text-lg md:text-2xl font-medium tracking-widest max-w-2xl mx-auto uppercase opacity-70">
                            Select the world you wish to dominate and recharge instantly.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-12 max-w-2xl mx-auto animate-slide-up [animation-delay:0.2s]">
                        <div className="relative group">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search for Battlegrounds (e.g. Free Fire, PUBG)..."
                                className="w-full bg-bg border border-border rounded-2xl px-12 py-5 text-white font-rajdhani text-lg outline-none transition-all duration-300 focus:border-accent focus:shadow-glow group-hover:border-accent/40 shadow-inner"
                            />
                            <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white p-1">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                        <p className="text-[10px] text-muted font-black tracking-[0.3em] uppercase mt-4 text-left px-4 animate-pulse">
                            Found {filteredGames.length} active ecosystems
                        </p>
                    </div>
                </div>
            </section>

            {/* GAMES GRID */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredGames.map((game, i) => (
                        <GamesListCard
                            key={game._id}
                            game={game}
                            index={i}
                        />
                    ))}
                </div>

                {filteredGames.length === 0 && (
                    <div className="text-center py-40 animate-fade-in">
                        <span className="text-6xl mb-6 block drop-shadow-glow">🛸</span>
                        <h3 className="font-orbitron font-black text-2xl text-white tracking-widest uppercase mb-4">NO ECOSYSTEMS DETECTED</h3>
                        <p className="text-muted font-rajdhani font-medium tracking-widest uppercase">Try searching for another world or explore our top-up missions.</p>
                    </div>
                )}
            </section>

        </main>
    )
}
