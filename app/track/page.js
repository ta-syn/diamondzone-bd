import { Suspense } from 'react'
import OrderStatus from '@/components/track/OrderStatus'
import Spinner from '@/components/ui/Spinner'

export const metadata = {
    title: 'Mission Tracking — Order Status | DiamondZoneBD',
    description: 'Track your gaming recharge instantly. Real-time status updates for Free Fire, PUBG, and ML recharge orders.',
    keywords: ['track diamondzonebd order', 'gaming recharge status bd', 'free fire topup track'],
}

export default function TrackPage() {
    return (
        <main className="min-h-screen bg-bg relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10">
                <Suspense fallback={
                    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                        <Spinner size="lg" className="text-accent" />
                        <p className="font-orbitron text-[10px] tracking-[0.5em] text-muted uppercase font-black animate-pulse">
                            Signal Acquisition in Progress...
                        </p>
                    </div>
                }>
                    <OrderStatus />
                </Suspense>
            </div>
        </main>
    )
}