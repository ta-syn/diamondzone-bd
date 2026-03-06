'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Spinner from '@/components/ui/Spinner'
import useToastStore from '@/store/toastStore'
import Image from 'next/image'

export default function ResellerRechargeClient({ initialGames }) {
    const toast = useToastStore()
    const [selectedGame, setSelectedGame] = useState(null)
    const [packages, setPackages] = useState([])
    const [loadingPkgs, setLoadingPkgs] = useState(false)
    const [selectedPkg, setSelectedPkg] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        player_id: '',
        server: '',
        email: '',
        phone: ''
    })

    const handleSelectGame = async (game) => {
        setSelectedGame(game)
        setLoadingPkgs(true)
        setFormData({ ...formData, server: game.server_options?.[0] || '' })
        try {
            const { data } = await axios.get(`/api/games/${game.slug}/packages`)
            setPackages(data.packages)
            setSelectedPkg(data.packages[0] || null)
            setLoadingPkgs(false)
        } catch (err) {
            toast.error('Failed to communicate with ecosystem data.')
            setLoadingPkgs(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedPkg) return toast.error('Shield configuration incomplete: No package selected.')

        setIsSubmitting(true)
        try {
            const { data } = await axios.post('/api/reseller/recharge', {
                package_id: selectedPkg._id,
                ...formData
            })
            toast.success('Mission accepted. System executing top-up.')
            // Redirect or show success
            setTimeout(() => {
                window.location.href = `/reseller/orders`
            }, 1000)
        } catch (err) {
            toast.error(err.response?.data?.error || 'Mission execution failure.')
            setIsSubmitting(false)
        }
    }

    if (!selectedGame) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {initialGames.map((game, i) => (
                    <button
                        key={game._id}
                        onClick={() => handleSelectGame(game)}
                        className="card p-6 bg-surface/50 border-border group hover:border-secondary transition-all flex flex-col items-center animate-fade-in"
                        style={{ animationDelay: `${i * 0.05}s` }}
                    >
                        <span className="text-6xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform filter drop-shadow-glow">
                            {game.emoji}
                        </span>
                        <h3 className="font-orbitron font-black text-xs text-white tracking-widest uppercase truncate w-full text-center group-hover:text-secondary transition-colors">
                            {game.name}
                        </h3>
                    </button>
                ))}
            </div>
        )
    }

    if (loadingPkgs) return (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
            <Spinner size="lg" className="text-secondary" />
            <span className="font-orbitron font-black text-[10px] tracking-widest text-muted animate-pulse uppercase">DCRYPTING MISSION DATA...</span>
        </div>
    )

    return (
        <div className="flex flex-col lg:flex-row gap-10 animate-slide-up">

            {/* LEFT: MISSION CONFIG */}
            <div className="flex-1 space-y-10">

                {/* ECOSYSTEM IDENTIFIER */}
                <div className="p-8 card bg-secondary/5 border-secondary/30 flex items-center gap-6 relative overflow-hidden group">
                    <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform filter drop-shadow-glow">
                        {selectedGame.emoji}
                    </span>
                    <div className="relative z-10 space-y-1">
                        <h3 className="font-orbitron font-black text-2xl text-white tracking-widest uppercase italic">{selectedGame.name}</h3>
                        <button onClick={() => setSelectedGame(null)} className="text-[10px] font-black text-secondary hover:underline uppercase tracking-[0.2em] transition-all">
                            CHANGE ECOSYSTEM 🔄
                        </button>
                    </div>
                </div>

                {/* PACKAGE SELECTION MATRIX */}
                <div className="space-y-6">
                    <h4 className="font-orbitron font-black text-xs text-muted tracking-widest uppercase flex items-center gap-3 italic">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-glow" /> 01. SELECT PAYLOAD
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {packages.map((pkg) => {
                            const resellerPrice = pkg.price_reseller || pkg.sell_price
                            const savings = pkg.sell_price - resellerPrice
                            return (
                                <button
                                    key={pkg._id}
                                    onClick={() => setSelectedPkg(pkg)}
                                    className={`p-6 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${selectedPkg?._id === pkg._id ? 'bg-secondary/10 border-secondary' : 'bg-surface border-border/50 hover:border-secondary/50'
                                        }`}
                                >
                                    <div className="font-orbitron font-black text-lg text-white mb-2">{pkg.amount} <span className="text-[9px] text-muted tracking-widest uppercase">{selectedGame.currency_name}</span></div>
                                    <div className="text-secondary font-orbitron font-black text-sm">৳{resellerPrice}</div>
                                    {savings > 0 && (
                                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-green/10 border border-green/20 text-green text-[8px] font-black rounded uppercase tracking-widest animate-pulse">
                                            SAVE ৳{savings}
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* TARGET CONFIGURATION */}
                <div className="space-y-6">
                    <h4 className="font-orbitron font-black text-xs text-muted tracking-widest uppercase flex items-center gap-3 italic">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-glow" /> 02. TARGET DATA
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-6 p-8 card bg-surface2/30 backdrop-blur-xl border-border/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest">{selectedGame.player_id_label} (Target ID)</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field border-border/50 focus:border-secondary"
                                    placeholder={selectedGame.player_id_hint || "Enter coordinate ID..."}
                                    value={formData.player_id}
                                    onChange={(e) => setFormData({ ...formData, player_id: e.target.value })}
                                />
                            </div>
                            {selectedGame.server_options?.length > 1 && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-widest">Ecosystem Server</label>
                                    <select
                                        className="input-field border-border/50 focus:border-secondary cursor-pointer"
                                        value={formData.server}
                                        onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                                    >
                                        {selectedGame.server_options.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest">Confirmation Route (Email)</label>
                                <input
                                    type="email"
                                    required
                                    className="input-field border-border/50 focus:border-secondary"
                                    placeholder="Intel delivery address..."
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest">Contact Freq (Optional Phone)</label>
                                <input
                                    type="text"
                                    className="input-field border-border/50 focus:border-secondary"
                                    placeholder="Tactical number..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="btn-secondary w-full py-6 mt-8 text-xs font-black tracking-[0.4em] uppercase transition-all shadow-glow hover:shadow-glow-secondary group flex items-center justify-center gap-4"
                        >
                            {isSubmitting ? <Spinner size="sm" /> : 'EXECUTE MISSION COMMAND 💥'}
                        </button>
                    </form>
                </div>

            </div>

            {/* RIGHT: MISSION BRIEF */}
            <aside className="w-full lg:w-[400px] flex-shrink-0 animate-slide-up [animation-delay:0.2s]">
                <div className="card sticky top-24 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-secondary to-transparent" />

                    <div className="p-8 space-y-8 bg-surface border-border flex flex-col justify-between">
                        <h3 className="font-orbitron font-black text-lg text-white tracking-widest uppercase italic">MISSION BRIEF</h3>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-xs font-rajdhani font-black uppercase tracking-widest">
                                <span className="text-muted">Target Ecosystem</span>
                                <span className="text-white">{selectedGame.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-rajdhani font-black uppercase tracking-widest">
                                <span className="text-muted">Command Package</span>
                                <span className="text-white">{selectedPkg?.name || 'N/A'}</span>
                            </div>
                            {formData.player_id && (
                                <div className="flex justify-between items-center text-xs font-rajdhani font-black uppercase tracking-widest">
                                    <span className="text-muted">Coordinate ID</span>
                                    <span className="text-secondary">{formData.player_id}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-8 border-t border-border/50 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Base Rate</span>
                                <span className="text-xs font-orbitron font-black text-white line-through opacity-50">৳{selectedPkg?.sell_price || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Operative Discount</span>
                                <span className="text-xs font-orbitron font-black text-green">
                                    -৳{(selectedPkg?.sell_price - (selectedPkg?.price_reseller || selectedPkg?.sell_price)) || 0}
                                </span>
                            </div>
                            <div className="pt-4 flex justify-between items-baseline">
                                <span className="text-xs font-black text-white uppercase tracking-widest">TOTAL AUTHORIZATION</span>
                                <span className="text-3xl font-orbitron font-black text-secondary">৳{selectedPkg ? (selectedPkg.price_reseller || selectedPkg.sell_price) : 0}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-xl flex items-center gap-4 group">
                            <span className="text-2xl animate-pulse">🏷️</span>
                            <span className="font-rajdhani font-black text-[10px] text-secondary uppercase tracking-[0.2em]">
                                Operative Tier (Reseller) Active. You are saving maximum yield on this mission.
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

        </div>
    )
}
