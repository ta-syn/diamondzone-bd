'use client'
import Link from 'next/link'

export default function FAQPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-orbitron font-black text-accent mb-8">FAQ</h1>
            <div className="space-y-6">
                <p className="text-muted italic">This page is currently under construction for the demo.</p>
                <Link href="/" className="btn-fire inline-block">GO HOME</Link>
            </div>
        </main>
    )
}
