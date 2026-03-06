'use client'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Spinner from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'
import useToastStore from '@/store/toastStore'

export default function AdminPackages() {
    const toast = useToastStore()
    const [games, setGames] = useState([])
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedGame, setSelectedGame] = useState('all')
    const [selectedPackage, setSelectedPackage] = useState(null)
    const [isModalOpen, setModalOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    // Package Form State for Live Calculation
    const [form, setForm] = useState({
        cost_price: 0,
        sell_price: 0,
        game_id: '',
        name: '',
        amount: '',
        smileone_sku: '',
        status: 'active',
        is_featured: false,
        is_popular: false
    })

    useEffect(() => {
        const init = async () => {
            try {
                const [gres, pres] = await Promise.all([
                    axios.get('/api/admin/games'),
                    axios.get('/api/admin/packages')
                ])
                setGames(gres.data.games)
                setPackages(pres.data.packages)
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [])

    const filteredPackages = useMemo(() => {
        if (selectedGame === 'all') return packages
        return packages.filter(p => p.game_id?._id === selectedGame || p.game_id === selectedGame)
    }, [selectedGame, packages])

    const profit = form.sell_price - form.cost_price
    const margin = form.sell_price > 0 ? (profit / form.sell_price) * 100 : 0

    const handleSave = async (e) => {
        e.preventDefault()
        setIsUpdating(true)
        try {
            if (selectedPackage?._id) {
                await axios.put(`/api/admin/packages/${selectedPackage._id}`, form)
                toast.success('Cargo recalibrated')
            } else {
                await axios.post('/api/admin/packages', form)
                toast.success('New cargo deployed')
            }
            setModalOpen(false)
            // Refresh packages
            const { data } = await axios.get('/api/admin/packages')
            setPackages(data.packages)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="space-y-8 animate-fade-in relative pb-20">

            {/* 1. Header Area */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-orbitron font-black text-3xl text-white tracking-[0.2em] uppercase italic">
                        CARGO <span className="text-accent">DASHBOARD</span>
                    </h1>
                    <p className="font-rajdhani font-black text-muted text-[10px] uppercase tracking-[0.5em] mt-2 opacity-60">
                        Active Payload SKUs: {packages.length}
                    </p>
                </div>
                <button
                    onClick={() => { setSelectedPackage(null); setForm({ cost_price: 0, sell_price: 0, status: 'active' }); setModalOpen(true); }}
                    className="btn-primary px-8 py-3 text-[10px] font-black tracking-widest uppercase rounded-xl"
                >
                    REGISTER NEW CARGO 📦
                </button>
            </div>

            {/* 2. Command Selector */}
            <div className="card p-4 bg-surface2/30 border-border/50 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 w-full relative">
                    <span className="text-[8px] font-black text-muted tracking-widest uppercase px-1 mb-2 block">Filter by Ecosystem Radar</span>
                    <select
                        value={selectedGame}
                        onChange={(e) => setSelectedGame(e.target.value)}
                        className="input-field h-12 text-[10px] font-black uppercase tracking-widest bg-bg cursor-pointer"
                    >
                        <option value="all">ALL FREQUENCIES (GLOBAL)</option>
                        {games.map(g => (
                            <option key={g._id} value={g._id}>{g.name.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 3. Operational Table */}
            <div className="card bg-surface/40 backdrop-blur-3xl border-border/80 overflow-hidden relative">
                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-96 gap-4">
                            <Spinner size="lg" className="text-accent" />
                            <p className="font-orbitron font-black text-muted text-[10px] uppercase animate-pulse">Acquiring Signals...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="bg-surface2/80 font-rajdhani border-b border-border/50">
                                <tr>
                                    {['Payload', 'Ecosystem', 'Sort', 'Cost', 'Sell', 'Reseller', 'Profit', 'Yield', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="p-5 font-black text-white text-[10px] uppercase tracking-widest opacity-60">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {filteredPackages.map((p) => {
                                    const p_profit = p.sell_price - p.cost_price
                                    const p_margin = (p_profit / p.sell_price) * 100
                                    return (
                                        <tr key={p._id} className="hover:bg-accent/5 transition-all group-item">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">💎</span>
                                                    <div>
                                                        <p className="font-orbitron font-black text-xs text-white uppercase tracking-widest">{p.name}</p>
                                                        <p className="text-[9px] text-accent font-bold uppercase tracking-widest">{p.amount} UNITS</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs">{p.game_id?.emoji || '🛸'}</span>
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-70">{p.game_id?.name || 'UNKNOWNBORG'}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 font-mono text-[10px] font-black text-accent tracking-widest uppercase">{p.sort_order || 0}</td>
                                            <td className="p-5 font-orbitron font-black text-xs text-white uppercase tracking-widest opacity-50">৳{p.cost_price}</td>
                                            <td className="p-5 font-orbitron font-black text-xs text-accent uppercase tracking-widest">৳{p.sell_price}</td>
                                            <td className="p-5 font-orbitron font-black text-xs text-secondary uppercase tracking-widest">৳{p.price_reseller || 'N/A'}</td>
                                            <td className={`p-5 font-orbitron font-black text-xs uppercase tracking-widest ${p_profit > 0 ? 'text-success' : 'text-danger'}`}>
                                                ৳{p_profit.toFixed(1)}
                                            </td>
                                            <td className="p-5">
                                                <span className={`text-[10px] font-black tracking-widest uppercase ${p_margin < 5 ? 'text-danger' : 'text-success'}`}>
                                                    {p_margin.toFixed(1)}% {p_margin < 5 ? '⚠️' : ''}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${p.status === 'active' ? 'border-success text-success bg-success/5' : 'border-danger text-danger bg-danger/5'}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <button
                                                    onClick={() => { setSelectedPackage(p); setForm(p); setModalOpen(true); }}
                                                    className="btn-outline px-4 py-2 text-[9px] font-black tracking-widest uppercase"
                                                >
                                                    RE-SYNC
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* 4. Cargo Modal */}
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    title={selectedPackage ? `CARGO RE-CALIBRATION: ${selectedPackage.name}` : 'REGISTER NEW DIAMOND CARGO'}
                >
                    <form onSubmit={handleSave} className="space-y-8 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* ID Section */}
                            <div className="space-y-6">
                                <h4 className="text-[9px] font-black text-muted tracking-[0.3em] uppercase opacity-40 ml-2">CARGO IDENTIFICATION</h4>
                                <div className="card p-6 bg-surface/50 border-border/50 space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Assigned Ecosystem</label>
                                        <select
                                            value={form.game_id?._id || form.game_id}
                                            onChange={(e) => setForm({ ...form, game_id: e.target.value })}
                                            required
                                            className="input-field text-[10px] font-black uppercase tracking-widest bg-bg"
                                        >
                                            <option value="">SELECT RADAR FREQUENCY</option>
                                            {games.map(g => <option key={g._id} value={g._id}>{g.name.toUpperCase()}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Cargo Name (Public)</label>
                                        <input
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })}
                                            placeholder="DIAMOND PACK... GOLD UC..."
                                            className="input-field text-xs font-black uppercase tracking-widest"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Resource Amount</label>
                                            <input
                                                value={form.amount}
                                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                                className="input-field text-xs font-black"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Smile.one SKU (API)</label>
                                            <input
                                                value={form.smileone_sku}
                                                onChange={(e) => setForm({ ...form, smileone_sku: e.target.value })}
                                                className="input-field text-xs font-mono tracking-widest"
                                                placeholder="123456"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financials Section */}
                            <div className="space-y-6">
                                <h4 className="text-[9px] font-black text-muted tracking-[0.3em] uppercase opacity-40 ml-2">FINANCIAL TELEMETRY</h4>
                                <div className="card p-6 bg-surface/50 border-border/50 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Logistics Cost (BDT)</label>
                                            <input
                                                type="number"
                                                value={form.cost_price}
                                                onChange={(e) => setForm({ ...form, cost_price: parseFloat(e.target.value) })}
                                                className="input-field text-xs font-black"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Public Sell Price (BDT)</label>
                                                <input
                                                    type="number"
                                                    value={form.sell_price}
                                                    onChange={(e) => setForm({ ...form, sell_price: parseFloat(e.target.value) })}
                                                    className="input-field text-xs font-black text-accent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Reseller Rate (BDT)</label>
                                                <input
                                                    type="number"
                                                    value={form.price_reseller}
                                                    onChange={(e) => setForm({ ...form, price_reseller: parseFloat(e.target.value) })}
                                                    className="input-field text-xs font-black text-secondary"
                                                    placeholder="Rate for VIPs"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* LIVE CALCULATOR BAR */}
                                    <div className="p-4 bg-bg rounded-xl border border-border/20 grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">PROFIT PER UNIT</p>
                                            <p className={`font-orbitron font-black text-sm tracking-widest ${profit > 0 ? 'text-success' : 'text-danger'}`}>
                                                ৳{profit.toFixed(1)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${margin < 5 ? 'text-danger animate-pulse' : 'text-muted'}`}>MARG_SIG {margin < 5 ? '⚠️' : ''}</p>
                                            <p className={`font-orbitron font-black text-sm tracking-widest ${margin < 5 ? 'text-danger' : 'text-success'}`}>
                                                {margin.toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Mission Tags</label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={form.is_popular}
                                                        onChange={(e) => setForm({ ...form, is_popular: e.target.checked })}
                                                        className="accent-gold h-4 w-4"
                                                    />
                                                    <span className="text-[9px] font-black text-gold uppercase tracking-[0.2em] group-hover:underline">POPULAR</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={form.is_featured}
                                                        onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                                                        className="accent-accent h-4 w-4"
                                                    />
                                                    <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em] group-hover:underline">FEATURED</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Sort Priority</label>
                                                <input
                                                    type="number"
                                                    value={form.sort_order}
                                                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) })}
                                                    className="input-field text-xs uppercase"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Mission Status</label>
                                                <select
                                                    value={form.status}
                                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                                    className="input-field text-[10px] font-black uppercase tracking-widest bg-bg font-rajdhani"
                                                >
                                                    <option value="active">OPERATIONAL</option>
                                                    <option value="hidden">CLOAKED (HIDDEN)</option>
                                                    <option value="out_of_stock">EXHAUSTED (OOS)</option>
                                                </select>
                                            </div>
                                        </div>
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
                                ABORT CARGO REGISTRATION
                            </button>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="flex-[2] h-14 btn-primary text-[10px] font-black tracking-widest uppercase rounded-xl shadow-glow"
                            >
                                {isUpdating ? <Spinner size="sm" /> : (selectedPackage ? 'RE-CALIBRATE CARGO PARAMETERS' : 'DEPLOY CARGO TO GLOBAL TERMINAL')}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

        </div>
    )
}