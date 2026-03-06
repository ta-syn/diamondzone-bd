'use client'
import { motion } from 'framer-motion'

const METHODS = [
    { id: 'bkash', name: 'bKash', logo: '💗', color: 'accent2', description: 'Instant Mobile Transmission' },
    { id: 'nagad', name: 'Nagad', logo: '🔴', color: 'danger', description: 'Zero Charge Protocol' },
    { id: 'rocket', name: 'Rocket', logo: '🟣', color: 'accent', description: 'Quantum Secure Link' },
    { id: 'card', name: 'Card', logo: '💳', color: 'muted', description: 'Universal Credit Uplink' },
    { id: 'wallet', name: 'Wallet', logo: '💰', color: 'gold', description: 'Internal Energy Storage' },
]

export default function PaymentMethods({ selectedMethod, onSelect }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {METHODS.map((method) => {
                const isSelected = selectedMethod === method.id
                return (
                    <button
                        key={method.id}
                        onClick={() => onSelect(method.id)}
                        className={`group relative flex items-center gap-6 p-5 rounded-2xl border transition-all duration-300 overflow-hidden ${isSelected
                                ? 'border-accent bg-accent/10 shadow-glow'
                                : 'border-border bg-surface hover:border-accent/40 hover:bg-surface2'
                            }`}
                    >
                        {/* Status Light */}
                        {isSelected && (
                            <div className="absolute top-0 right-0 p-3">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                                </span>
                            </div>
                        )}

                        {/* Icon/Logo */}
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110 ${isSelected ? 'bg-accent/20' : 'bg-surface2'
                            }`}>
                            {method.logo}
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 text-left">
                            <h4 className={`font-orbitron font-black text-xs tracking-widest uppercase mb-1 transition-colors ${isSelected ? 'text-accent' : 'text-white'
                                }`}>
                                {method.name}
                            </h4>
                            <p className="text-[10px] font-rajdhani font-black text-muted uppercase tracking-tighter opacity-60">
                                {method.description}
                            </p>
                        </div>

                        {/* Selection Border Overlay */}
                        <motion.div
                            initial={false}
                            animate={isSelected ? { opacity: 1 } : { opacity: 0 }}
                            className="absolute inset-0 border-2 border-accent rounded-2xl pointer-events-none"
                        />
                    </button>
                )
            })}
        </div>
    )
}