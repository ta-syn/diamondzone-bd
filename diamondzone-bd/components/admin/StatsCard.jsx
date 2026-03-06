'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function StatsCard({ icon, title, value, prefix = '', suffix = '', color = 'accent', change = null }) {
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        let start = 0
        const end = parseFloat(value) || 0
        if (end === 0) return setDisplayValue(0)

        const duration = 1500
        const increment = end / (duration / 10)

        const timer = setInterval(() => {
            start += increment
            if (start >= end) {
                setDisplayValue(end)
                clearInterval(timer)
            } else {
                setDisplayValue(Math.floor(start))
            }
        }, 10)

        return () => clearInterval(timer)
    }, [value])

    const colors = {
        accent: 'from-accent/20 to-transparent border-accent/20',
        accent2: 'from-accent2/20 to-transparent border-accent2/20',
        gold: 'from-gold/20 to-transparent border-gold/20',
        success: 'from-success/20 to-transparent border-success/20',
        danger: 'from-danger/20 to-transparent border-danger/20',
    }

    const textColors = {
        accent: 'text-accent',
        accent2: 'text-accent2',
        gold: 'text-gold',
        success: 'text-success',
        danger: 'text-danger',
    }

    return (
        <div className={`card relative overflow-hidden p-6 border group bg-gradient-to-br transition-all hover:bg-surface2 ${colors[color]}`}>

            {/* Background Decor */}
            <div className="absolute top-[-20px] right-[-20px] text-5xl opacity-[0.05] grayscale brightness-200 group-hover:scale-125 transition-transform duration-700 select-none">
                {icon}
            </div>

            <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <h3 className="font-rajdhani font-black text-muted text-xs tracking-[0.3em] uppercase opacity-70">
                        {title}
                    </h3>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <span className={`font-orbitron font-black text-3xl tracking-tighter ${textColors[color]}`}>
                            {prefix}{displayValue.toLocaleString()}{suffix}
                        </span>
                        {change !== null && (
                            <p className={`text-[10px] font-black tracking-widest uppercase mt-1 ${change >= 0 ? 'text-success' : 'text-danger'}`}>
                                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs Last Mission
                            </p>
                        )}
                    </div>

                    <div className={`w-8 h-8 rounded-lg bg-${color}/10 border border-${color}/20 flex items-center justify-center`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-${color} animate-pulse shadow-glow shadow-${color}`} />
                    </div>
                </div>
            </div>

            {/* Decorative Progress Bar */}
            <div className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 bg-${color} opacity-40 group-hover:opacity-100 w-full`} />

        </div>
    )
}