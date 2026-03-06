'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SavedIDsPanel({ savedIds, onAdd, onDelete, loading }) {
    const [showAdd, setShowAdd] = useState(false)
    const [newId, setNewId] = useState({ game_slug: '', player_id: '', nickname: '' })

    return (
        <div className="space-y-12 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="font-orbitron font-black text-3xl text-white tracking-widest italic uppercase">SECURE <span className="text-accent">CREDENTIALS</span></h2>
                    <p className="font-rajdhani font-black text-muted text-xs uppercase tracking-[0.4em] mt-2 opacity-60">High-Speed Terminal Access Storage</p>
                </div>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="btn-primary px-8 py-4 text-[10px] font-black tracking-widest uppercase rounded-xl"
                >
                    {showAdd ? 'ABORT DATA ENTRY' : 'REGISTER NEW TARGET 🛰️'}
                </button>
            </div>

            {showAdd && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="card p-8 bg-accent/5 border-accent/20"
                >
                    <form className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end" onSubmit={(e) => { e.preventDefault(); onAdd(newId); setShowAdd(false); }}>
                        <div className="md:col-span-1">
                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Radar Frequency (Game)</label>
                            <select
                                className="input-field h-12 text-[10px] font-black uppercase tracking-widest bg-bg"
                                value={newId.game_slug}
                                onChange={(e) => setNewId({ ...newId, game_slug: e.target.value })}
                                required
                            >
                                <option value="">SELECT WORLD...</option>
                                <option value="free-fire">FREE FIRE</option>
                                <option value="pubg-mobile">PUBG MOBILE</option>
                                <option value="mobile-legends">MOBILE LEGENDS</option>
                                <option value="valorant">VALORANT</option>
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Target ID (Player ID)</label>
                            <input
                                placeholder="ID CODE..."
                                className="input-field h-12 text-xs font-mono tracking-widest"
                                value={newId.player_id}
                                onChange={(e) => setNewId({ ...newId, player_id: e.target.value })}
                                required
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Cipher Alias (Nickname)</label>
                            <input
                                placeholder="ALIAS..."
                                className="input-field h-12 text-xs font-black uppercase tracking-widest"
                                value={newId.nickname}
                                onChange={(e) => setNewId({ ...newId, nickname: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <button type="submit" className="h-12 btn-primary text-[10px] font-black tracking-widest uppercase rounded-xl">SECURE DATA 🔒</button>
                    </form>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedIds?.length > 0 ? savedIds.map(sid => (
                    <div key={sid._id} className="card p-6 bg-surface/50 border-border/50 hover:border-accent/40 transition-all group relative overflow-hidden">
                        <div className="absolute top-[-10px] right-[-10px] text-6xl opacity-[0.03] group-hover:scale-110 transition-transform">🎯</div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-3xl">
                                {sid.game_slug === 'free-fire' ? '🔥' : sid.game_slug === 'pubg-mobile' ? '🪖' : sid.game_slug === 'valorant' ? '⚔️' : '🎮'}
                            </div>
                            <div>
                                <p className="font-orbitron font-black text-xs text-white uppercase tracking-widest">{sid.nickname || 'UNKNOWN OPERATIVE'}</p>
                                <p className="text-[8px] font-black text-muted uppercase tracking-[0.3em] opacity-60">WORLD: {sid.game_slug.replace('-', ' ')}</p>
                            </div>
                        </div>
                        <div className="bg-bg/50 border border-border/40 p-4 rounded-xl flex items-center justify-between mb-6">
                            <span className="text-[9px] font-black text-muted tracking-widest uppercase">Target ID:</span>
                            <span className="font-mono font-black text-sm text-accent tracking-[0.2em]">{sid.player_id}</span>
                        </div>
                        <div className="flex gap-3">
                            <Link href={`/games/${sid.game_slug}?id=${sid.player_id}`} className="flex-1 btn-primary py-3 text-[9px] font-black tracking-widest uppercase rounded-lg text-center">FAST RECHARGE</Link>
                            <button
                                onClick={() => onDelete(sid._id)}
                                className="w-12 h-12 btn-outline border-danger/20 text-danger hover:bg-danger/10 flex items-center justify-center rounded-lg"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="md:col-span-3 h-64 flex flex-col items-center justify-center text-center opacity-40 gap-4">
                        <span className="text-6xl">🛸</span>
                        <p className="font-orbitron font-black text-sm text-white uppercase tracking-[0.3em]">Credentials Registry Empty</p>
                    </div>
                )}
            </div>
        </div>
    )
}
