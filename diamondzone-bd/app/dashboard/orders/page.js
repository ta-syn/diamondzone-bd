'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/ui/Spinner'

export default function OrdersRedirect() {
    const router = useRouter()
    useEffect(() => {
        router.replace('/dashboard?tab=orders')
    }, [router])

    return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6">
            <Spinner size="lg" className="text-accent" />
            <p className="font-orbitron text-[10px] tracking-[0.5em] text-muted uppercase animate-pulse">Navigating to Mission Logs...</p>
        </div>
    )
}