'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import Sidebar from '@/components/admin/Sidebar'
import ToastContainer from '@/components/ui/Toast'
import Spinner from '@/components/ui/Spinner'

export default function AdminLayout({ children }) {
    const router = useRouter()
    const { user, loading } = useAuthStore()
    const [isSidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/auth/login?redirect=/admin/dashboard')
        }
    }, [user, loading, router])

    if (loading) return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6">
            <Spinner size="lg" className="text-accent" />
            <p className="font-orbitron text-[10px] tracking-[0.5em] text-muted uppercase font-black animate-pulse">
                Authenticating Administrator...
            </p>
        </div>
    )

    if (!user || user.role !== 'admin') return null

    return (
        <div className="min-h-screen bg-bg flex overflow-hidden">

            {/* 1. SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />

            {/* 2. MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative overflow-hidden backdrop-blur-3xl bg-surface/20">

                {/* MOBILE HEADER BAR */}
                <header className="md:hidden h-16 bg-surface border-b border-border flex items-center px-6 justify-between shrink-0">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 border border-border/50 rounded-lg text-white"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>

                    <div className="font-orbitron text-xs font-black tracking-widest text-accent uppercase">
                        ADMIN PANEL
                    </div>

                    <div className="w-9 h-9 rounded-full bg-accent text-bg flex items-center justify-center font-black text-xs">
                        {user.name.charAt(0)}
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-12 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                    {children}
                </main>

                {/* FOOTER: SYSTEM STATUS BUG */}
                <footer className="h-10 bg-surface2/50 border-t border-border/30 px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-glow-green" />
                        <span className="text-[9px] font-black text-white/50 tracking-[0.2em] font-orbitron uppercase">System Shield Active</span>
                    </div>
                    <p className="text-[9px] font-bold text-muted uppercase tracking-widest">Global Terminal Alpha-1 Ver. 95</p>
                </footer>

            </div>

            <ToastContainer />

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

        </div>
    )
}