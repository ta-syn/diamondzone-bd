'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Spinner from '@/components/ui/Spinner'
import useAuthStore from '@/store/authStore'
import Link from 'next/link'

export default function ResellerDashboard() {
    const { user } = useAuthStore()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/reseller/stats')
                setStats(data.stats)
                setLoading(false)
            } catch (err) {
                console.error('Failed to fetch reseller stats:', err)
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
            <Spinner size="lg" className="text-secondary" />
            <span className="font-orbitron font-black text-[10px] tracking-widest text-muted animate-pulse uppercase">DCRYPTING COMMAND DATA...</span>
        </div>
    )

    const cards = [
        { label: "Today's Orders", value: stats?.today.count || 0, icon: "📦", color: "text-secondary" },
        { label: "Today's Revenue", value: `৳${stats?.today.revenue.toFixed(2) || 0}`, icon: "💰", color: "text-success" },
        { label: "Total Orders", value: stats?.totalOrders || 0, icon: "📊", color: "text-primary" },
        { label: "Available Balance", value: `৳${stats?.balance.toFixed(2) || 0}`, icon: "⭐", color: "text-gold" }
    ]

    return (
        <div className="space-y-12 animate-fade-in relative z-10">

            {/* 1. Header Protocol */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="font-orbitron font-black text-3xl md:text-5xl text-white tracking-widest uppercase italic">
                        SYSTEM <span className="text-secondary">OVERVIEW</span>
                    </h1>
                    <p className="font-rajdhani text-muted text-xs font-black uppercase tracking-[0.4em] opacity-60">
                        Operative Signal Status · Real-time Telemetry
                    </p>
                </div>
                <Link href="/reseller/recharge" className="btn-secondary px-8 py-3 rounded-xl text-xs font-black tracking-widest uppercase hover:shadow-glow-orange group flex items-center gap-3">
                    START NEW MISSION ⚡
                </Link>
            </div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="card p-8 bg-surface2/30 backdrop-blur-xl border-border/50 flex flex-col items-center group hover:border-secondary transition-all">
                        <span className="text-4xl mb-6 group-hover:scale-110 transition-transform filter drop-shadow-glow">
                            {card.icon}
                        </span>
                        <div className="text-center space-y-1">
                            <span className="text-[10px] font-black text-muted tracking-[0.3em] uppercase">{card.label}</span>
                            <h4 className={`text-2xl font-orbitron font-black ${card.color} tracking-tight`}>
                                {card.value}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Credit Reserve Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* CREDIT RESERVE MONITOR */}
                <div className="lg:col-span-1 card p-10 bg-surface border-border flex flex-col justify-between relative overflow-hidden group">
                    <div className="relative z-10 space-y-8">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-muted tracking-[0.3em] uppercase opacity-60">CREDIT RESERVE</span>
                                <div className="text-4xl font-orbitron font-black text-white">৳{stats?.balance.toFixed(0) || 0}</div>
                            </div>
                            <div className="w-12 h-12 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
                                <span className="text-muted">Current Load</span>
                                <span className="text-secondary">75% Exhausted</span>
                            </div>
                            <div className="h-4 bg-bg rounded-lg border border-border p-1 overflow-hidden relative">
                                <div
                                    className="h-full bg-secondary rounded-sm shadow-glow transition-all duration-1000"
                                    style={{ width: '75%' }}
                                />
                                <div className="absolute inset-0 bg-secondary/5 group-hover:bg-secondary/10 transition-colors" />
                            </div>
                            <p className="text-[9px] font-bold text-muted uppercase italic leading-loose">
                                * Warning: Credit mission limit nearing threshold. System slowdown expected at 5%.
                            </p>
                        </div>

                        <button className="btn-outline w-full py-4 text-[10px] font-black tracking-widest hover:bg-secondary hover:text-bg hover:border-secondary transition-all">
                            REFUEL COMMAND CREDIT →
                        </button>
                    </div>
                    {/* Background Decor */}
                    <div className="absolute bottom-[-50px] left-[-30px] text-9xl opacity-5 rotate-12 select-none grayscale font-black">RESELLER</div>
                </div>

                {/* RECENT MISSION LOGS */}
                <div className="lg:col-span-2 card p-8 md:p-10 bg-bg border-border flex flex-col">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="font-orbitron font-black text-lg text-white tracking-[0.3em] uppercase italic">RECENT MISSIONS</h3>
                        <Link href="/reseller/orders" className="text-[10px] font-black text-muted hover:text-secondary uppercase tracking-widest underline transition-colors underline-offset-4">
                            FULL SIGNAL LOGS
                        </Link>
                    </div>

                    <div className="space-y-4 flex-1">
                        {stats?.recentOrders.length === 0 ? (
                            <div className="h-40 flex flex-col items-center justify-center text-muted font-rajdhani text-xs font-bold uppercase tracking-[0.4em]">
                                NO RECENT MISSIONS DETECTED...
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border/30">
                                            <th className="text-left pb-4 text-[9px] font-black text-muted uppercase tracking-widest pr-4">ID SIGNAL</th>
                                            <th className="text-left pb-4 text-[9px] font-black text-muted uppercase tracking-widest pr-4">ECOSYSTEM</th>
                                            <th className="text-left pb-4 text-[9px] font-black text-muted uppercase tracking-widest pr-4">YIELD</th>
                                            <th className="text-left pb-4 text-[9px] font-black text-muted uppercase tracking-widest pr-12">STATUS</th>
                                            <th className="text-right pb-4 text-[9px] font-black text-muted uppercase tracking-widest">UNIT COST</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentOrders.map((order) => (
                                            <tr key={order._id} className="border-b border-border/10 last:border-0 hover:bg-surface/30 transition-colors group">
                                                <td className="py-5 font-orbitron font-black text-[10px] text-white tracking-widest">{order.order_id}</td>
                                                <td className="py-5 font-rajdhani font-black text-xs text-muted/80 uppercase">{order.game_name}</td>
                                                <td className="py-5 font-rajdhani font-black text-xs text-white uppercase">{order.package_amount} {order.package_id?.currency_name}</td>
                                                <td className="py-5">
                                                    <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${order.status === 'completed' ? 'text-success border-success/30 bg-success/5 shadow-glow-green' :
                                                            order.status === 'cancelled' ? 'text-danger border-danger/30 bg-danger/5' :
                                                                'text-gold border-gold/30 bg-gold/5'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-5 text-right font-orbitron font-black text-[10px] text-white">৳{order.amount_paid}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    )
}