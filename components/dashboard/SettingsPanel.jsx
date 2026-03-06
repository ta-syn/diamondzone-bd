'use client'
import { useState } from 'react'
import axios from 'axios'
import useToastStore from '@/store/toastStore'
import Spinner from '@/components/ui/Spinner'
import useAuthStore from '@/store/authStore'

export default function SettingsPanel({ user }) {
    const toast = useToastStore()
    const { setUser } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.put('/api/user/profile', formData)
            setUser(data.user)
            toast.success('System Protocols Updated Successfully!')
        } catch (err) {
            toast.error(err.response?.data?.error || 'Uplink synchronization failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-12 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="font-orbitron font-black text-3xl text-white tracking-widest italic uppercase">SYSTEM <span className="text-secondary">CONFIG</span></h2>
                    <p className="font-rajdhani font-black text-muted text-xs uppercase tracking-[0.4em] mt-2 opacity-60">Operative Identity & Communication Protocols</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                    <form onSubmit={handleSubmit} className="card p-10 bg-surface/50 border-border/50 space-y-8 relative overflow-hidden">
                        <div className="absolute top-[-20px] right-[-20px] text-9xl opacity-[0.03] select-none font-orbitron font-black italic">SET</div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted tracking-widest uppercase">Commander Name</label>
                                <input
                                    type="text"
                                    className="input-field h-14"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted tracking-widest uppercase">Encryption Identity (Email)</label>
                                <input
                                    type="email"
                                    className="input-field h-14 opacity-50 cursor-not-allowed"
                                    value={user?.email || ''}
                                    disabled
                                />
                                <p className="text-[8px] font-bold text-muted uppercase tracking-widest italic flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" /> Email uplink cannot be modified for security clearance.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted tracking-widest uppercase">Signal Channel (Phone)</label>
                                <input
                                    type="text"
                                    className="input-field h-14"
                                    placeholder="+8801XXXXXXXXX"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 btn-primary bg-secondary border-secondary text-bg font-orbitron font-black text-sm tracking-[0.3em] uppercase rounded-2xl shadow-glow-orange hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {loading ? <Spinner size="sm" /> : 'SAVE CONFIGURATION 💾'}
                        </button>
                    </form>
                </div>

                <div className="space-y-8">
                    <div className="card p-10 bg-surface/40 border-border/30 flex flex-col gap-6">
                        <h3 className="font-orbitron font-black text-sm text-white tracking-widest uppercase italic">SECURITY TERMINAL</h3>
                        <p className="font-rajdhani text-xs font-bold text-muted uppercase tracking-widest leading-loose">
                            To ensure maximal operational security, password modifications require a secondary encrypted handshake protocol.
                        </p>
                        <button className="btn-outline h-14 text-[10px] font-black tracking-widest uppercase rounded-xl border-border/50 hover:border-danger hover:text-danger transition-all">
                            RESET ENCRYPTION KEY (PASSWORD)
                        </button>
                    </div>

                    <div className="card p-8 bg-success/5 border-success/20 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-success uppercase tracking-widest mb-1">ACCOUNT STATUS</p>
                            <h4 className="font-orbitron font-black text-white text-md tracking-tighter uppercase italic">FULLY VERIFIED PEER</h4>
                        </div>
                        <span className="text-4xl filter drop-shadow-glow">🛡️</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
