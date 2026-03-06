'use client'
import { useMemo } from 'react'

const FALLBACK_ORDERS = [
    { name: 'Nishan M.', amount: 520, currency: 'Diamonds' },
    { name: 'Sakib H.', amount: 660, currency: 'UC' },
    { name: 'Hasan R.', amount: 325, currency: 'UC' },
    { name: 'Tanvir K.', amount: 100, currency: 'Diamonds' },
    { name: 'Rifat A.', amount: 172, currency: 'Diamonds' },
    { name: 'Nadia S.', amount: 86, currency: 'Diamonds' },
]

export default function LiveTicker({ orders = [] }) {
    const displayOrders = useMemo(() => {
        const base = orders.length > 0 ? orders.map(o => ({
            name: o.user_id?.name || o.email?.split('@')[0] || 'Gamer',
            amount: o.package_amount,
            currency: o.game_name?.includes('PUBG') ? 'UC' : 'Diamonds'
        })) : FALLBACK_ORDERS

        // Duplicate for infinite scroll
        return [...base, ...base, ...base, ...base]
    }, [orders])

    return (
        <section className="relative w-full bg-accent2/10 border-y border-accent2/20 py-4 overflow-hidden group">

            {/* Live Badge */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-danger text-white text-[10px] font-black tracking-[0.4em] uppercase px-4 py-1.5 rounded-full flex items-center gap-2 shadow-glow-orange border border-white/20">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE FEED
            </div>

            {/* Infinite Scroll Container */}
            <div className="flex animate-ticker whitespace-nowrap gap-12 items-center hover:[animation-play-state:paused] cursor-default">
                {displayOrders.map((order, i) => (
                    <div key={i} className="flex items-center gap-3 font-rajdhani text-sm md:text-md">
                        <span className="text-white/60">🔥</span>
                        <span className="text-gold font-black uppercase tracking-widest">{order.name}</span>
                        <span className="text-muted lowercase tracking-tighter">just bought</span>
                        <span className="text-accent2 font-bold tracking-widest">{order.amount} {order.currency}</span>
                        <span className="text-muted/40 font-black tracking-widest ml-4">·</span>
                    </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: flex;
          width: fit-content;
          animation: ticker 30s linear infinite;
        }
      `}</style>
        </section>
    )
}