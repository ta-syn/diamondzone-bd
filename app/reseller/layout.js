'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import ToastContainer from '@/components/ui/Toast'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'
import axios from 'axios'
import useToastStore from '@/store/toastStore'

import ResellerSidebar from '@/components/reseller/ResellerSidebar'

export default function ResellerLayout({ children }) {
    const router = useRouter()
    const { user, loading, setUser } = useAuthStore()
    const toast = useToastStore()
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const [isApplying, setIsApplying] = useState(false)
    const [formData, setFormData] = useState({
        whatsapp: '',
        business_name: '',
        message: ''
    })

    // Fetch user status manually if needed (important for role/approval updates)
    useEffect(() => {
        if (!loading && user) {
            axios.get('/api/auth/me')
                .then(res => setUser(res.data.user))
                .catch(err => console.error('Failed to sync reseller status:', err))
        }
    }, [loading])

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login?redirect=/reseller/dashboard')
        }
    }, [user, loading, router])

    const handleApply = async (e) => {
        e.preventDefault()
        setIsApplying(true)
        try {
            await axios.post('/api/reseller/apply', formData)
            toast.success('Your application has been received. Our team will contact you soon on WhatsApp.')
            setIsApplying(false)
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to submit application.')
            setIsApplying(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6">
            <Spinner size="lg" className="text-secondary" />
            <p className="font-orbitron text-[10px] tracking-[0.5em] text-muted uppercase font-black animate-pulse">
                Establishing Reseller Terminal...
            </p>
        </div>
    )

    if (!user) return null

    // NOT A RESELLER OR NOT APPROVED
    if (user.role !== 'reseller' || !user.reseller_approved) {
        return (
            <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 bg-grid">
                <div className="max-w-xl w-full card p-10 space-y-8 animate-fade-in relative overflow-hidden backdrop-blur-xl border-border/50">
                    <div className="absolute top-0 right-[-40px] w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
                    <div className="text-center space-y-4">
                        <h1 className="font-orbitron font-black text-3xl md:text-5xl text-white tracking-widest uppercase italic">
                            RESELLER <span className="text-secondary">ACCESS</span>
                        </h1>
                        <p className="font-rajdhani text-muted text-sm font-bold uppercase tracking-widest opacity-60">
                            Professional Top-Up Command & Control
                        </p>
                        <div className="w-16 h-1 bg-secondary mx-auto mt-6 shadow-glow" />
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-surface2/50 border-l-4 border-secondary rounded-r-xl space-y-2">
                            <h3 className="text-white font-orbitron text-xs font-black tracking-widest">CLEARANCE REQUIRED</h3>
                            <p className="text-muted font-rajdhani text-xs font-bold leading-relaxed">
                                You haven't been cleared for Reseller operations. Resellers enjoy discounted rates, credit limits, and bulk command tools.
                            </p>
                        </div>

                        <form onSubmit={handleApply} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest">WhatsApp Number (For Intel Delivery)</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="+8801XXXXXXXXX"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest">Business/Shop Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="e.g. Gamer Zone BD"
                                    value={formData.business_name}
                                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest">Why should we approve you?</label>
                                <textarea
                                    className="input-field min-h-[100px] py-4"
                                    placeholder="Brief history of your gaming operations..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <button
                                disabled={isApplying}
                                className="btn-secondary w-full py-5 text-xs font-black tracking-widest uppercase transition-all hover:shadow-glow-orange group flex items-center justify-center gap-3"
                            >
                                {isApplying ? <Spinner size="sm" /> : 'TRANSMIT APPLICATION ⚡'}
                            </button>
                        </form>
                    </div>

                    <Link href="/" className="block text-center text-[9px] font-black text-muted uppercase tracking-widest hover:text-white transition-colors">
                        Return to Surface Operations
                    </Link>
                </div>
                <ToastContainer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg flex overflow-hidden">
            <ResellerSidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
                user={user}
            />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative overflow-hidden backdrop-blur-3xl bg-surface/20">
                {/* HEADER */}
                <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border flex items-center px-10 justify-between shrink-0 z-40">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-white">
                            <svg className="w-6 h-6 font-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </button>
                        <h2 className="font-orbitron font-black text-sm text-white tracking-widest uppercase italic hidden md:block">
                            COMMAND <span className="text-secondary underline">MODULE</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="font-rajdhani font-black text-white text-xs uppercase tracking-widest">{user.name}</span>
                            <span className="font-orbitron font-black text-secondary text-[9px] uppercase tracking-tighter">Elite Operative</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center font-black text-secondary font-orbitron">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-16 scrollbar-thin scrollbar-thumb-secondary/20">
                    {children}
                </main>
            </div>

            <ToastContainer />
            <div className="fixed inset-0 bg-blue-500/5 blur-[200px] pointer-events-none -z-10" />
        </div>
    )
}