'use client'
import { useState } from 'react'
import TransactionTable from './TransactionTable'
import Spinner from '@/components/ui/Spinner'

export default function WalletPanel({ user, transactions, onDeposit, loading }) {
    const [depositAmount, setDepositAmount] = useState(100)
    const presets = [100, 200, 500, 1000]

    return (
        <div className="space-y-12 animate-fade-in pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Add Money Form */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="font-orbitron font-black text-3xl text-white tracking-widest italic uppercase">TOP-UP <span className="text-success">RESERVE</span></h2>
                    <div className="card p-10 bg-surface/50 border-border/50 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 text-9xl opacity-[0.03] rotate-12 select-none">💳</div>

                        <div>
                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-4 block">Select Payload Amount</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {presets.map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => setDepositAmount(amt)}
                                        className={`h-14 rounded-xl border font-orbitron font-black text-sm tracking-widest transition-all ${depositAmount === amt ? 'bg-success/10 border-success text-success shadow-glow' : 'border-border/50 text-white hover:border-accent'}`}
                                    >
                                        ৳{amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-muted tracking-widest uppercase block">Custom Amount</label>
                            <input
                                type="number"
                                placeholder="ENTER CREDITS..."
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                                className="input-field h-16 text-2xl font-orbitron font-black text-center text-success bg-bg/50 border-border/80 focus:border-success transition-all"
                            />
                            <p className="text-[8px] font-bold text-muted uppercase tracking-widest text-center opacity-50 italic">Operational Gate: SSLCOMMERZ Secure Payload Protocol</p>
                        </div>

                        <button
                            onClick={() => onDeposit(depositAmount)}
                            disabled={loading}
                            className="w-full h-16 btn-primary bg-success border-success text-bg font-orbitron font-black text-sm tracking-[0.3em] uppercase rounded-2xl shadow-glow-green hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {loading ? <Spinner size="sm" /> : 'CONFIRM RESERVE INJECTION ⚡'}
                        </button>
                    </div>
                </div>

                {/* Current Balance Card */}
                <div className="space-y-6">
                    <h2 className="font-orbitron font-black text-2xl text-white tracking-widest italic uppercase opacity-60">BALANCE</h2>
                    <div className="card p-10 bg-success/5 border-success/30 flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-success/5 to-transparent pointer-events-none" />
                        <span className="text-4xl">💰</span>
                        <p className="text-[10px] font-black text-success tracking-[0.5em] uppercase mt-2">Personal Reserve</p>
                        <h3 className="font-orbitron font-black text-4xl text-white tracking-tighter py-4">৳{user?.wallet_balance?.toFixed(1) || 0}</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                            <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em] font-rajdhani">ACTIVE SIGNAL SYNCED</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="space-y-6">
                <h2 className="font-orbitron font-black text-2xl text-white tracking-widest italic uppercase">CREDIT <span className="text-accent2">LOGS</span></h2>
                <div className="card bg-surface/40 backdrop-blur-xl border-border/80 overflow-hidden p-8">
                    <TransactionTable transactions={transactions || []} />
                </div>
            </div>
        </div>
    )
}