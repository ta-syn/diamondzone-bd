'use client'
import { useState } from 'react'
import axios from 'axios'
import Spinner from '@/components/ui/Spinner'

export default function CouponInput({ gameId, orderAmount, onApply, couponData }) {
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleApply = async () => {
        if (!code) return
        setLoading(true)
        setError('')

        try {
            const { data } = await axios.post('/api/coupons/validate', {
                code: code.trim().toUpperCase(),
                gameId,
                orderAmount
            })

            if (data.success) {
                onApply({
                    code: data.coupon.code,
                    discount: data.discountAmount,
                    is_valid: true,
                    message: data.message
                })
                setCode('')
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid coupon')
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = () => {
        onApply({ code: '', discount: 0, is_valid: false, message: '' })
    }

    return (
        <div className="mb-10 animate-fade-in">
            <h3 className="font-rajdhani text-sm text-muted tracking-[0.3em] uppercase mb-4 font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                03. Promo Code
            </h3>

            <div className="relative group">
                {couponData.is_valid ? (
                    <div className="bg-success/5 border border-success/30 rounded-lg p-4 flex items-center justify-between animate-fade-in shadow-glow-green">
                        <div className="flex items-center gap-4">
                            <span className="text-xl">🎟️</span>
                            <div>
                                <p className="font-orbitron font-black text-white tracking-widest leading-none mb-1">
                                    {couponData.code} <span className="text-[10px] text-success ml-2 font-bold uppercase">Applied</span>
                                </p>
                                <p className="text-xs text-muted font-rajdhani font-bold lowercase tracking-wider">
                                    You save ৳{couponData.discount}!
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleRemove}
                            className="text-muted hover:text-danger text-[10px] font-black tracking-widest uppercase transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <div className="relative flex-1 group">
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                className={`input-field pr-12 transition-all duration-300 ${error ? 'border-danger/50 bg-danger/5' : 'border-border bg-surface shadow-inner group-focus-within:shadow-glow'}`}
                                placeholder="ENTER PROMO CODE (e.g. WELCOME10)"
                                maxLength={20}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-300">
                                <span className="text-muted/40 font-orbitron text-[10px] tracking-[0.2em] font-black uppercase">Promo</span>
                            </div>
                        </div>
                        <button
                            onClick={handleApply}
                            disabled={loading || !code}
                            className="btn-primary px-8 min-w-[120px] flex items-center justify-center gap-3 active:scale-95 transition-all text-xs tracking-[0.2em] font-black disabled:opacity-50"
                        >
                            {loading ? <Spinner size="sm" /> : 'APPLY'}
                        </button>
                    </div>
                )}
                {error && <p className="text-[10px] text-danger font-black tracking-widest mt-2 animate-slide-up uppercase px-2">❌ {error}</p>}
            </div>
        </div>
    )
}
