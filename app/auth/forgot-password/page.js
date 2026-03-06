'use client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-float" />
            
            <div className="card w-full max-w-md p-8 relative z-10 shadow-glow backdrop-blur-sm bg-surface/80 border-border/50 animate-fade-in text-center">
                <h1 className="text-2xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-500 mb-4">
                    PASSWORD RECOVERY
                </h1>
                <p className="text-muted mb-8">
                    Password recovery is currently disabled in demo mode. Please contact the administrator for assistance.
                </p>
                <Link href="/auth/login" className="btn-fire w-full block">
                    RETURN TO LOGIN
                </Link>
            </div>
        </main>
    )
}
