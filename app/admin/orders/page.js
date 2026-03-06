'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import Spinner from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'
import { motion, AnimatePresence } from 'framer-motion'
import useToastStore from '@/store/toastStore'

import AdminOrdersTable from '@/components/admin/AdminOrdersTable'

export default function AdminOrders() {
    const toast = useToastStore()
    const [orders, setOrders] = useState([])
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 })
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setModalOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    // Filters
    const [filters, setFilters] = useState({
        status: 'all',
        game: 'all',
        search: '',
        page: 1
    })

    const fetchOrders = useCallback(async () => {
        setLoading(true)
        try {
            const { status, game, search, page } = filters
            const { data } = await axios.get(`/api/admin/orders?status=${status}&game=${game}&search=${search}&page=${page}`)
            setOrders(data.orders)
            setPagination(data.pagination)
        } catch (err) {
            toast.error('Signal acquisition failed: ' + (err.response?.data?.error || err.message))
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

    const handleStatusChange = async (id, newStatus) => {
        setIsUpdating(true)
        try {
            await axios.put(`/api/admin/orders/${id}`, { status: newStatus })
            toast.success(`Mission ${id} re-calibrated to ${newStatus}`)
            fetchOrders()
            if (selectedOrder?._id === id) setModalOpen(false)
        } catch (err) {
            toast.error('Mission update abort: ' + (err.response?.data?.error || err.message))
        } finally {
            setIsUpdating(false)
        }
    }

    const exportCSV = () => {
        if (!orders.length) return
        const headers = ['Order ID', 'Player ID', 'Game', 'Package', 'Amount', 'Status', 'Date']
        const csvContent = [
            headers.join(','),
            ...orders.map(o => [
                o.order_id, o.player_id, o.game_name, o.package_name, o.amount_paid, o.status, new Date(o.createdAt).toLocaleString()
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `DiamondZone_Orders_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    return (
        <div className="space-y-8 animate-fade-in relative pb-20">

            {/* 1. Page Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-orbitron font-black text-3xl text-white tracking-[0.2em] uppercase italic">
                        MISSION <span className="text-accent">REGISTRY</span>
                    </h1>
                    <p className="font-rajdhani font-black text-muted text-[10px] uppercase tracking-[0.5em] mt-2 opacity-60">
                        Total Operations Detected: {pagination.total.toLocaleString()}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={exportCSV}
                        className="btn-outline px-6 py-3 text-[10px] font-black tracking-widest uppercase border-accent/30 text-accent hover:bg-accent/5"
                    >
                        DOWNLOAD DATA CSV 📡
                    </button>
                </div>
            </div>

            {/* 2. Command filters */}
            <div className="card p-6 bg-surface2/30 border-border/50 grid grid-cols-1 md:grid-cols-4 gap-4 pb-8">
                <div className="relative group">
                    <p className="text-[8px] font-black text-muted tracking-widest uppercase mb-2 px-1">Search ID/Player/Email</p>
                    <input
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value.toUpperCase(), page: 1 }))}
                        placeholder="ENTER MISSION CODE..."
                        className="input-field h-12 text-[10px] font-mono tracking-widest group-focus-within:border-accent"
                    />
                </div>
                <div>
                    <p className="text-[8px] font-black text-muted tracking-widest uppercase mb-2 px-1">Protocol Filtering</p>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                        className="input-field h-12 text-[10px] font-black uppercase tracking-widest cursor-pointer bg-bg"
                    >
                        <option value="all">ALL PROTOCOLS</option>
                        <option value="pending">PENDING</option>
                        <option value="processing">PROCESSING</option>
                        <option value="completed">COMPLETED</option>
                        <option value="cancelled">CANCELLED</option>
                        <option value="refunded">REFUNDED</option>
                    </select>
                </div>
                <div>
                    <p className="text-[8px] font-black text-muted tracking-widest uppercase mb-2 px-1">Ecosystem Filter</p>
                    <select
                        value={filters.game}
                        onChange={(e) => setFilters(prev => ({ ...prev, game: e.target.value, page: 1 }))}
                        className="input-field h-12 text-[10px] font-black uppercase tracking-widest cursor-pointer bg-bg"
                    >
                        <option value="all">ALL ECOSYSTEMS</option>
                        {/* This would be populated from game list API */}
                        <option value="free-fire">FREE FIRE</option>
                        <option value="pubg-mobile">PUBG MOBILE</option>
                        <option value="mobile-legends">MOBILE LEGENDS</option>
                        <option value="valorant">VALORANT</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={() => setFilters({ status: 'all', game: 'all', search: '', page: 1 })}
                        className="w-full h-12 btn-outline text-[10px] font-black tracking-widest opacity-60 hover:opacity-100"
                    >
                        RESET SIGNALS
                    </button>
                </div>
            </div>

            {/* 3. Operational Table */}
            <div className="card bg-surface/40 backdrop-blur-3xl border-border/80 overflow-hidden relative">
                <div className="overflow-x-auto min-h-[400px]">
                    <AdminOrdersTable
                        orders={orders}
                        loading={loading}
                        isUpdating={isUpdating}
                        onViewDetail={(o) => { setSelectedOrder(o); setModalOpen(true); }}
                        onStatusChange={handleStatusChange}
                    />
                </div>


                {/* 4. Pagination Dashboard */}
                <div className="p-6 bg-surface2/50 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-[10px] font-black text-muted uppercase tracking-widest opacity-50">
                        Showing {orders.length} of {pagination.total} Missions
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            disabled={filters.page === 1}
                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                            className="w-10 h-10 flex items-center justify-center border border-border rounded-xl font-black text-white disabled:opacity-30 hover:border-accent transition-colors"
                        >
                            ←
                        </button>

                        <div className="flex gap-2">
                            {[...Array(Math.min(5, pagination.pages))].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                                    className={`w-10 h-10 border rounded-xl font-orbitron font-black text-xs transition-all ${filters.page === i + 1 ? 'bg-accent border-accent text-bg shadow-glow' : 'border-border text-white hover:border-accent'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            {pagination.pages > 5 && <span className="p-2 opacity-50">...</span>}
                        </div>

                        <button
                            disabled={filters.page === pagination.pages}
                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                            className="w-10 h-10 flex items-center justify-center border border-border rounded-xl font-black text-white disabled:opacity-30 hover:border-accent transition-colors"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>

            {/* 5. Mission Detail Modal */}
            <AnimatePresence>
                {isModalOpen && selectedOrder && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        title={`MISSION LOG: ${selectedOrder.order_id}`}
                    >
                        <div className="space-y-8 pb-4">

                            {/* STATUS BAR */}
                            <div className="card p-6 border-accent/20 bg-accent/5 flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl animate-pulse">🛰️</span>
                                    <div>
                                        <h3 className="font-orbitron font-black text-white text-sm tracking-widest uppercase mb-1">CURRENT STATUS: <span className="text-accent">{selectedOrder.status.toUpperCase()}</span></h3>
                                        <p className="text-[8px] font-black text-muted uppercase tracking-[0.2em] font-rajdhani">MISSION CODE SIGMA-9 VERIFIED</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={async () => {
                                            setIsUpdating(true)
                                            try {
                                                const { data } = await axios.post(`/api/admin/orders/${selectedOrder._id}/re-verify`)
                                                toast.success(data.message)
                                                fetchOrders()
                                            } catch (err) {
                                                toast.error(err.response?.data?.error || 'Sync Failed')
                                            } finally {
                                                setIsUpdating(false)
                                            }
                                        }}
                                        disabled={isUpdating}
                                        className="bg-accent/20 border border-accent/40 text-accent px-4 py-2 font-black text-[9px] tracking-widest uppercase rounded-lg hover:bg-accent/30 transition-all disabled:opacity-50"
                                    >
                                        {isUpdating ? <Spinner size="sm" /> : 'SYNC API SIGNAL 🛰️'}
                                    </button>
                                    {selectedOrder.status !== 'completed' && (
                                        <button
                                            onClick={() => handleStatusChange(selectedOrder._id, 'completed')}
                                            disabled={isUpdating}
                                            className="bg-success text-bg px-4 py-2 font-black text-[9px] tracking-widest uppercase rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
                                        >
                                            {isUpdating ? <Spinner size="sm" /> : 'FORCE COMPLETE'}
                                        </button>
                                    )}
                                    {selectedOrder.status !== 'refunded' && selectedOrder.user_id && (
                                        <button
                                            onClick={() => handleStatusChange(selectedOrder._id, 'refunded')}
                                            disabled={isUpdating}
                                            className="bg-danger text-bg px-4 py-2 font-black text-[9px] tracking-widest uppercase rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
                                        >
                                            {isUpdating ? <Spinner size="sm" /> : 'ABORT & REFUND'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Credentials */}
                                <div className="space-y-4">
                                    <h4 className="text-[9px] font-black text-muted tracking-[0.3em] uppercase opacity-40 ml-2">CARGO INFORMATION</h4>
                                    <div className="bg-surface/50 border border-border/50 rounded-2xl p-6 space-y-4 divide-y divide-border/20">
                                        <div className="flex justify-between py-2">
                                            <span className="text-[10px] font-black text-muted uppercase">Ecosystem</span>
                                            <span className="text-xs font-rajdhani font-black text-white tracking-widest uppercase">{selectedOrder.game_name}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-[10px] font-black text-muted uppercase">Payload Package</span>
                                            <span className="text-xs font-rajdhani font-black text-white tracking-widest uppercase">{selectedOrder.package_name}</span>
                                        </div>
                                        <div className="flex justify-between py-2 items-center">
                                            <span className="text-[10px] font-black text-muted uppercase">Target ID</span>
                                            <span className="font-mono font-black text-md text-accent tracking-[0.2em] uppercase bg-accent/5 px-3 py-1 rounded-lg border border-accent/20">{selectedOrder.player_id}</span>
                                        </div>
                                        {selectedOrder.server && (
                                            <div className="flex justify-between py-2">
                                                <span className="text-[10px] font-black text-muted uppercase">Signal Server</span>
                                                <span className="text-xs font-orbitron font-black text-white uppercase">{selectedOrder.server}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Logistics */}
                                <div className="space-y-4">
                                    <h4 className="text-[9px] font-black text-muted tracking-[0.3em] uppercase opacity-40 ml-2">FINANCIAL LOGISTICS</h4>
                                    <div className="bg-surface/50 border border-border/50 rounded-2xl p-6 space-y-4 divide-y divide-border/20">
                                        <div className="flex justify-between py-2">
                                            <span className="text-[10px] font-black text-muted uppercase">Transaction Method</span>
                                            <span className="text-xs font-rajdhani font-black text-white tracking-widest uppercase">{selectedOrder.payment_method}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-[10px] font-black text-muted uppercase">Credits Paid</span>
                                            <span className="text-lg font-orbitron font-black text-success tracking-tighter">৳{selectedOrder.amount_paid}</span>
                                        </div>
                                    </div>

                                    {/* ADMIN NOTE */}
                                    <div className="space-y-4 pt-4">
                                        <h4 className="text-[9px] font-black text-muted tracking-[0.3em] uppercase opacity-40 ml-2">ADMINISTRATIVE LOGS</h4>
                                        <textarea
                                            placeholder="ENTER SECURE NOTE FOR SYSTEM..."
                                            className="w-full h-24 input-field p-4 text-xs font-rajdhani font-black tracking-widest bg-bg/50 resize-none border-border/50 group-focus:border-accent transition-all"
                                            defaultValue={selectedOrder.admin_note || ''}
                                            onBlur={(e) => axios.put(`/api/admin/orders/${selectedOrder._id}`, { admin_note: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="space-y-4">
                                <h4 className="text-[9px] font-black text-muted tracking-[0.3em] uppercase opacity-40 ml-2">STATUS TELEMETRY</h4>
                                <div className="space-y-3">
                                    {selectedOrder.status_history.map((hist, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 border border-border/20 bg-surface/30 rounded-xl relative group overflow-hidden">
                                            <div className="absolute top-0 left-0 h-full w-[2px] bg-accent/20 group-hover:bg-accent transition-colors" />
                                            <div className="text-[10px] font-black font-rajdhani text-accent uppercase tracking-widest w-24 shrink-0 opacity-60">
                                                {hist.status}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-rajdhani font-black text-white tracking-widest uppercase mb-1">{hist.note || 'Signal event recorded.'}</p>
                                                <p className="text-[9px] font-bold text-muted font-rajdhani tracking-tighter opacity-40 uppercase">
                                                    Timestamp: {new Date(hist.changed_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </Modal>
                )}
            </AnimatePresence>

        </div>
    )
}