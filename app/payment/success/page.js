'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import Spinner from '@/components/ui/Spinner'

function SuccessContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const orderId = searchParams.get('order_id')
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!orderId) {
            router.push('/')
            return
        }

        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`/api/orders/${orderId}`)
                setOrder(data.order)
            } catch (err) {
                console.error('Fetch order error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [orderId, router])

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-bg"><Spinner size="lg" /></div>

    return (
        <main className="min-h-screen pt-20 pb-24 px-6 relative overflow-hidden flex flex-col items-center">

            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-success/5 rounded-full blur-[120px] pointer-events-none" />

            {/* 1. Animated Success Icon */}
            <div className="relative mb-8 pt-10">
                <div className="absolute inset-0 bg-success/20 rounded-full blur-2xl animate-pulse" />
                <div className="w-24 h-24 bg-success/10 border-4 border-success rounded-full flex items-center justify-center animate-bounce-success z-10 relative">
                    <svg className="w-12 h-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>

            <div className="text-center mb-12 animate-fade-in relative z-10">
                <h1 className="font-orbitron font-black text-3xl md:text-5xl text-white tracking-[0.2em] uppercase italic mb-4">
                    RECHARGE <span className="text-success">SUCCESSFUL</span>!
                </h1>
                <p className="font-rajdhani text-muted text-lg md:text-xl font-medium tracking-widest uppercase">
                    Your mission is complete. Diamonds have been dispatched.
                </p>
            </div>

            {/* 2. Order Summary Card */}
            {order && (
                <div className="card w-full max-w-2xl bg-surface2/80 backdrop-blur-xl border-border/80 shadow-glow-green overflow-hidden animate-slide-up mb-12">
                    <div className="h-1 bg-gradient-to-r from-success via-emerald-500 to-success" />

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b border-border/50 pb-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-muted tracking-widest uppercase">Order ID</p>
                                <p className="font-mono font-black text-sm text-accent uppercase tracking-widest">{order.order_id}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] font-black text-muted tracking-widest uppercase text-right">Payment via</p>
                                <p className="font-rajdhani font-black text-white text-md tracking-wider uppercase">{order.payment_method}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-muted tracking-widest uppercase mb-1">Target Account</p>
                                    <p className="font-orbitron font-black text-white text-lg tracking-widest">{order.player_id}</p>
                                    {order.server && <p className="text-[10px] font-bold text-accent uppercase font-rajdhani tracking-widest mt-1">SERVER: {order.server}</p>}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted tracking-widest uppercase mb-1">Ecosystem</p>
                                    <p className="font-rajdhani font-bold text-white tracking-widest uppercase">{order.game_name}</p>
                                </div>
                            </div>

                            <div className="space-y-6 text-right">
                                <div>
                                    <p className="text-[10px] font-black text-muted tracking-widest uppercase mb-1 text-right">Payload Amount</p>
                                    <p className="font-orbitron font-black text-success text-2xl tracking-tighter">
                                        {order.package_amount} <span className="text-xs text-muted">UNIT</span>
                                    </p>
                                    <p className="text-[10px] font-bold text-muted uppercase font-rajdhani tracking-tighter">{order.package_name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted tracking-widest uppercase mb-1 text-right">Total Transacted</p>
                                    <p className="font-orbitron font-black text-white text-xl tracking-tight">৳{order.amount_paid}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-success/5 border border-success/20 rounded-lg text-center animate-pulse">
                            <p className="text-[10px] font-black text-success uppercase tracking-[0.3em]">Status: Recharge Consumed and Delivered</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 w-full max-w-lg mb-20 animate-slide-up [animation-delay:0.3s]">
                <Link href="/dashboard/orders" className="btn-primary flex-1 py-4 text-center text-[10px] font-black tracking-[0.3em] rounded-xl">
                    TRACK ORDER DETAILS
                </Link>
                <Link href="/games" className="btn-outline flex-1 py-4 text-center text-[10px] font-black tracking-[0.3em] rounded-xl border-border/50">
                    INITIATE NEW TOP-UP
                </Link>
            </div>

            {/* Confetti Particles */}
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-success opacity-0 animate-confetti pointer-events-none"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`
                    }}
                />
            ))}

        </main>
    )
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
            <SuccessContent />
        </Suspense>
    )
}