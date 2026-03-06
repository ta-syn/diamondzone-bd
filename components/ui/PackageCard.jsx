import React from 'react'
import Link from 'next/link'

const PackageCard = ({ pkg }) => {
    return (
        <Link href={`/games/${pkg.game_id?.slug}`} className="group h-full">
            <div className="card h-full p-8 border-border/50 bg-bg group-hover:border-accent2 group-hover:shadow-glow-orange group-hover:-translate-y-2 transition-all duration-300 relative overflow-hidden text-left">

                {/* Popular Ribbon */}
                {pkg.is_popular && (
                    <div className="absolute top-4 right-[-32px] bg-gold text-bg text-[10px] font-black rotate-45 px-10 py-1.5 shadow-lg tracking-widest uppercase z-20">
                        POPULAR
                    </div>
                )}

                {/* Game Context */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <span className="text-4xl filter group-hover:scale-110 transition-transform select-none">
                        {pkg.game_id?.emoji || '💎'}
                    </span>
                    <div>
                        <span className="text-xs font-rajdhani font-black tracking-widest text-muted uppercase">
                            {pkg.game_id?.name}
                        </span>
                        <h3 className="font-rajdhani font-bold text-white tracking-wide truncate max-w-[200px]">
                            {pkg.name}
                        </h3>
                    </div>
                </div>

                {/* Amount */}
                <div className="mb-4 relative z-10 flex flex-col items-start gap-2">
                    <div className="font-orbitron font-black text-4xl text-white tracking-tighter">
                        {pkg.amount} <span className="text-xs text-muted tracking-[0.2em] font-bold uppercase">{pkg.game_id?.currency_name}</span>
                    </div>
                    {pkg.badge_text && (
                        <span className="bg-accent2/10 text-accent2 text-[10px] font-black px-3 py-1 rounded-full border border-accent2/20 tracking-widest uppercase shadow-sm">
                            {pkg.badge_text}
                        </span>
                    )}
                </div>

                {/* Price & Action */}
                <div className="flex items-end justify-between mt-8 border-t border-border/50 pt-6 relative z-10">
                    <div>
                        <span className="text-xs font-rajdhani font-black text-muted tracking-widest uppercase">Price Signal</span>
                        <div className="text-3xl font-orbitron font-black text-success tracking-tight">
                            ৳{pkg.sell_price}
                        </div>
                    </div>

                    <div className={`px-6 py-3 rounded-lg text-xs font-black tracking-widest transition-all duration-300 group-active:scale-95 shadow-md ${pkg.is_popular ? 'btn-fire' : 'btn-primary'}`}>
                        INITIATE MISSION
                    </div>
                </div>

                {/* Visual Flair */}
                <div className="absolute top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-accent2/5 rounded-full blur-[80px] pointer-events-none group-hover:scale-150 transition-transform duration-700" />
            </div>
        </Link>
    )
}

export default React.memo(PackageCard)
