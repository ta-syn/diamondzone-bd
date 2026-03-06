'use client'
import Link from 'next/link'

const colorMap = {
    accent: {
        border: 'hover:border-accent/50',
        bg: 'bg-accent/10',
        dot: 'bg-accent',
        text: 'group-hover:text-accent'
    },
    gold: {
        border: 'hover:border-gold/50',
        bg: 'bg-gold/10',
        dot: 'bg-gold',
        text: 'group-hover:text-gold'
    },
    success: {
        border: 'hover:border-success/50',
        bg: 'bg-success/10',
        dot: 'bg-success',
        text: 'group-hover:text-success'
    },
    orange: {
        border: 'hover:border-accent2/50',
        bg: 'bg-accent2/10',
        dot: 'bg-accent2',
        text: 'group-hover:text-accent2'
    }
}

import OrdersTable from './OrdersTable'

const StatCard = ({ title, value, icon, color = 'accent' }) => {
    const c = colorMap[color] || colorMap.accent
    return (
        <div className={`card p-6 border-border/50 bg-surface/40 hover:bg-surface transition-all group ${c.border}`}>
            <div className="flex items-center justify-between mb-4">
                <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
                <div className={`w-8 h-8 rounded-lg ${c.bg} border border-current/20 flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse shadow-glow`} />
                </div>
            </div>
            <h3 className="font-rajdhani font-black text-muted text-[10px] tracking-[0.2em] uppercase opacity-70 mb-1">{title}</h3>
            <p className={`font-orbitron font-black text-2xl tracking-tighter text-white transition-colors ${c.text}`}>{value}</p>
        </div>
    )
}

export default function OverviewPanel({ user, stats }) {
    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="font-orbitron font-black text-3xl md:text-5xl text-white tracking-[0.1em] italic uppercase">
                        WELCOME BACK, <span className="text-accent">{user?.name?.split(' ')[0]}!</span> 👋
                    </h2>
                    <p className="font-rajdhani font-black text-muted text-xs uppercase tracking-[0.4em] mt-2 opacity-60">Operative Status: Fully Operational</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/games" className="btn-fire px-8 py-4 text-[10px] font-black tracking-widest uppercase rounded-xl">NEW MISSION ⚡</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="SOLO MISSIONS" value={stats?.totalOrders || 0} icon="📦" color="accent" />
                <StatCard title="TOTAL PAYLOAD" value={`৳${stats?.totalSpent || 0}`} icon="💰" color="gold" />
                <StatCard title="WALLET RESERVE" value={`৳${user?.wallet_balance?.toFixed(1) || 0}`} icon="💳" color="success" />
                <StatCard title="COMMISSIONS" value={`৳${stats?.referralEarnings || 0}`} icon="🎁" color="orange" />
            </div>

            {/* Recent Missions */}
            <div className="card bg-surface/40 backdrop-blur-xl border-border/50 p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-orbitron font-black text-sm text-white tracking-widest uppercase italic">LIVE TRANSMISSION FEED</h3>
                    <Link href="?tab=orders" className="text-[10px] font-black text-accent tracking-[0.3em] uppercase hover:underline">Full Logs</Link>
                </div>

                <OrdersTable orders={stats?.recentOrders || []} />
            </div>
        </div>
    )
}
