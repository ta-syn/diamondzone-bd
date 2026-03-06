'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'

export default function ResellerOrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/api/reseller/stats') // Re-using stats for now or dedicated API
                setOrders(data.stats.recentOrders) // In a real app, this would be a paginated API
                setLoading(false)
            } catch (err) {
                console.error('Failed to fetch reseller orders:', err)
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
            <Spinner size="lg" className="text-secondary" />
            <span className="font-orbitron font-black text-[10px] tracking-widest text-muted animate-pulse uppercase">RETRIEVING MISSION DATA...</span>
        </div>
    )

    return (
        <div className="space-y-12 animate-fade-in relative z-10">
            {/* 1. Header Protocol */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="font-orbitron font-black text-3xl md:text-5xl text-white tracking-widest uppercase italic">
                        MISSION <span className="text-secondary underline">ARCHIVE</span>
                    </h1>
                    <p className="font-rajdhani text-muted text-xs font-black uppercase tracking-[0.4em] opacity-60">
                        Historical Signal Logs · Operative Field Success
                    </p>
                </div>
            </div>

            <div className="card p-8 md:p-12 bg-bg border-border backdrop-blur-3xl relative overflow-hidden group">
                {orders.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center space-y-4">
                        <span className="text-6xl animate-pulse">🛰️</span>
                        <h3 className="font-orbitron font-black text-lg text-white tracking-widest uppercase">ARCHIVE DELETED OR EMPTY</h3>
                        <p className="text-muted font-rajdhani text-xs font-bold uppercase tracking-widest opacity-60 text-center">Your mission records are currently blank.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border/30">
                                    <th className="pb-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">ID SIGNAL</th>
                                    <th className="pb-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">ECOSYSTEM ENTRY</th>
                                    <th className="pb-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">TARGET ID</th>
                                    <th className="pb-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">PAYLOAD YIELD</th>
                                    <th className="pb-6 text-[10px] font-black text-muted uppercase tracking-[0.3em] pr-10">STATUS</th>
                                    <th className="pb-6 text-right text-[10px] font-black text-muted uppercase tracking-[0.3em]">MISSION COST</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="border-b border-border/10 last:border-0 hover:bg-surface/40 transition-all group">
                                        <td className="py-8 font-orbitron font-black text-xs text-white tracking-[0.2em] group-hover:text-secondary transition-colors">
                                            {order.order_id}
                                        </td>
                                        <td className="py-8">
                                            <div className="flex flex-col">
                                                <span className="font-rajdhani font-black text-white text-xs uppercase tracking-widest">{order.game_name}</span>
                                                <span className="text-[10px] text-muted font-bold font-rajdhani opacity-50">{new Date(order.createdAt).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-8">
                                            <div className="flex flex-col">
                                                <span className="font-orbitron font-black text-[10px] text-secondary tracking-widest group-hover:animate-pulse">{order.player_id}</span>
                                                <span className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-50">{order.server || 'Global Central'}</span>
                                            </div>
                                        </td>
                                        <td className="py-8">
                                            <div className="flex items-center gap-3">
                                                <span className="font-rajdhani font-black text-xs text-white uppercase">{order.package_amount}</span>
                                                <span className="text-[9px] font-black text-muted border border-border px-1.5 rounded opacity-60">DP</span>
                                            </div>
                                        </td>
                                        <td className="py-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${order.status === 'completed' ? 'text-success border-success/30 bg-success/5 shadow-glow-green' :
                                                    order.status === 'cancelled' ? 'text-danger border-danger/30 bg-danger/5' :
                                                        order.status === 'processing' ? 'text-gold border-gold/30 bg-gold/5 shadow-glow-orange' :
                                                            'text-muted border-border/30 bg-surface2/50'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-8 text-right">
                                            <div className="font-orbitron font-black text-sm text-white flex flex-col items-end">
                                                <span>৳{order.amount_paid}</span>
                                                <span className="text-[9px] text-green font-black tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">RESELLER RATE</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="text-center p-12 border-2 border-dashed border-border/30 rounded-3xl opacity-40 hover:opacity-100 transition-opacity animate-pulse">
                <p className="font-rajdhani font-black text-[10px] text-muted uppercase tracking-[0.5em]">System Shield Active · End of Archive Signal</p>
            </div>
        </div>
    )
}