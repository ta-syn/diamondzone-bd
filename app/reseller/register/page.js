'use client'
import Link from 'next/link'

export default function ResellerRegisterPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-orbitron font-black text-accent mb-8 uppercase italic">PARTNER PROGRAM</h1>
            <div className="card p-12 space-y-6">
                <p className="text-muted font-rajdhani text-xl font-bold italic">
                    The Reseller Registration system is currently in selective recruitment phase.
                </p>
                <p className="text-muted">Please contact our support team on WhatsApp to apply for an elite reseller account.</p>
                <div className="flex gap-4 justify-center">
                    <Link href="/" className="btn-fire">GO HOME</Link>
                    <a href="https://wa.me/8801234567890" className="btn-primary">WHATSAPP SUPPORT</a>
                </div>
            </div>
        </main>
    )
}
