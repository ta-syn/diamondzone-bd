'use client'
import Spinner from '@/components/ui/Spinner'

export default function AdminOrdersTable({
    orders,
    loading,
    onViewDetail,
    onStatusChange,
    isUpdating
}) {
    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Spinner size="lg" className="text-accent" />
            <p className="font-orbitron text-[10px] font-black text-muted animate-pulse uppercase tracking-[0.3em]">Acquiring Signal...</p>
        </div>
    )

    if (orders.length === 0) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4 opacity-40">
            <span className="text-6xl">🛸</span>
            <p className="font-orbitron text-sm font-black text-white uppercase tracking-[0.5em]">No Missions Found</p>
        </div>
    )

    return (
        <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-surface2/80 font-rajdhani border-b border-border/50">
                <tr>
                    {['Code', 'Target', 'Ecosystem', 'Payload', 'Status', 'Date', 'Action'].map(h => (
                        <th key={h} className="p-5 font-black text-white text-[10px] uppercase tracking-widest opacity-60">
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
                {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-accent/5 transition-all group-item group overflow-hidden">
                        <td className="p-5 whitespace-nowrap">
                            <p className="font-orbitron font-black text-xs text-accent uppercase tracking-widest">{o.order_id}</p>
                        </td>
                        <td className="p-5">
                            <div className="flex flex-col">
                                <span className="font-mono font-black text-[11px] text-white tracking-widest uppercase">{o.player_id}</span>
                                <span className="text-[10px] text-muted font-bold tracking-tighter uppercase opacity-50 truncate max-w-[16rem]">{o.email}</span>
                            </div>
                        </td>
                        <td className="p-5">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">{o.game_name}</p>
                            <p className="text-[8px] text-accent2 font-bold uppercase tracking-tighter mt-1">{o.package_name}</p>
                        </td>
                        <td className="p-5">
                            <p className="font-orbitron font-black text-sm text-success tracking-tighter">৳{o.amount_paid}</p>
                            <p className="text-[8px] text-muted font-bold uppercase tracking-widest opacity-40">{o.payment_method}</p>
                        </td>
                        <td className="p-5">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-glow-sm cursor-pointer inline-block ${o.status === 'completed' ? 'border-success text-success bg-success/5' :
                                    o.status === 'processing' ? 'border-accent text-accent bg-accent/5' :
                                        o.status === 'cancelled' ? 'border-danger text-danger bg-danger/5' :
                                            'border-muted text-muted bg-surface'
                                }`}>
                                {o.status}
                            </span>
                        </td>
                        <td className="p-5">
                            <p className="text-[10px] font-bold text-muted uppercase tracking-tighter font-rajdhani">
                                {new Date(o.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-tighter opacity-40">
                                {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </td>
                        <td className="p-5">
                            <button
                                onClick={() => onViewDetail(o)}
                                className="flex items-center gap-2 hover:text-accent transition-colors bg-accent/10 border border-accent/20 px-4 py-2 rounded-lg group-hover:bg-accent/20"
                            >
                                <span className="text-[10px] font-black tracking-widest uppercase">VIEW LOGS</span>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}