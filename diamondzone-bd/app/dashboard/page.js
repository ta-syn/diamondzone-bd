'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '@/store/authStore'
import Spinner from '@/components/ui/Spinner'
import axios from 'axios'
import useToastStore from '@/store/toastStore'
import Link from 'next/link'

import OverviewPanel from '@/components/dashboard/OverviewPanel'
import OrdersPanel from '@/components/dashboard/OrdersPanel'
import WalletPanel from '@/components/dashboard/WalletPanel'
import ReferralPanel from '@/components/dashboard/ReferralPanel'
import SavedIDsPanel from '@/components/dashboard/SavedIDsPanel'
import SettingsPanel from '@/components/dashboard/SettingsPanel'

import DashboardTabs from '@/components/dashboard/DashboardTabs'

// --- MAIN DASHBOARD ---

export default function UserDashboard() {
    const toast = useToastStore()
    const router = useRouter()
    const searchParams = useSearchParams()
    const activeTab = searchParams.get('tab') || 'overview'
    const { user, loading: authLoading, setUser } = useAuthStore()

    const [data, setData] = useState({ orders: [], transactions: [], savedIds: [], stats: {} })
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState('all')
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        if (!authLoading && !user) router.push('/auth/login?redirect=/dashboard')
    }, [user, authLoading, router])

    const fetchData = async () => {
        if (!user) return
        setLoading(true)
        try {
            if (activeTab === 'overview') {
                const [statsRes, idsRes] = await Promise.all([
                    axios.get('/api/user/dashboard-stats'),
                    axios.get('/api/user/saved-ids')
                ])
                setData(prev => ({
                    ...prev,
                    stats: statsRes.data.stats,
                    savedIds: idsRes.data.saved_player_ids
                }))
            } else if (activeTab === 'orders') {
                const { data: res } = await axios.get(`/api/user/orders?page=${page}&status=${status}`)
                setData(prev => ({ ...prev, orders: res.orders, pagination: res.pagination }))
            } else if (activeTab === 'wallet') {
                const { data: res } = await axios.get(`/api/user/transactions?page=${page}`)
                setData(prev => ({ ...prev, transactions: res.transactions, pagination: res.pagination }))
            } else if (activeTab === 'saved-ids') {
                const { data: res } = await axios.get('/api/user/saved-ids')
                setData(prev => ({ ...prev, savedIds: res.saved_player_ids }))
            }
            // 'settings' tab requires no additional API fetch. Data is retrieved statically via authStore.
        } catch (err) {
            const status = err.response?.status
            if (status === 401) {
                toast.error('Mission Terminated: Session Expired')
                router.push('/auth/login')
            } else if (status === 429) {
                toast.error('Tactical Overload: Too many requests. Stand by.')
            } else {
                console.error("Dashboard Fetch Error:", err)
                toast.error('System Glitch: Uplink failed. Check your coordinates.')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [user, activeTab, page, status])

    const handleDeposit = async (amount) => {
        setActionLoading(true)
        try {
            const { data } = await axios.post('/api/user/wallet/deposit', { amount })
            if (data.url) window.location.href = data.url
        } catch (err) {
            toast.error(err.response?.data?.error || 'Deposit Failed')
            setActionLoading(false)
        }
    }

    const handleAddId = async (idBody) => {
        try {
            await axios.post('/api/user/saved-ids', idBody)
            toast.success('Coordinates Saved')
            fetchData()
        } catch (err) {
            toast.error(err.response?.data?.error || 'Save Failed')
        }
    }

    const handleDeleteId = async (id) => {
        try {
            await axios.delete(`/api/user/saved-ids?id=${id}`)
            toast.success('Coordinates Purged')
            fetchData()
        } catch (err) {
            toast.error('Purge Failed')
        }
    }

    if (authLoading || (!user && loading)) return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6">
            <Spinner size="lg" className="text-accent" />
            <p className="font-orbitron text-[10px] tracking-[0.5em] text-muted uppercase animate-pulse">Syncing Pilot Profile...</p>
        </div>
    )

    const tabs = [
        { id: 'overview', label: 'OVERVIEW', icon: '📡' },
        { id: 'orders', label: 'ORDERS', icon: '📦' },
        { id: 'wallet', label: 'WALLET', icon: '💰' },
        { id: 'referral', label: 'REFERRAL', icon: '🧬' },
        { id: 'saved-ids', label: 'SAVED IDS', icon: '🔒' },
        { id: 'settings', label: 'SETTINGS', icon: '⚙️' },
    ]

    return (
        <div className="min-h-screen bg-bg pt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Tab Navigation */}
                <DashboardTabs
                    activeTab={activeTab}
                    tabs={tabs}
                    setPage={setPage}
                />


                {/* Tab Content */}
                <div className="min-h-[600px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-96 gap-6 opacity-50">
                            <Spinner className="text-accent" />
                            <p className="font-orbitron text-[10px] tracking-widest text-muted uppercase">Scanning Databases...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'overview' && <OverviewPanel user={user} stats={data.stats} />}
                            {activeTab === 'orders' && <OrdersPanel orders={data.orders} pagination={data.pagination} setPage={setPage} setStatus={setStatus} currentStatus={status} />}
                            {activeTab === 'wallet' && <WalletPanel user={user} transactions={data.transactions} onDeposit={handleDeposit} loading={actionLoading} />}
                            {activeTab === 'referral' && <ReferralPanel user={user} />}
                            {activeTab === 'saved-ids' && <SavedIDsPanel savedIds={data.savedIds} onAdd={handleAddId} onDelete={handleDeleteId} loading={actionLoading} />}
                            {activeTab === 'settings' && <SettingsPanel user={user} />}
                        </>
                    )}
                </div>

            </div>

            {/* Background Decor */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-accent/5 rounded-full blur-[200px] -z-10 pointer-events-none" />
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
        </div>
    )
}