'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function GameCard({ game }) {
    return (
        <Link href={`/games/${game.slug}`} className="group relative">
            <div className="card h-full p-6 border-border/50 bg-bg group-hover:border-accent group-hover:shadow-glow transition-all duration-500 overflow-hidden flex flex-col items-center text-center">

                {/* Visual Header */}
                <div
                    className="w-full aspect-square rounded-2xl flex items-center justify-center mb-6 relative z-10 overflow-hidden group-hover:scale-105 transition-transform duration-700 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${game.gradient_from}dd, ${game.gradient_to}dd)` }}
                >
                    {game.image_url ? (
                        <Image
                            src={game.image_url}
                            alt={game.name}
                            fill
                            className="object-cover p-3 filter drop-shadow-xl"
                            sizes="(max-width: 768px) 50vw, 20vw"
                        />
                    ) : (
                        <span className="text-7xl filter drop-shadow-2xl animate-float select-none">{game.emoji}</span>
                    )}
                    {/* Gloss Overlay */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                {/* Content */}
                <div className="space-y-3 w-full">
                    <h3 className="font-orbitron font-black text-white text-md tracking-widest uppercase italic group-hover:text-accent transition-colors truncate">
                        {game.name}
                    </h3>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black text-muted tracking-widest uppercase opacity-60">Price Signal</span>
                        <p className="font-orbitron font-black text-success text-xl tracking-tighter">
                            ৳{game.min_price || 0}
                        </p>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="mt-6 w-full py-3 bg-surface2 border border-border/50 rounded-xl text-[10px] font-black tracking-[0.3em] uppercase group-hover:bg-accent group-hover:text-bg group-hover:border-accent transition-all duration-300">
                    RECHARGE NOW →
                </div>

                {/* Hover Glow Background */}
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
        </Link>
    )
}