'use client'
import { useEffect } from 'react'

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error('SYSTEM COLLAPSE:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-10 p-10 text-center">
            {/* Massive Error ID Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03] select-none">
                <p className="text-[20vw] font-black font-orbitron -rotate-12 translate-y-1/2 whitespace-nowrap">ERROR_500</p>
            </div>

            <div className="relative group">
                <div className="absolute -inset-4 bg-danger/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-9xl grayscale opacity-20 block mb-4">🛸</span>
                <span className="text-6xl absolute inset-0 flex items-center justify-center animate-pulse">🛰️</span>
            </div>

            <div className="space-y-6 max-w-2xl relative z-10">
                <h1 className="font-orbitron font-black text-4xl text-white tracking-[0.3em] uppercase italic">
                    SYSTEM <span className="text-danger">DISRUPTION</span>
                </h1>
                <p className="font-rajdhani font-bold text-muted text-sm uppercase tracking-[0.4em] leading-relaxed">
                    A critical sequence failure has occurred. Our neural uplink to the game servers has been severed by an unpredictable data storm.
                </p>
                <div className="bg-surface2/50 border border-border/50 p-6 rounded-2xl font-mono text-xs text-danger/80 break-all shadow-glow-orange/5">
                    CMD_FAIL: {error?.message || 'NULL_REFERENCE_EXCEPTION'}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 relative z-10 w-full max-w-md">
                <button
                    onClick={() => reset()}
                    className="flex-1 btn-primary py-5 rounded-xl font-orbitron font-black text-[10px] tracking-[0.5em] uppercase shadow-glow"
                >
                    INITIATE RECOVERY
                </button>
                <button
                    onClick={() => window.location.href = '/'}
                    className="flex-1 btn-outline py-5 rounded-xl font-orbitron font-black text-[10px] tracking-[0.5em] uppercase border-border/30"
                >
                    RETURN TO BASE
                </button>
            </div>

            <p className="text-[9px] font-black text-muted uppercase tracking-[0.5em] mt-10">
                Authorized Recovery Terminal // Node BD-01
            </p>
        </div>
    )
}