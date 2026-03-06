import { dbConnect } from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'
import Order from '@/models/Order'
import StatsCard from '@/components/admin/StatsCard'
import RevenueChart from '@/components/admin/RevenueChart'
import GamesPieChart from '@/components/admin/GamesPieChart'
import Link from 'next/link'
import axios from 'axios'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    // Direct DB fetch for better performance in server component
    await dbConnect()

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const [
        todayStats,
        totalStats,
        pendingCount,
        recentOrders,
        topGames,
        weeklyData
    ] = await Promise.all([
        Order.aggregate([
            { $match: { createdAt: { $gte: todayStart }, status: { $ne: 'cancelled' } } },
            { $group: { _id: null, rev: { $sum: '$amount_paid' }, count: { $count: {} } } }
        ]),
        Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, rev: { $sum: '$amount_paid' }, count: { $count: {} } } }
        ]),
        Order.countDocuments({ status: { $in: ['pending', 'processing'] } }),
        Order.find().sort({ createdAt: -1 }).limit(8).lean(),
        Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: '$game_name', value: { $sum: 1 } } },
            { $sort: { value: -1 } },
            { $limit: 5 }
        ]),
        Order.aggregate([
            { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, status: 'completed' } },
            {
                $group: {
                    _id: { $dateToString: { format: '%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$amount_paid' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])
    ])

    const todayRev = todayStats[0]?.rev || 0
    const totalRev = totalStats[0]?.rev || 0
    const totalOrd = totalStats[0]?.count || 0

    return (
        <div className="space-y-8 animate-fade-in">
            {/* 1. Header Area */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-orbitron font-black text-3xl md:text-5xl text-white tracking-[0.2em] uppercase italic">
                        SYSTEM <span className="text-accent">COMMAND</span>
                    </h1>
                    <p className="font-rajdhani font-black text-muted text-[10px] md:text-xs uppercase tracking-[0.5em] mt-2 opacity-60">
                        Administrative Control Terminal Beta-1
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-surface2/50 border border-border px-6 py-3 rounded-xl flex flex-col items-end">
                        <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Status Signal</span>
                        <span className="text-success font-black tracking-widest text-xs">ENCRYPTED UP-LINK 🛡️</span>
                    </div>
                </div>
            </div>

            {/* 1.5. Smile.one Setup Protocol */}
            {(!process.env.SMILEONE_EMAIL || !process.env.SMILEONE_API_KEY) && (
                <div className="bg-orange/10 border border-orange/40 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse shadow-glow shadow-orange/10">
                    <div className="flex items-center gap-6">
                        <span className="text-3xl">⚠️</span>
                        <div>
                            <h3 className="font-orbitron font-black text-white text-md tracking-widest uppercase italic">SMILE.ONE API OFFLINE</h3>
                            <p className="font-rajdhani font-bold text-muted text-[10px] uppercase tracking-widest leading-loose">
                                Missing environment configuration: <span className="text-orange">SMILEONE_EMAIL</span> or <span className="text-orange">SMILEONE_API_KEY</span>.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="https://www.smile.one/merchant/apiconfig"
                        target="_blank"
                        className="btn-outline px-8 py-3 text-[10px] font-black border-orange/30 text-orange rounded-xl hover:bg-orange hover:text-bg transition-all"
                    >
                        CONFIGURE ASSETS →
                    </Link>
                </div>
            )}

            {/* 2. Key Metrics Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon="💰"
                    title="Revenue Alpha (Today)"
                    value={todayRev}
                    prefix="৳"
                    color="accent"
                    change={12}
                />
                <StatsCard
                    icon="📦"
                    title="Success Transmissions"
                    value={totalOrd}
                    suffix=" ORDER"
                    color="gold"
                    change={5}
                />
                <StatsCard
                    icon="⏳"
                    title="Pending Recharges"
                    value={pendingCount}
                    color="danger"
                    change={-15}
                />
                <StatsCard
                    icon="💎"
                    title="Cargo Mass (All Time)"
                    value={totalRev}
                    prefix="৳"
                    color="success"
                    change={2}
                />
            </div>

            {/* 3. Operational Alerts */}
            {pendingCount > 0 ? (
                <div className="bg-danger/5 border-2 border-danger/30 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse shadow-glow shadow-danger/20 relative overflow-hidden group">
                    {/* Background Warning */}
                    <div className="absolute top-1/2 left-4 -translate-y-1/2 text-9xl opacity-[0.05] grayscale group-hover:scale-125 transition-transform duration-1000">⚠️</div>

                    <div className="flex items-center gap-6 relative z-10 text-center md:text-left">
                        <div className="w-16 h-16 rounded-full bg-danger/10 border-2 border-danger/40 flex items-center justify-center text-danger text-3xl">
                            ⚡
                        </div>
                        <div>
                            <h2 className="font-orbitron font-black text-white text-lg tracking-widest uppercase">RECHARGE OVERLOAD DETECTED</h2>
                            <p className="font-rajdhani font-bold text-muted uppercase tracking-widest opacity-60">
                                {pendingCount} Missions are stalling in the delivery queue. Immediate intervention required.
                            </p>
                        </div>
                    </div>
                    <Link href="/admin/orders?status=pending" className="btn-fire px-10 py-4 text-[10px] font-black tracking-widest uppercase rounded-xl relative z-10 group/btn">
                        VIEW ACTIVE ORDERS
                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100" />
                    </Link>
                </div>
            ) : (
                <div className="bg-success/5 border-2 border-success/30 p-8 rounded-2xl flex items-center gap-6 animate-fade-in shadow-glow shadow-success/10">
                    <span className="text-4xl">✅</span>
                    <div>
                        <h2 className="font-orbitron font-black text-white text-lg tracking-widest uppercase italic">ALL CLEAR PILOT</h2>
                        <p className="font-rajdhani font-bold text-muted uppercase tracking-widest opacity-60">
                            All transmission protocols are in a nominal state. No pending orders detected.
                        </p>
                    </div>
                </div>
            )}

            {/* 4. Trends Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <RevenueChart data={weeklyData.map(d => ({ date: d._id, revenue: d.revenue, orders: d.orders }))} />
                </div>
                <div>
                    <GamesPieChart data={topGames.map(g => ({ name: g._id, value: g.value }))} />
                </div>
            </div>

            {/* 5. Recent Logs Board */}
            <div className="card bg-surface/40 backdrop-blur-3xl border-border/80 p-8 relative overflow-hidden group">
                {/* Background Decor */}
                <div className="absolute top-4 right-10 text-9xl opacity-[0.02] -rotate-12 group-hover:rotate-0 transition-transform duration-1000">📊</div>

                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="font-orbitron font-black text-white text-sm tracking-widest uppercase italic">RECENT TRANSMISSION LOGS</h3>
                        <p className="text-[10px] font-black font-rajdhani text-muted uppercase tracking-widest mt-1 opacity-50">Global Order Registry (Last 8)</p>
                    </div>
                    <Link href="/admin/orders" className="text-[10px] font-black text-accent tracking-[0.3em] uppercase hover:underline">View All Missions</Link>
                </div>

                <div className="overflow-x-auto overflow-hidden rounded-2xl border border-border/50">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-surface2/80">
                            <tr>
                                {['Order Target', 'Mission Code', 'Ecosystem', 'Payload', 'Payment', 'Status', 'Timestamp'].map(h => (
                                    <th key={h} className="p-5 font-rajdhani font-black text-white text-[10px] uppercase tracking-widest opacity-60">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((o) => (
                                    <tr key={o._id} className="hover:bg-accent/5 transition-all group-item">
                                        <td className="p-5">
                                            <p className="font-mono font-black text-xs text-white uppercase tracking-widest">{o.player_id.substring(0, 6)}...{o.player_id.substring(o.player_id.length - 3)}</p>
                                            <p className="text-[8px] text-muted font-bold tracking-widest uppercase opacity-50">{o.email}</p>
                                        </td>
                                        <td className="p-5 text-sm font-black font-orbitron text-accent uppercase tracking-widest scale-90 origin-left opacity-90">{o.order_id}</td>
                                        <td className="p-5 text-[10px] font-black text-white uppercase tracking-widest">{o.game_name}</td>
                                        <td className="p-5 text-sm font-black font-orbitron text-success uppercase tracking-widest">৳{o.amount_paid}</td>
                                        <td className="p-5 text-[10px] font-black text-muted uppercase tracking-widest">{o.payment_method}</td>
                                        <td className="p-5">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-glow-sm cursor-default ${o.status === 'completed' ? 'border-success text-success bg-success/5 shadow-glow-green/20' :
                                                o.status === 'processing' ? 'border-accent text-accent bg-accent/5 shadow-glow/20' :
                                                    o.status === 'cancelled' ? 'border-danger text-danger bg-danger/5 shadow-glow-orange/20' :
                                                        'border-muted text-muted bg-surface'
                                                }`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-[10px] font-bold text-muted uppercase tracking-tighter">
                                            {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-40">
                                            <span className="text-4xl text-accent/50 animate-pulse">📡</span>
                                            <p className="font-orbitron font-black text-[10px] text-white uppercase tracking-[0.4em]">NO TRANSMISSIONS RECORDED IN SECTOR</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}