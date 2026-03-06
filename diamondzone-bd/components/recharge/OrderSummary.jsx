'use client'
import Spinner from '@/components/ui/Spinner'
import { useState } from 'react'

const PaymentMethods = [
    { id: 'bkash', name: 'bKash', logo: '💗', color: 'accent2' },
    { id: 'nagad', name: 'Nagad', logo: '🔴', color: 'danger' },
    { id: 'rocket', name: 'Rocket', logo: '🟣', color: 'accent' },
    { id: 'card', name: 'Card', logo: '💳', color: 'muted' },
    { id: 'wallet', name: 'Wallet', logo: '💰', color: 'gold' },
]

export default function OrderSummary({ game, selectedPackage, playerData, couponData, onSubmit, isSubmitting }) {
    const [selectedMethod, setSelectedMethod] = useState('bkash')

    const subtotal = selectedPackage?.sell_price || 0
    const discount = couponData?.discount || 0
    const total = Math.max(0, subtotal - discount)

    const maskedPlayerId = playerData.player_id
        ? playerData.player_id.length > 5
            ? playerData.player_id.substring(0, 3) + '****' + playerData.player_id.substring(playerData.player_id.length - 2)
            : playerData.player_id
        : 'Not Entered'

    return (
        <div className="card bg-surface2/80 backdrop-blur-xl border-border/80 sticky top-24 shadow-glow-lg overflow-hidden animate-fade-in group">

            {/* Visual Header */}
            <div className="h-1 bg-gradient-to-r from-accent via-accent2 to-gold" />

            <div className="p-6">
                <h3 className="font-orbitron font-black text-xs text-accent tracking-[0.3em] uppercase mb-6 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                </h3>

                {/* Selected Items */}
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-start group/item">
                        <div>
                            <p className="text-[10px] font-black text-muted tracking-widest uppercase mb-1">Ecosystem</p>
                            <p className="font-rajdhani font-bold text-white text-md tracking-wider">{game.name}</p>
                        </div>
                        <span className="text-2xl group-hover/item:animate-bounce transition-all">{game.emoji}</span>
                    </div>

                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-muted tracking-widest uppercase mb-1">Selected Payload</p>
                            <p className="font-rajdhani font-bold text-white text-md tracking-wider">
                                {selectedPackage ? `${selectedPackage.amount} ${game.currency_name}` : 'None Selected'}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-muted tracking-widest uppercase mb-1">Target ID</p>
                            <p className="font-mono font-bold text-white text-xs tracking-widest">{maskedPlayerId}</p>
                        </div>
                        {playerData.server && (
                            <div className="text-right">
                                <p className="text-[10px] font-black text-muted tracking-widest uppercase mb-1 text-right">Server</p>
                                <p className="font-rajdhani font-bold text-accent text-xs tracking-wider">{playerData.server}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-8">
                    <p className="text-[10px] font-black text-muted tracking-widest uppercase mb-4">Transmission Layer (Payment)</p>
                    <div className="grid grid-cols-5 gap-2">
                        {PaymentMethods.map((method) => {
                            const isSel = selectedMethod === method.id
                            return (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    title={method.name}
                                    className={`aspect-square flex flex-col items-center justify-center rounded-lg border transition-all duration-300 relative group/icon ${isSel
                                            ? `border-accent bg-accent/15 shadow-glow`
                                            : 'border-border bg-surface hover:border-accent/40'
                                        }`}
                                >
                                    <span className={`text-xl mb-1 group-hover/icon:scale-110 transition-transform ${isSel ? 'drop-shadow-glow' : ''}`}>
                                        {method.logo}
                                    </span>
                                    {isSel && (
                                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                    <p className="text-center text-[10px] font-black text-accent mt-3 uppercase tracking-[0.2em] font-orbitron animate-fade-in">
                        PAY WITH {PaymentMethods.find(m => m.id === selectedMethod).name}
                    </p>
                </div>

                {/* Pricing */}
                <div className="space-y-3 pt-6 border-t border-border/50">
                    <div className="flex justify-between text-sm font-rajdhani font-bold">
                        <span className="text-muted tracking-widest uppercase">Subtotal</span>
                        <span className="text-white">৳{subtotal}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-sm font-rajdhani font-bold text-success animate-fade-in">
                            <span className="tracking-widest uppercase flex items-center gap-2">
                                Coupon Discount
                                <span className="text-[10px] bg-success/10 px-2 rounded-full border border-success/20 tracking-tighter uppercase font-black">{couponData.code}</span>
                            </span>
                            <span>-৳{discount}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-end pt-2">
                        <span className="text-[10px] font-black text-accent tracking-[0.3em] uppercase mb-1">Total Payload</span>
                        <div className="text-3xl font-orbitron font-black text-success tracking-tighter drop-shadow-glow-green">
                            ৳{total}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <button
                    onClick={() => onSubmit(selectedMethod)}
                    disabled={isSubmitting || !selectedPackage || !playerData.player_id}
                    className="btn-fire w-full py-4 mt-8 text-md font-orbitron font-black tracking-widest uppercase flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                >
                    {isSubmitting ? (
                        <Spinner size="sm" />
                    ) : (
                        <>
                            PAY & RECHARGE
                            <svg className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </>
                    )}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                </button>

                <p className="text-[10px] text-center text-muted font-bold font-rajdhani tracking-tighter mt-4 uppercase opacity-50">
                    By clicking you agree to our <span className="text-accent underline">Refund Policy</span>
                </p>

            </div>
        </div>
    )
}