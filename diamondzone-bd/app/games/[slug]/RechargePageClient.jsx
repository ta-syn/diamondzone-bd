'use client'
import { useState, useEffect } from 'react'
import PackageSelector from '@/components/recharge/PackageSelector'
import PlayerIdForm from '@/components/recharge/PlayerIdForm'
import CouponInput from '@/components/recharge/CouponInput'
import OrderSummary from '@/components/recharge/OrderSummary'
import useAuthStore from '@/store/authStore'
import useToastStore from '@/store/toastStore'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Spinner from '@/components/ui/Spinner'

export default function RechargePageClient({ game, packages }) {
    const router = useRouter()
    const { user } = useAuthStore()
    const toast = useToastStore()

    // State
    const [selectedPackage, setSelectedPackage] = useState(
        packages.find(p => p.is_popular) || packages[0]
    )
    const [playerData, setPlayerData] = useState({
        player_id: '',
        server: game.server_options?.length > 1 ? '' : (game.server_options[0] || ''),
        email: user?.email || '',
        phone: user?.phone || '',
    })
    const [couponData, setCouponData] = useState({
        code: '',
        discount: 0,
        is_valid: false,
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [debouncedPlayerId, setDebouncedPlayerId] = useState('')

    // 1. Debounce Player ID (300ms delay)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedPlayerId(playerData.player_id)
        }, 300)
        return () => clearTimeout(timer)
    }, [playerData.player_id])

    // Handlers
    const handlePlayerDataChange = (field, value) => {
        setPlayerData(prev => ({ ...prev, [field]: value }))
    }

    const handlePackageSelect = (pkg) => {
        setSelectedPackage(pkg)
        // Clear coupon if now invalid for new amount
        if (couponData.is_valid) {
            setCouponData({ code: '', discount: 0, is_valid: false, message: '' })
        }
    }

    const handleSubmit = async (paymentMethod) => {
        if (!playerData.player_id) return toast.error(`Please enter your ${game.player_id_label}`)
        if (game.server_options?.length > 1 && !playerData.server) return toast.error('Please select a server')
        if (!playerData.email) return toast.error('Email is required for receipt')

        setIsSubmitting(true)
        try {
            const payload = {
                game_id: game._id,
                package_id: selectedPackage._id,
                player_id: playerData.player_id,
                server: playerData.server,
                email: playerData.email,
                phone: playerData.phone,
                payment_method: paymentMethod,
                coupon_code: couponData.code || null
            }

            const { data } = await axios.post('/api/payment/initiate', payload)

            if (data.url) { // Fixed from gatewayUrl to url based on API route response
                window.location.href = data.url
            } else if (data.order_id) { // Fixed from orderId to order_id
                router.push(`/track?order_id=${data.order_id}`)
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Recharge failed. Try again.')
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen pb-24 pt-10">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div
                    className="relative rounded-2xl overflow-hidden mb-10 h-32 md:h-48 group shadow-glow animate-fade-in"
                    style={{ background: `linear-gradient(135deg, ${game.gradient_from}, ${game.gradient_to})` }}
                >
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-grid opacity-10" />

                    <div className="relative h-full flex items-center px-10 gap-8 z-10 transition-transform duration-500 group-hover:scale-105">
                        <span className="text-6xl md:text-8xl filter drop-shadow-xl animate-float">
                            {game.emoji}
                        </span>
                        <div className="space-y-1">
                            <h1 className="font-orbitron font-black text-3xl md:text-5xl text-white tracking-widest uppercase italic filter drop-shadow-lg">
                                {game.name}
                            </h1>
                            <div className="flex gap-4">
                                <span className="bg-white/10 border border-white/20 text-white text-[10px] md:text-xs font-black px-4 py-1 rounded-full backdrop-blur-md uppercase tracking-widest leading-none">
                                    Instant Delivery
                                </span>
                                <span className="bg-accent2/20 border border-accent2/30 text-accent2 text-[10px] md:text-xs font-black px-4 py-1 rounded-full backdrop-blur-md uppercase tracking-widest leading-none shadow-glow-orange">
                                    {game.currency_name} Top-Up
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TWO COLUMN CONTENT */}
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* LEFT: FORM STEPS */}
                    <div className="flex-1 space-y-2 animate-slide-up">
                        <PackageSelector
                            packages={packages}
                            selectedPackage={selectedPackage}
                            onSelect={handlePackageSelect}
                        />

                        <PlayerIdForm
                            game={game}
                            playerData={playerData}
                            onChange={handlePlayerDataChange}
                        />

                        <CouponInput
                            gameId={game._id}
                            orderAmount={selectedPackage.sell_price}
                            onApply={setCouponData}
                            couponData={couponData}
                        />
                    </div>

                    {/* RIGHT: STICKY SUMMARY */}
                    <aside className="w-full lg:w-[400px] flex-shrink-0 animate-slide-up [animation-delay:0.2s]">
                        <OrderSummary
                            game={game}
                            selectedPackage={selectedPackage}
                            playerData={playerData}
                            couponData={couponData}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </aside>
                </div>
            </div>

        </main>
    )
}