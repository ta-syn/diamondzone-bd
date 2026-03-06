'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Spinner from '@/components/ui/Spinner'
import useToastStore from '@/store/toastStore'

export default function AdminSettings() {
    const toast = useToastStore()
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(null) // key of saving setting

    const fetchSettings = async () => {
        try {
            const { data } = await axios.get('/api/admin/settings')
            setSettings(data.settings || {})
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchSettings() }, [])

    const handleUpdate = async (key, value) => {
        setSaving(key)
        try {
            await axios.post('/api/admin/settings', { key, value })
            toast.success(`Parameter ${key.toUpperCase()} re-calibrated.`)
            fetchSettings()
        } catch (err) {
            toast.error('System override failed: ' + (err.response?.data?.error || err.message))
        } finally {
            setSaving(null)
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 animate-pulse">
            <Spinner size="lg" className="text-accent" />
            <p className="font-orbitron text-[10px] tracking-[0.5em] text-muted uppercase">Scanning Mainframe Settings...</p>
        </div>
    )

    const sections = [
        {
            title: 'OPERATIONAL PROTOCOLS',
            items: [
                { key: 'maintenance_mode', label: 'Global Maintenance Flux', type: 'boolean', hint: 'Disables all mission deployments' },
                { key: 'is_payment_enabled', label: 'Payment Signal Reception', type: 'boolean', hint: 'Toggle gateway availability' },
            ]
        },
        {
            title: 'CONTACT & RADAR',
            items: [
                { key: 'whatsapp_number', label: 'Emergency WhatsApp Code', type: 'text', hint: 'Format: +8801XXXXXXXXX' },
                { key: 'support_email', label: 'Support Frequency (Email)', type: 'text', hint: 'Official communications email' },
            ]
        },
        {
            title: 'FINANCIAL PARAMS',
            items: [
                { key: 'min_deposit', label: 'Min Wallet Injection (৳)', type: 'number', hint: 'Minimum credit purchase' },
                { key: 'max_deposit', label: 'Max Wallet Injection (৳)', type: 'number', hint: 'Maximum single transaction' },
                { key: 'referral_rate', label: 'Referral Commission Factor', type: 'number', hint: 'Multiplier (e.g. 0.02 = 2%)', step: '0.01' },
            ]
        },
        {
            title: 'BROADCAST SYSTEM',
            items: [
                { key: 'announcement', label: 'Global Radar Banner', type: 'text', hint: 'Text displayed on home telemetry' },
            ]
        }
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">

            {/* Header */}
            <div className="flex items-center gap-6 border-b border-border/30 pb-8">
                <div className="w-16 h-16 bg-accent/10 border border-accent/30 rounded-2xl flex items-center justify-center text-3xl shadow-glow-sm">
                    ⚙️
                </div>
                <div>
                    <h1 className="font-orbitron font-black text-3xl text-white tracking-[0.2em] uppercase italic">
                        TERMINAL <span className="text-accent">SETTINGS</span>
                    </h1>
                    <p className="font-rajdhani font-black text-[10px] text-muted uppercase tracking-[0.5em] mt-2 opacity-60">
                        Mainframe Configuration Alpha-1
                    </p>
                </div>
            </div>

            {/* Config Grid */}
            <div className="grid grid-cols-1 gap-12">
                {sections.map((section) => (
                    <div key={section.title} className="space-y-6">
                        <h4 className="text-[10px] font-black text-muted tracking-[0.4em] uppercase mb-4 px-3 opacity-40">
                            {section.title}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {section.items.map((item) => (
                                <div key={item.key} className="card p-6 border-border/50 bg-surface/40 backdrop-blur-3xl group hover:border-accent/40 transition-all duration-500 overflow-hidden relative">
                                    {saving === item.key && (
                                        <div className="absolute inset-0 bg-bg/50 backdrop-blur-sm z-10 flex items-center justify-center">
                                            <Spinner size="sm" className="text-accent" />
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <label className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</label>
                                            <p className="text-[8px] font-bold text-muted uppercase tracking-tighter opacity-50 mt-1">{item.hint}</p>
                                        </div>

                                        {item.type === 'boolean' && (
                                            <button
                                                onClick={() => handleUpdate(item.key, !settings[item.key])}
                                                className={`w-12 h-6 rounded-full relative transition-all duration-500 border-2 ${settings[item.key] ? 'bg-success/20 border-success shadow-glow-green' : 'bg-danger/20 border-danger opacity-40'}`}
                                            >
                                                <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-500 ${settings[item.key] ? 'right-0.5 bg-success shadow-glow-green' : 'left-0.5 bg-danger shadow-glow-orange'}`} />
                                            </button>
                                        )}
                                    </div>

                                    {item.type !== 'boolean' && (
                                        <div className="relative group">
                                            <input
                                                type={item.type}
                                                defaultValue={settings[item.key]}
                                                onBlur={(e) => {
                                                    const val = item.type === 'number' ? parseFloat(e.target.value) : e.target.value
                                                    if (val !== settings[item.key]) handleUpdate(item.key, val)
                                                }}
                                                step={item.step || '1'}
                                                className="w-full bg-bg/50 border border-border/50 rounded-lg px-4 py-3 font-rajdhani font-black text-sm tracking-widest text-white focus:outline-none focus:border-accent group-hover:bg-bg/80 transition-all"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] opacity-20 pointer-events-none uppercase font-black tracking-widest">
                                                VALUE
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Notice */}
            <div className="p-6 rounded-2xl border border-border/30 bg-surface/20 text-center">
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">
                    Settings are propagated to the global radar network with a 1-hour TTL cache offset.
                </p>
            </div>
        </div>
    )
}
