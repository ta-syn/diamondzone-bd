'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Spinner from '@/components/ui/Spinner'

function FailContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('order_id')
    const isCancelled = searchParams.get('cancelled') === '1'

    return (
        <main className="min-h-screen pt-20 pb-24 px-6 relative overflow-hidden flex flex-col items-center justify-center">

            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-danger/5 rounded-full blur-[120px] pointer-events-none" />

            {/* 1. Animated Success Icon */}
            <div className="relative mb-8 pt-10">
                <div className="absolute inset-0 bg-danger/20 rounded-full blur-2xl animate-pulse" />
                <div className="w-24 h-24 bg-danger/10 border-4 border-danger rounded-full flex items-center justify-center animate-shake z-10 relative">
                    <svg className="w-12 h-12 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>

            <div className="text-center mb-12 animate-fade-in relative z-10">
                <h1 className="font-orbitron font-black text-3xl md:text-5xl text-white tracking-[0.2em] uppercase italic mb-4">
                    PAYMENT <span className="text-danger">{isCancelled ? 'CANCELLED' : 'FAILED'}</span>
                </h1>
                <p className="font-rajdhani text-muted text-lg md:text-xl font-medium tracking-widest uppercase max-w-lg mx-auto">
                    {isCancelled ? 'The mission was aborted. No credits were deducted from your account.' : 'Something went wrong with the transaction. Please verify your payment details.'}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 w-full max-w-lg animate-slide-up">
                <Link href="/games" className="btn-fire flex-1 py-4 text-center text-[10px] font-black tracking-[0.3em] rounded-xl">
                    TRY RE-DEPLOYMENT
                </Link>
                <a
                    href="https://wa.me/8801234567890?text=I+had+a+problem+with+payment+for+order+ID:+DZ-xxx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline flex-1 py-4 text-center text-[10px] font-black tracking-[0.3em] rounded-xl border-border/50 text-success border-success/30 hover:bg-success/5"
                >
                    CONTACT SUPPORT
                </a>
            </div>

        </main>
    )
}

export default function OrderFailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
            <FailContent />
        </Suspense>
    )
}