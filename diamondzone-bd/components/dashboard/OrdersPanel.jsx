import Link from 'next/link'
import OrdersTable from './OrdersTable'

export default function OrdersPanel({ orders, pagination, setPage, setStatus, currentStatus }) {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <h2 className="font-orbitron font-black text-3xl text-white tracking-widest italic uppercase">MISSION <span className="text-accent">HISTORY</span></h2>
                <div className="flex gap-4">
                    <select
                        value={currentStatus}
                        onChange={(e) => setStatus(e.target.value)}
                        className="input-field h-12 text-[10px] font-black uppercase tracking-widest bg-bg cursor-pointer"
                    >
                        <option value="all">ALL PROTOCOLS</option>
                        <option value="pending">PENDING</option>
                        <option value="processing">PROCESSING</option>
                        <option value="completed">COMPLETED</option>
                        <option value="cancelled">CANCELLED</option>
                    </select>
                </div>
            </div>

            <div className="card bg-surface/40 backdrop-blur-xl border-border/80 overflow-hidden">
                <div className="min-h-[400px]">
                    <OrdersTable orders={orders} />
                </div>


                {pagination && pagination.pages > 1 && (
                    <div className="p-8 border-t border-border/30 flex items-center justify-center gap-4">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => setPage(pagination.page - 1)}
                            className="btn-outline px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase disabled:opacity-20"
                        >
                            ← SIGNAL BACK
                        </button>
                        <span className="font-orbitron font-black text-xs text-accent">PAGE {pagination.page} / {pagination.pages}</span>
                        <button
                            disabled={pagination.page === pagination.pages}
                            onClick={() => setPage(pagination.page + 1)}
                            className="btn-outline px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase disabled:opacity-20"
                        >
                            SIGNAL FORWARD →
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
