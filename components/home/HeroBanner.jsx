'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const StatItem = ({ number, label, suffix = '+' }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const end = parseFloat(number)
        const duration = 2000
        const increment = end / (duration / 10)

        const timer = setInterval(() => {
            start += increment
            if (start >= end) {
                setCount(end)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 10)

        return () => clearInterval(timer)
    }, [number])

    return (
        <div className="flex flex-col items-center group">
            <div className="font-orbitron text-3xl md:text-4xl font-black text-accent mb-1 group-hover:drop-shadow-glow group-hover:scale-110 transition-transform cursor-default">
                {count}{suffix}
            </div>
            <div className="font-rajdhani text-[10px] md:text-xs text-muted uppercase tracking-[0.3em] font-bold">
                {label}
            </div>
        </div>
    )
}

export default function HeroBanner() {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">

            {/* Animated Orbs */}
            <div className="absolute top-[-200px] left-[-150px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] animate-float pointer-events-none" />
            <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-accent2/10 rounded-full blur-[100px] animate-float [animation-delay:-3s] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 max-w-4xl pt-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-block border border-accent/20 bg-accent/5 text-accent font-bold text-[10px] md:text-xs tracking-[0.4em] uppercase px-6 py-2 rounded-full mb-8 shadow-glow"
                >
                    ⚡ BANGLADESH'S #1 GAMING PLATFORM
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-orbitron font-black text-5xl md:text-8xl leading-tight md:leading-[1.1] mb-6 select-none"
                >
                    <span className="text-white drop-shadow-lg">INSTANT GAMING</span><br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent2 to-gold drop-shadow-glow-orange filter brightness-125">
                        TOP-UP ZONE
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="font-rajdhani text-muted text-lg md:text-2xl max-w-2xl mx-auto mb-12 tracking-wide font-medium"
                >
                    Buy Free Fire Diamonds, PUBG UC, Mobile Legends, and Valorant Points instantly.
                    <span className="text-white ml-2">Fastest Delivery in Bangladesh.</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
                >
                    <Link href="/games" className="btn-fire px-12 py-5 text-lg md:text-xl rounded-xl group">
                        🎮 TOP-UP NOW
                    </Link>
                    <Link href="/track" className="btn-outline px-12 py-5 text-lg md:text-xl rounded-xl group border-border/50">
                        📦 TRACK ORDER
                    </Link>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-10 border-t border-border/30"
                >
                    <StatItem number="50" label="Happy Gamers" suffix="K+" />
                    <StatItem number="2" label="Orders Delivered" suffix="M+" />
                    <StatItem number="99.9" label="Success Rate" suffix="%" />
                    <StatItem number="30" label="Avg Delivery" suffix="s" />
                </motion.div>
            </div>

        </section>
    )
}