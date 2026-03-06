'use client'
import Link from 'next/link'

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-orbitron font-black text-accent mb-8 uppercase italic">ABOUT DIAMOND⚡ZONEBD</h1>
            <div className="space-y-6 text-muted font-rajdhani text-lg font-bold">
                <p>DiamondZoneBD is Bangladesh's premier destination for fast, secure, and reliable gaming top-ups since 2026.</p>
                <p>We specialize in providing instant delivery for Free Fire Diamonds, PUBG Mobile UC, Mobile Legends Diamonds, and many more popular titles.</p>
                <div className="bg-surface/50 p-8 rounded-2xl border border-border/50 space-y-4">
                    <h2 className="text-white text-xl uppercase font-orbitron tracking-widest">Our Mission</h2>
                    <p>To provide the best gaming experience by ensuring that every gamer can access their favorite in-game currency without any hassle.</p>
                </div>
                <Link href="/" className="btn-fire inline-block">GO HOME</Link>
            </div>
        </main>
    )
}
