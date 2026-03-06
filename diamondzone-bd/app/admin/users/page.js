'use client'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Spinner from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'
import useToastStore from '@/store/toastStore'

export default function AdminUsers() {
    const toast = useToastStore()
    const [users, setUsers] = useState([])
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 })
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState(null)
    const [isModalOpen, setModalOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const [filters, setFilters] = useState({
        search: '',
        role: 'all',
        page: 1
    })

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const { search, role, page } = filters
            const { data } = await axios.get(`/api/admin/users?search=${search}&role=${role}&page=${page}`)
            setUsers(data.users)
            setPagination(data.pagination)
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    const handleUpdate = async (id, body) => {
        setIsUpdating(true)
        try {
            await axios.put(`/api/admin/users/${id}`, body)
            toast.success('User protocol updated.')
            fetchUsers()
            setModalOpen(false)
        } catch (err) {
            toast.error('Abort: ' + (err.response?.data?.error || err.message))
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
                        OPERATIVE <span className="text-accent">DIRECTORIES</span>
                    </h1>
                    <p className="font-rajdhani font-black text-muted text-[10px] uppercase tracking-[0.5em] mt-2 opacity-60">
                        Active Intelligence Assets: {pagination.total.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* 2. Search & Filter Bar */}
            <div className="card p-6 bg-surface2/30 border-border/50 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <p className="text-[8px] font-black text-muted tracking-widest uppercase mb-2 px-1">Signal Source: Operative Name / Email / Phone</p>
                    <input
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                        placeholder="LOCATE OPERATIVE..."
                        className="input-field h-12 text-[10px] font-mono tracking-widest"
                    />
                </div>
                <div>
                    <p className="text-[8px] font-black text-muted tracking-widest uppercase mb-2 px-1">Clearance Level</p>
                    <select
                        value={filters.role}
                        onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value, page: 1 }))}
                        className="input-field h-12 text-[10px] font-black uppercase tracking-widest bg-bg cursor-pointer"
                    >
                        <option value="all">ALL CLEARANCES</option>
                        <option value="user">USER (GAMER)</option>
                        <option value="reseller">RESELLER PRO</option>
                        <option value="admin">ADMIN CONTROL</option>
                    </select>
                </div>
            </div>

            {/* 3. Operative Registry Table */}
            <div className="card bg-surface/40 backdrop-blur-3xl border-border/80 overflow-hidden relative">
                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-96 gap-4">
                            <Spinner size="lg" className="text-accent" />
                            <p className="font-orbitron font-black text-muted text-[10px] uppercase animate-pulse">Scanning Bio-Signatures...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="bg-surface2/80 font-rajdhani border-b border-border/50">
                                <tr>
                                    {['Bio-Signature', 'Clearance', 'Wallet Reserve', 'Orders', 'Joined Date', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="p-5 font-black text-white text-[10px] uppercase tracking-widest opacity-60">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-accent/5 transition-all group-item">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-orbitron font-black text-accent text-xs">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-rajdhani font-black text-sm text-white uppercase tracking-widest">{u.name}</p>
                                                    <p className="text-[10px] text-muted font-bold tracking-tighter opacity-50 uppercase">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-[0.2em] border ${u.role === 'admin' ? 'border-danger text-danger bg-danger/5' : u.role === 'reseller' ? 'border-gold text-gold bg-gold/5' : 'border-accent text-accent bg-accent/5'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-5 font-orbitron font-black text-xs text-success tracking-tighter">৳{u.wallet_balance.toFixed(1)}</td>
                                        <td className="p-5 font-orbitron font-black text-xs text-white opacity-50">#0</td>
                                        <td className="p-5 font-rajdhani font-bold text-muted text-[10px] uppercase tracking-widest">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-5">
                                            {u.is_banned ? (
                                                <span className="text-[10px] font-black text-danger uppercase tracking-widest animate-pulse">🛑 TERMINATED</span>
                                            ) : (
                                                <span className="text-[10px] font-black text-success uppercase tracking-widest opacity-50">🛡️ SECURE</span>
                                            )}
                                        </td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={() => { setSelectedUser(u); setModalOpen(true); }}
                                                className="btn-outline px-4 py-2 text-[9px] font-black tracking-widest uppercase"
                                            >
                                                PROTOCOL LOCK
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* 4. Protocol Lock Modal */}
            {isModalOpen && selectedUser && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    title={`OPERATIVE PROTOCOL: ${selectedUser.name}`}
                >
                    <div className="space-y-8 pb-4">
                        <div className="card p-6 border-accent/20 bg-accent/5 flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-surface2 border-4 border-accent flex items-center justify-center font-orbitron font-black text-3xl text-accent shadow-glow">
                                {selectedUser.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-orbitron font-black text-white text-lg tracking-widest uppercase">{selectedUser.name}</h3>
                                <p className="text-xs font-mono text-muted uppercase tracking-widest opacity-80">{selectedUser.email}</p>
                                <p className="text-[9px] font-black text-accent uppercase tracking-[0.5em] mt-2">ID: {selectedUser._id}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[9px] font-black text-muted tracking-[0.3em] uppercase opacity-40 ml-2">CLEARANCE & RESELLER PROTOCOL</h4>
                                <div className="card p-6 bg-surface/50 border-border/50 space-y-6">
                                    <div>
                                        <p className="text-[8px] font-black text-muted tracking-widest uppercase mb-2 px-1">Clearance Level</p>
                                        <select
                                            defaultValue={selectedUser.role}
                                            onChange={(e) => handleUpdate(selectedUser._id, { role: e.target.value })}
                                            className="input-field h-12 text-[10px] font-black uppercase tracking-widest bg-bg cursor-pointer"
                                        >
                                            <option value="user">USER (GAMER ALPHA)</option>
                                            <option value="reseller">RESELLER PRO</option>
                                            <option value="admin">GLOBAL ADMINISTRATOR</option>
                                        </select>
                                    </div>

                                    {selectedUser.role === 'reseller' && (
                                        <div className="space-y-4 pt-4 border-t border-border/20">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Reseller Approved</span>
                                                <button
                                                    onClick={() => handleUpdate(selectedUser._id, { reseller_approved: !selectedUser.reseller_approved })}
                                                    className={`px-4 py-2 rounded text-[9px] font-black uppercase tracking-widest border ${selectedUser.reseller_approved ? 'border-success text-success bg-success/5' : 'border-danger text-danger bg-danger/5'}`}
                                                >
                                                    {selectedUser.reseller_approved ? 'ACTIVE' : 'INACTIVE'}
                                                </button>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-muted tracking-widest uppercase mb-2 px-1">Credit Limit (৳)</p>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        defaultValue={selectedUser.reseller_credit_limit}
                                                        onBlur={(e) => handleUpdate(selectedUser._id, { reseller_credit_limit: parseFloat(e.target.value) })}
                                                        className="input-field h-10 text-[10px] font-mono tracking-widest bg-bg flex-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[9px] font-black text-muted tracking-[0.3em] uppercase opacity-40 ml-2">SECURITY PROTOCOL</h4>
                                <div className="card p-6 bg-surface/50 border-border/50 space-y-6">
                                    {selectedUser.is_banned ? (
                                        <button
                                            onClick={() => handleUpdate(selectedUser._id, { is_banned: false })}
                                            disabled={isUpdating}
                                            className="w-full h-12 btn-primary bg-success border-success text-bg text-[10px] font-black tracking-widest uppercase"
                                        >
                                            {isUpdating ? <Spinner size="sm" /> : 'RE-INITIALIZE ACCOUNT (UNBAN)'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleUpdate(selectedUser._id, { is_banned: true, ban_reason: 'Administrative decision.' })}
                                            disabled={isUpdating}
                                            className="w-full h-12 btn-primary bg-danger border-danger text-bg text-[10px] font-black tracking-widest uppercase shadow-glow-orange"
                                        >
                                            {isUpdating ? <Spinner size="sm" /> : 'TERMINATE SESSION (BAN)'}
                                        </button>
                                    )}
                                    <p className="text-[8px] font-bold text-muted uppercase tracking-tighter text-center opacity-50 italic">
                                        Session termination blocks all global radar access.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

        </div>
    )
}