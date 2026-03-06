'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Spinner from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'
import useToastStore from '@/store/toastStore'

export default function AdminCoupons() {
    const toast = useToastStore()
    const [coupons, setCoupons] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setModalOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const [form, setForm] = useState({
        code: '',
        type: 'percentage',
        value: 0,
        min_order: 0,
        max_discount: 0,
        usage_limit: 100,
        expiry_date: '',
        status: 'active'
    })

    const fetchCoupons = async () => {
        try {
            const { data } = await axios.get('/api/admin/coupons')
            setCoupons(data.coupons)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchCoupons() }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        setIsUpdating(true)
        try {
            await axios.post('/api/admin/coupons', form)
            toast.success(`Mission code ${form.code} generated.`)
            setModalOpen(false)
            fetchCoupons()
        } catch (err) {
            toast.error('Mission aborted: ' + (err.response?.data?.error || err.message))
        } finally {
            setIsUpdating(false)
        }
    }

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
        try {
            await axios.put(`/api/admin/coupons/${id}`, { status: newStatus })
            toast.success(`Mission code re-calibrated to ${newStatus}`)
            fetchCoupons()
        } catch (err) {
            toast.error('Abort: ' + (err.response?.data?.error || err.message))
        }
    }

    const deleteCoupon = async (id) => {
        if (!confirm('Dismantle this mission code?')) return
        try {
            await axios.delete(`/api/admin/coupons/${id}`)
            toast.success('Mission code dismantled.')
            fetchCoupons()
        } catch (err) {
            toast.error('Abort: ' + (err.response?.data?.error || err.message))
        }
    }

    return (
        <div className="space-y-8 animate-fade-in relative pb-20">

            {/* 1. Header Area */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-orbitron font-black text-3xl text-white tracking-[0.2em] uppercase italic">
                        MISSION <span className="text-accent">CODES</span>
                    </h1>
                    <p className="font-rajdhani font-black text-muted text-[10px] uppercase tracking-[0.5em] mt-2 opacity-60">
                        Active Promo Signals: {coupons.filter(c => c.status === 'active').length}
                    </p>
                </div>
                <button
                    onClick={() => { setForm({ type: 'percentage', value: 0, status: 'active' }); setModalOpen(true); }}
                    className="btn-primary px-8 py-3 text-[10px] font-black tracking-widest uppercase rounded-xl shadow-glow"
                >
                    GENERATE NEW CODE 🎁
                </button>
            </div>

            {/* 2. Stats Summary Card */}
            <div className="card p-6 bg-surface2/30 border-border/50 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center md:text-left border-r border-border/20 pr-4">
                    <p className="text-[8px] font-black text-muted tracking-widest uppercase mb-1 opacity-50">Signal Frequency</p>
                    <p className="font-orbitron font-black text-white text-md uppercase">ACTIVE: {coupons.filter(c => c.status === 'active').length}</p>
                </div>
                <div className="text-center md:text-left border-r border-border/20 pr-4">
                    <p className="text-[8px] font-black text-muted tracking-widest uppercase mb-1 opacity-50">Total Exhausted</p>
                    <p className="font-orbitron font-black text-white text-md uppercase">USED: {coupons.reduce((acc, c) => acc + (c.used_count || 0), 0)}</p>
                </div>
            </div>

            {/* 3. Coupons Registry Table */}
            <div className="card bg-surface/40 backdrop-blur-3xl border-border/80 overflow-hidden relative">
                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-96"><Spinner size="lg" /></div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="bg-surface2/80 font-rajdhani border-b border-border/50">
                                <tr>
                                    {['Code ID', 'Payload Type', 'Value', 'Limit/Usage', 'Expiry', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="p-5 font-black text-white text-[10px] uppercase tracking-widest opacity-60">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {coupons.map((c) => (
                                    <tr key={c._id} className="hover:bg-accent/5 transition-all group-item">
                                        <td className="p-5">
                                            <p className="font-mono font-black text-sm text-accent tracking-[0.3em] uppercase">{c.code}</p>
                                        </td>
                                        <td className="p-5 font-rajdhani font-black text-[10px] text-white uppercase tracking-widest opacity-60">{c.type}</td>
                                        <td className="p-5">
                                            <p className="font-orbitron font-black text-md text-success tracking-tighter">
                                                {c.type === 'percentage' ? `${c.value}%` : `৳${c.value}`}
                                            </p>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-orbitron font-black text-xs text-white opacity-80">{c.used_count || 0}</span>
                                                <span className="text-[8px] font-black text-muted uppercase">/ {c.usage_limit || '∞'}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <p className="font-rajdhani font-bold text-muted text-[10px] uppercase tracking-widest">
                                                {new Date(c.expiry_date).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border cursor-pointer ${c.status === 'active' ? 'border-success text-success bg-success/5 shadow-glow-green/20' : 'border-danger text-danger bg-danger/5 opacity-50'
                                                }`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => toggleStatus(c._id, c.status)}
                                                    className="btn-outline px-3 py-2 text-[8px] font-black tracking-widest uppercase border-border/50"
                                                >
                                                    {c.status === 'active' ? 'DE-ACTIVATE' : 'RE-SYNC'}
                                                </button>
                                                <button
                                                    onClick={() => deleteCoupon(c._id)}
                                                    className="btn-outline px-3 py-2 text-[8px] font-black tracking-widest uppercase border-danger/20 text-danger hover:bg-danger/5"
                                                >
                                                    DELETE
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* 4. Generation Modal */}
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    title="GENERATE MISSION CODE"
                >
                    <form onSubmit={handleSave} className="space-y-8 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* ID Configuration */}
                            <div className="space-y-6">
                                <h4 className="text-[9px] font-black text-muted tracking-[0.3em] uppercase opacity-40 ml-2">CODE TRANSMISSION ID</h4>
                                <div className="card p-6 bg-surface/50 border-border/50 space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Alpha-Numeric Code</label>
                                        <input
                                            value={form.code}
                                            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                            placeholder=" MISSION2025"
                                            className="input-field text-sm font-mono tracking-widest uppercase font-black"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Payload Type</label>
                                            <select
                                                value={form.type}
                                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                                className="input-field text-[10px] font-black uppercase tracking-widest bg-bg"
                                            >
                                                <option value="percentage">PERCENTAGE SIGNAL</option>
                                                <option value="fixed">FIXED CREDITS</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Value Signal</label>
                                            <input
                                                type="number"
                                                value={form.value}
                                                onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) })}
                                                className="input-field text-xs font-black"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Logic Configuration */}
                            <div className="space-y-6">
                                <h4 className="text-[9px] font-black text-muted tracking-[0.3em] uppercase opacity-40 ml-2">SECURITY PROTOCOLS</h4>
                                <div className="card p-6 bg-surface/50 border-border/50 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Usage Capacity</label>
                                            <input
                                                type="number"
                                                value={form.usage_limit}
                                                onChange={(e) => setForm({ ...form, usage_limit: parseInt(e.target.value) })}
                                                className="input-field text-xs font-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Signal Expiry</label>
                                            <input
                                                type="date"
                                                value={form.expiry_date}
                                                onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                                                className="input-field text-[10px] font-black bg-bg"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Minimum Signal Cargo</label>
                                            <input
                                                type="number"
                                                value={form.min_order}
                                                onChange={(e) => setForm({ ...form, min_order: parseFloat(e.target.value) })}
                                                className="input-field text-xs font-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-muted tracking-widest uppercase mb-2 block">Max Signal Discount</label>
                                            <input
                                                type="number"
                                                value={form.max_discount}
                                                onChange={(e) => setForm({ ...form, max_discount: parseFloat(e.target.value) })}
                                                className="input-field text-xs font-black"
                                                placeholder="100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="flex-1 h-14 btn-outline text-[10px] font-black tracking-widest uppercase rounded-xl border-border/50 hover:border-danger hover:text-danger"
                            >
                                ABORT SIGNAL GENERATION
                            </button>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="flex-[2] h-14 btn-primary text-[10px] font-black tracking-widest uppercase rounded-xl shadow-glow"
                            >
                                {isUpdating ? <Spinner size="sm" /> : 'BROADCAST MISSION CODE TO SYSTEM'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

        </div>
    )
}