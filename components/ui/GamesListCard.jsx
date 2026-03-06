import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const GamesListCard = ({ game, index }) => {
    return (
        <Link
            href={`/games/${game.slug}`}
            className="group animate-fade-in h-full"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="card h-full border-border/50 bg-bg hover:border-accent hover:shadow-glow hover:-translate-y-3 transition-all duration-500 overflow-hidden relative flex flex-col">

                {/* Header Banner Area */}
                <div
                    className="h-44 md:h-56 relative flex items-center justify-center overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${game.gradient_from}ee, ${game.gradient_to}ee)` }}
                >
                    {/* Subtle Grid Pattern */}
                    <div className="absolute inset-0 bg-grid opacity-10" />

                    {/* Image or Emoji */}
                    {game.image_url ? (
                        <div className="relative w-full h-full p-6 transition-transform duration-700 group-hover:scale-110">
                            <Image
                                src={game.image_url}
                                alt={game.name}
                                fill
                                className="object-contain p-4 filter drop-shadow-2xl"
                                sizes="(max-width: 768px) 40vw, 20vw"
                            />
                        </div>
                    ) : (
                        <span className="text-8xl md:text-9xl filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 select-none animate-float">
                            {game.emoji}
                        </span>
                    )}

                    {/* Overlay Accent */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Body Content */}
                <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10 bg-surface">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-orbitron font-black text-lg md:text-xl text-white tracking-widest uppercase italic group-hover:text-accent transition-colors truncate pr-2">
                            {game.name}
                        </h3>
                        <span className="bg-accent/10 border border-accent/20 text-accent text-[8px] md:text-[10px] font-black px-2 py-1 rounded tracking-[0.2em] uppercase whitespace-nowrap">
                            {game.currency_name}
                        </span>
                    </div>

                    <p className="text-muted font-rajdhani font-semibold text-xs md:text-sm uppercase tracking-widest leading-loose mb-6">
                        Starting from <span className="text-success font-black">৳{game.min_price || 0}</span>
                    </p>

                    <div className="mt-auto space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-muted tracking-widest uppercase opacity-60">Mission Vol.</span>
                            <span className="text-xs font-orbitron font-black text-white">{game.total_orders?.toLocaleString() || '12.4K+'}</span>
                        </div>

                        <div className="btn-fire w-full py-4 text-xs font-black tracking-[0.3em] group-hover:shadow-glow-orange group-hover:scale-105 transition-all text-center uppercase">
                            EXECUTE MISSION →
                        </div>
                    </div>
                </div>

                {/* Hover Reveal Bar */}
                <div className="absolute bottom-0 left-0 h-1.5 w-full bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </div>
        </Link>
    )
}

export default React.memo(GamesListCard)
