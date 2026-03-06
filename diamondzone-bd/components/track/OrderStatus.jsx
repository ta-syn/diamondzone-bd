'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import ProgressStepper from './ProgressStepper'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'

export default function OrderStatus() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialOrderId = searchParams.get('id')

    const [orderId, setOrderId] = useState(initialOrderId || '')
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [countdown, setCountdown] = useState(10)

    const fetchOrder = useCallback(async (id) => {
        if (!id) return
        setError('')
        try {
            const { data } = await axios.get(`/api/orders/${id}`)
            if (data.order) {
                setOrder(data.order)
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Order tracking credentials invalid.')
            setOrder(null)
        } finally {
            setLoading(false)
        }
    }, [])

    // 1. Initial Load & URL Sync
    useEffect(() => {
        if (initialOrderId) {
            setLoading(true)
            fetchOrder(initialOrderId)
        }
    }, [initialOrderId, fetchOrder])

    // 2. Auto-refresh for active orders
    useEffect(() => {
        let timer
        if (order && (order.status === 'pending' || order.status === 'processing')) {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        fetchOrder(order.order_id)
                        return 10
                    }
                    return prev - 1
                })
            }, 1000)
        } else {
            setCountdown(10)
        }
        return () => clearInterval(timer)
    }, [order, fetchOrder])

    const handleSearch = (e) => {
        e.preventDefault()
        if (!orderId) return
        setLoading(true)
        const params = new URLSearchParams(searchParams.toString())
        params.set('id', orderId.trim().toUpperCase())
        window.history.pushState(null, '', `?${params.toString()}`)
        fetchOrder(orderId.trim().toUpperCase())
    }

    // 3. Status UI Mapping
    const statusConfig = useMemo(() => ({
        pending: { color: 'gold', message: 'Your order is queued in the terminal. Estimated: under 5 minutes.', icon: '⏳' },
        processing: { color: 'accent', message: 'Mission in progress. Re-transmitting recharge payload to your account...', icon: '🔄' },
        completed: { color: 'success', message: 'Recharge consumed and delivered successfully! Status verified.', icon: '✅' },
        cancelled: { color: 'danger', message: 'Order aborted by system or protocol failure. Contact support HQ.', icon: '❌' },
        refunded: { color: 'accent2', message: 'Energy credits have been returned to your secure wallet.', icon: '💰' },
    }), [])

    const currentStatus = statusConfig[order?.status] || statusConfig.pending

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 md:py-20 animate-fade-in">

            {/* SEARCH HEADER */}
            <div className="text-center mb-16 space-y-4">
                <div className="inline-block border border-accent/20 bg-accent/5 text-accent font-bold text-[10px] tracking-[0.4em] uppercase px-6 py-1.5 rounded-full mb-4 shadow-glow">
                    🛰️ RADAR TRACKING
                </div>
                <h1 className="font-orbitron font-black text-4xl md:text-6xl text-white tracking-widest uppercase italic">
                    MISSION <span className="text-accent">STATUS</span>
                </h1>

                <form onSubmit={handleSearch} className="max-w-xl mx-auto pt-10">
                    <div className="flex gap-3 group">
                        <input
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                            placeholder="ENTER ORDER ID (e.g. DZ-2025-XXXXX)"
                            className="input-field group-focus-within:shadow-glow flex-1 tracking-widest font-mono text-sm md:text-md h-14"
                        />
                        <button
                            type="submit"
                            disabled={loading || !orderId}
                            className="btn-primary px-8 h-14 text-[10px] font-black tracking-widest uppercase"
                        >
                            {loading ? <Spinner size="sm" /> : 'LOCATE'}
                        </button>
                    </div>
                    {error && <p className="text-[10px] text-danger font-black tracking-widest mt-2 uppercase text-left px-2 animate-slide-up">❌ ERR: {error}</p>}
                </form>
            </div>

            {/* TRACKING CONTENT */}
            {order ? (
                <div className="space-y-10 animate-slide-up">

                    {/* Progress Board */}
                    <div className="card bg-surface2/50 backdrop-blur-xl border-border/80 shadow-glow overflow-hidden relative">
                        <div className={`h-1 bg-${currentStatus.color}`} />

                        {/* Countdown Overlay */}
                        {(order.status === 'pending' || order.status === 'processing') && (
                            <div className="absolute top-4 right-6 text-[8px] md:text-[10px] font-black text-muted tracking-widest uppercase flex items-center gap-2 group">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
                                RE-SCANNING IN {countdown}S
                            </div>
                        )}

                        <div className="p-8 md:p-12">
                            <ProgressStepper status={order.status} />
                        </div>

                        {/* Status Card */}
                        <div className={`mx-8 mb-8 p-6 rounded-xl border flex flex-col md:flex-row items-center gap-6 text-center md:text-left transition-all bg-${currentStatus.color}/5 border-${currentStatus.color}/20`}>
                            <span className="text-5xl animate-float">{currentStatus.icon}</span>
                            <div className="flex-1 space-y-2">
                                <h3 className={`font-orbitron font-black text-xs md:text-sm tracking-widest uppercase text-${currentStatus.color}`}>
                                    PROTOCOL: {order.status}
                                </h3>
                                <p className="font-rajdhani font-bold text-white text-md tracking-wider">
                                    {currentStatus.message}
                                </p>
                            </div>
                            {order.status === 'completed' && (
                                <Link href="/games" className="btn-outline px-6 py-2 text-[10px] font-black tracking-widest text-success border-success/30 hover:bg-success/5">
                                    START NEW MISSION
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Detailed Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card p-8 border-border/50 space-y-6">
                            <h4 className="text-[10px] font-black text-muted tracking-widest uppercase flex items-center gap-2">
                                <span className="w-1 h-1 bg-accent rounded-full" />
                                Gamer Credentials
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-border/20 pb-4">
                                    <span className="text-xs font-rajdhani font-black text-white tracking-widest uppercase opacity-40">Target ID</span>
                                    <span className="font-mono font-black text-md text-white tracking-widest uppercase">{order.player_id}</span>
                                </div>
                                {order.server && (
                                    <div className="flex justify-between items-center border-b border-border/20 pb-4">
                                        <span className="text-xs font-rajdhani font-black text-white tracking-widest uppercase opacity-40">Ecosystem Server</span>
                                        <span className="font-rajdhani font-bold text-md text-accent tracking-widest uppercase">{order.server}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="card p-8 border-border/50 space-y-6">
                            <h4 className="text-[10px] font-black text-muted tracking-widest uppercase flex items-center gap-2">
                                <span className="w-1 h-1 bg-accent2 rounded-full" />
                                Payload Information
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-border/20 pb-4">
                                    <span className="text-xs font-rajdhani font-black text-white tracking-widest uppercase opacity-40">Cargo</span>
                                    <span className="font-orbitron font-black text-sm text-white tracking-widest uppercase">{order.game_name}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-border/20 pb-4">
                                    <span className="text-xs font-rajdhani font-black text-white tracking-widest uppercase opacity-40">Amount</span>
                                    <span className="font-orbitron font-black text-lg text-success tracking-tighter">{order.package_amount} UNIT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : !loading && initialOrderId && (
                <div className="text-center py-20 animate-fade-in opacity-40">
                    <span className="text-6xl mb-6 block">🛰️</span>
                    <p className="font-orbitron font-black text-white tracking-[0.5em] uppercase">SYSTEM OFFLINE</p>
                    <p className="text-[10px] text-muted font-bold tracking-[0.2em] font-rajdhani uppercase mt-2">Enter valid mission ID for signal acquisition.</p>
                </div>
            )}

        </div>
    )
}