'use client'
import { useEffect } from 'react'
import Spinner from '@/components/ui/Spinner'

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error('CRITICAL SIGNAL LOSS:', error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8 animate-fade-in p-6 text-center">
            {/* Glitch Effect Icon */}
            <div className="relative">
                <span className="text-8xl opacity-20 grayscale">📡</span>
                <span className="absolute inset-0 flex items-center justify-center text-6xl animate-pulse">⚡</span>
            </div>

            <div className="space-y-4 max-w-md">
                <h2 className="font-orbitron font-black text-white text-2xl tracking-[0.2em] uppercase italic">
                    SIGNAL <span className="text-danger">LOST</span>
                </h2>
                <p className="font-rajdhani font-bold text-muted text-xs uppercase tracking-[0.3em] leading-loose">
                    Transmission intercepted by an unknown anomaly. The global terminal is unable to reconcile the current operative data stream.
                </p>
                <div className="p-4 bg-danger/5 border border-danger/20 rounded-xl">
                    <p className="font-mono text-[9px] text-danger/70 uppercase tracking-tighter truncate">
                        {error?.message || 'UNIDENTIFIED_PROTOCOL_ERROR_X99'}
                    </p>
                </div>
            </div>

            <button
                onClick={() => reset()}
                className="btn-primary group relative px-10 py-4 rounded-xl overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 font-orbitron font-black text-[10px] tracking-[0.4em] uppercase">
                    RE-SYNC TERMINAL
                </span>
            </button>

        </div>
    )
}
