'use client'
import React from 'react'

const TransactionTable = ({ transactions = [] }) => {
    return (
        <div className="overflow-x-auto overflow-hidden rounded-xl border border-border/30">
            <table className="w-full text-left">
                <thead className="bg-surface2/60 border-b border-border/50">
                    <tr>
                        {['Protocol', 'Payload', 'Previous', 'Current', 'Timestamp'].map(h => (
                            <th key={h} className="p-5 font-black text-white text-[10px] uppercase tracking-widest opacity-60">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/10 font-rajdhani font-bold text-xs">
                    {transactions.length > 0 ? (
                        transactions.map((t) => (
                            <tr key={t._id} className="hover:bg-accent/5 transition-all text-[10px] tracking-widest uppercase">
                                <td className="p-5">
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border shadow-sm ${t.type === 'deposit' ? 'border-success text-success bg-success/5 shadow-glow-green/10' :
                                            t.type === 'purchase' ? 'border-danger text-danger bg-danger/5 shadow-glow-orange/10' :
                                                'border-accent text-accent bg-accent/5 shadow-glow/10'
                                        }`}>
                                        {t.type}
                                    </span>
                                </td>
                                <td className={`p-5 font-orbitron font-black text-xs ${t.type === 'purchase' ? 'text-danger' : 'text-success'
                                    }`}>
                                    {t.type === 'purchase' ? '-' : '+'}৳{t.amount.toLocaleString()}
                                </td>
                                <td className="p-5 text-muted/60 whitespace-nowrap">
                                    ৳{t.balance_before?.toFixed(1) || '0.0'}
                                </td>
                                <td className="p-5 text-white whitespace-nowrap">
                                    ৳{t.balance_after?.toFixed(1) || '0.0'}
                                </td>
                                <td className="p-5">
                                    <div className="flex flex-col">
                                        <span className="text-white opacity-80">{new Date(t.createdAt).toLocaleDateString()}</span>
                                        <span className="text-[8px] text-muted opacity-40">{new Date(t.createdAt).toLocaleTimeString()}</span>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-20 text-center">
                                <div className="flex flex-col items-center gap-4 opacity-30">
                                    <span className="text-6xl animate-float">🪙</span>
                                    <p className="font-orbitron text-[10px] font-black tracking-[0.4em] uppercase">No active credit logs found</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default React.memo(TransactionTable)
