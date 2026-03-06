'use client'
import Link from 'next/link'

const OrderStatusBadge = ({ status }) => {
    const styles = {
        pending: 'border-muted text-muted bg-muted/5',
        processing: 'border-accent text-accent bg-accent/5',
        completed: 'border-success text-success bg-success/5',
        cancelled: 'border-danger text-danger bg-danger/5',
        refunded: 'border-orange text-orange bg-orange/5',
    }
    return (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status]}`}>
            {status}
        </span>
    )
}

export default function OrdersTable({ orders }) {
    if (!orders || orders.length === 0) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4 opacity-50">
            <span className="text-6xl mb-4 grayscale">🎮</span>
            <h3 className="font-orbitron font-black text-xl text-white tracking-widest">NO ORDERS YET</h3>
            <p className="font-rajdhani text-muted text-xs font-black tracking-widest uppercase mb-8 text-center">Your mission history is a blank slate. Level up now!</p>
            <Link href="/games" className="btn-fire px-12 py-4 rounded-xl text-xs">COMMENCE GAMING ⚡</Link>
        </div>
    )

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-surface2/80 font-rajdhani border-b border-border/50">
                    <tr>
                        {['Code', 'Ecosystem', 'Payload', 'Status', 'Timestamp', 'Link'].map(h => (
                            <th key={h} className="p-5 font-black text-white text-[10px] uppercase tracking-widest opacity-60">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                    {orders.map(o => (
                        <tr key={o._id} className="hover:bg-accent/5 transition-all">
                            <td className="p-5 font-orbitron font-black text-xs text-white uppercase tracking-widest">{o.order_id}</td>
                            <td className="p-5">
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">{o.game_name}</p>
                                <p className="text-[8px] text-muted font-bold uppercase mt-1 opacity-50">{o.package_name}</p>
                            </td>
                            <td className="p-5 font-orbitron font-black text-sm text-success tracking-tighter">৳{o.amount_paid}</td>
                            <td className="p-5"><OrderStatusBadge status={o.status} /></td>
                            <td className="p-5">
                                <p className="text-[10px] font-bold text-muted uppercase tracking-tighter font-rajdhani">{new Date(o.createdAt).toLocaleDateString()}</p>
                            </td>
                            <td className="p-5">
                                <Link href={`/track?order_id=${o.order_id}`} className="text-accent text-[9px] font-black tracking-widest uppercase hover:underline">TRACK</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}