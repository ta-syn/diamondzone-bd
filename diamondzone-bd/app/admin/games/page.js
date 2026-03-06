'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Spinner from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'
import useToastStore from '@/store/toastStore'
import Link from 'next/link'

export default function AdminGames() {
    const toast = useToastStore()
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedGame, setSelectedGame] = useState(null)
    const [isModalOpen, setModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const fetchGames = async () => {
        try {
            const { data } = await axios.get('/api/admin/games')
            setGames(data.games)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchGames() }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        const formData = new FormData(e.target)
        const body = Object.fromEntries(formData.entries())

        // Convert comma-separated string to array for server_options
        if (body.server_options) {
            body.server_options = body.server_options.split(',').map(s => s.trim()).filter(s => s)
        }

        try {
            if (selectedGame?._id) {
                await axios.put(`/api/admin/games/${selectedGame._id}`, body)
                toast.success(`Ecosystem ${body.name} re-calibrated.`)
            } else {
                await axios.post('/api/admin/games', body)
                toast.success(`New ecosystem ${body.name} deployed.`)
            }
            setModalOpen(false)
            fetchGames()
        } catch (err) {
            toast.error('Mission aborted: ' + (err.response?.data?.error || err.message))
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-8 animate-fade-in relative">

            {/* 1. Header Area */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-orbitron font-black text-3xl text-white tracking-[0.2em] uppercase italic">
                        ECOSYSTEM <span className="text-accent">DASHBOARD</span>
                    </h1>
                    <p className="font-rajdhani font-black text-muted text-[10px] uppercase tracking-[0.5em] mt-2 opacity-60">
                        Total Worlds Detected: {games.length}
                    </p>
                </div>
                <button
                    onClick={() => { setSelectedGame(null); setModalOpen(true); }}
                    className="btn-primary px-8 py-3 text-[10px] font-black tracking-widest uppercase rounded-xl"
                >
                    DEPLOY NEW ECOSYSTEM 🛸
                </button>
            </div>

            {/* 2. Operational Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-64 card bg-surface2/30 animate-pulse border-border/50" />) : games.map((game) => (
                    <div key={game._id} className="card bg-surface2/30 border-border/50 overflow-hidden group hover:border-accent transition-all duration-500">
                        <div
                            className="h-32 flex items-center justify-center relative overflow-hidden"
                            style={{ background: `linear-gradient(135deg, ${game.gradient_from}, ${game.gradient_to})` }}
                        >
                            <span className="text-6xl filter drop-shadow-xl animate-float select-none">{game.emoji}</span>
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border transition-colors ${game.status === 'active' ? 'bg-success/10 border-success text-success' : 'bg-danger/10 border-danger text-danger'}`}>
                                    {game.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <h3 className="font-orbitron font-black text-sm text-white tracking-widest truncate uppercase italic">{game.name}</h3>
                                <span className="text-[10px] font-black text-accent tracking-tighter uppercase font-rajdhani">{game.currency_name}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-border/20 pt-4">
                                <div>
                                    <p className="text-[10px] font-black text-muted tracking-widest uppercase opacity-40">Orders</p>
                                    <p className="font-orbitron font-black text-sm text-white tracking-widest">{game.total_orders?.toLocaleString() || '12K+'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted tracking-widest uppercase opacity-40">SORT_ORD</p>
                                    <p className="font-orbitron font-black text-sm text-accent uppercase tracking-widest">{game.sort_order}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setSelectedGame(game); setModalOpen(true); }}
                                    className="flex-1 btn-outline py-2 text-[9px] font-black tracking-widest uppercase border-border/50 hover:border-accent"
                                >
                                    EDIT LOGS
                                </button>
                                <Link
                                    href={`/admin/packages?game=${game._id}`}
                                    className="flex items-center justify-center px-3 rounded-lg border border-border/50 hover:bg-gold/10 hover:border-gold transition-all"
                                >
                                    💎
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Deployment Modal */}
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    title={selectedGame ? `ECOSYSTEM RE-CALIBRATION: ${selectedGame.name}` : 'DEPLOY NEW ECOSYSTEM'}
                >
                    <form onSubmit={handleSave} className="space-y-8 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Visuals Column */}
                            <div className="space-y-6">
                                <h4 className="text-[9px] font-black text-muted tracking-[0.3em] uppercase opacity-40 ml-2">VISUAL TELEMETRY</h4>
                                <div className="card p-6 bg-surface/50 border-border/50 space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Mission Emoji</label>
                                        <input name="emoji" defaultValue={selectedGame?.emoji || '🎮'} className="input-field text-4xl text-center" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Gradient From</label>
                                            <input name="gradient_from" type="color" defaultValue={selectedGame?.gradient_from || '#00d4ff'} className="w-full h-12 bg-transparent border-none cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Gradient To</label>
                                            <input name="gradient_to" type="color" defaultValue={selectedGame?.gradient_to || '#ff6b35'} className="w-full h-12 bg-transparent border-none cursor-pointer" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Ecosystem Banner URL</label>
                                        <input name="image_url" defaultValue={selectedGame?.image_url} className="input-field text-xs uppercase" placeholder="HTTPS://IMAGE-HOST.COM/..." />
                                    </div>
                                </div>
                            </div>

                            {/* Logistics Column */}
                            <div className="space-y-6">
                                <h4 className="text-[9px] font-black text-muted tracking-[0.3em] uppercase opacity-40 ml-2">CORE PARAMETERS</h4>
                                <div className="card p-6 bg-surface/50 border-border/50 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Mission Name</label>
                                            <input name="name" defaultValue={selectedGame?.name} className="input-field text-xs font-black uppercase tracking-widest" required />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Protocol Slug</label>
                                            <input name="slug" defaultValue={selectedGame?.slug} className="input-field text-xs font-mono tracking-widest" required />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Currency Tag</label>
                                            <input name="currency_name" defaultValue={selectedGame?.currency_tag || selectedGame?.currency_name || 'DIAMONDS'} className="input-field text-xs font-black uppercase tracking-widest" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Sort Level</label>
                                            <input name="sort_order" type="number" defaultValue={selectedGame?.sort_order || 0} className="input-field text-xs" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Status Signal</label>
                                            <select name="status" defaultValue={selectedGame?.status || 'active'} className="input-field text-[10px] font-black uppercase tracking-widest">
                                                <option value="active">ACTIVE SIGNAL</option>
                                                <option value="hidden">HIDDEN CLOAK</option>
                                                <option value="maintenance">MAINTENANCE</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">API (Smile Product ID)</label>
                                            <input name="smileone_product_id" defaultValue={selectedGame?.smileone_product_id} className="input-field text-xs font-mono tracking-widest" placeholder="E.G. FREEFIRE" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Regional Server Hubs (Comma separated)</label>
                                        <input name="server_options" defaultValue={selectedGame?.server_options?.join(', ')} className="input-field text-xs uppercase" placeholder="SEA, GLOBAL, BD..." />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Smile Region</label>
                                            <input name="smileone_region" defaultValue={selectedGame?.smileone_region || 'ID'} className="input-field text-xs uppercase" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">ID Label</label>
                                            <input name="player_id_label" defaultValue={selectedGame?.player_id_label || 'Player ID'} className="input-field text-xs uppercase" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">ID Hint</label>
                                        <input name="player_id_hint" defaultValue={selectedGame?.player_id_hint} className="input-field text-xs uppercase" />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">ID Validation Regex</label>
                                        <input name="player_id_regex" defaultValue={selectedGame?.player_id_regex} className="input-field text-xs font-mono" placeholder="^\d{6,12}$" />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="flex-1 h-14 btn-outline text-[10px] font-black tracking-widest uppercase rounded-xl border-border/50"
                            >
                                ABORT DEPLOYMENT
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-[2] h-14 btn-primary text-[10px] font-black tracking-widest uppercase rounded-xl shadow-glow"
                            >
                                {isSaving ? <Spinner size="sm" /> : (selectedGame ? 'APPLY MISSION CALIBRATION' : 'DEPLOY ECOSYSTEM TO GLOBAL RADAR')}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

        </div>
    )
}