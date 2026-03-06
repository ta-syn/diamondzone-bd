'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import useAuthStore from '@/store/authStore'
import useToastStore from '@/store/toastStore'

export default function RegisterPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const refCode = searchParams.get('ref') || ''

    const setUser = useAuthStore((state) => state.setUser)
    const toast = useToastStore()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        referral_code: refCode,
        agree: false
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [passwordStrength, setPasswordStrength] = useState(0)

    useEffect(() => {
        // Password strength logic
        let strength = 0
        if (formData.password.length >= 6) strength += 1
        if (/[A-Z]/.test(formData.password)) strength += 1
        if (/[0-9]/.test(formData.password)) strength += 1
        if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1
        setPasswordStrength(strength)
    }, [formData.password])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        if (!formData.agree) return toast.error('You must agree to terms')

        setLoading(true)
        setError('')

        try {
            const { data } = await axios.post('/api/auth/register', formData)

            if (data.success) {
                setUser(data.user)
                toast.success(`Welcome to DiamondZoneBD, ${data.user.name.split(' ')[0]}!`)
                router.push('/dashboard')
            }
        } catch (err) {
            const msg = err.response?.data?.error || 'Registration failed. Try again.'
            setError(msg)
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    const strengthColor = ['bg-muted', 'bg-danger', 'bg-accent2', 'bg-gold', 'bg-success']
    const strengthText = ['Weak', 'Weak', 'Fair', 'Good', 'Strong']

    return (
        <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-float" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-accent2/10 rounded-full blur-[100px] animate-float [animation-delay:-3s]" />

            <div className="card w-full max-w-md p-8 relative z-10 shadow-glow backdrop-blur-sm bg-surface/80 border-border/50 animate-fade-in py-10">
                <div className="text-center mb-6">
                    <Link href="/">
                        <h1 className="text-3xl font-orbitron font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-500 mb-2">
                            DIAMOND⚡ZONEBD
                        </h1>
                    </Link>
                    <h2 className="text-sm font-orbitron tracking-[0.3em] text-muted uppercase">Create New Account</h2>
                </div>

                {error && (
                    <div className="bg-danger/10 border border-danger/20 text-danger text-sm p-3 rounded-lg flex items-center gap-2 mb-4 animate-slide-up">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted font-rajdhani tracking-widest uppercase">Full Name</label>
                        <input
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field py-2.5"
                            placeholder="Nishan Mahmud"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted font-rajdhani tracking-widest uppercase">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field py-2.5"
                            placeholder="you@email.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted font-rajdhani tracking-widest uppercase">Phone (Optional)</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-field py-2.5"
                                placeholder="017xxxxxxxx"
                                maxLength={11}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted font-rajdhani tracking-widest uppercase">Referral Code</label>
                            <input
                                name="referral_code"
                                value={formData.referral_code}
                                onChange={handleChange}
                                className="input-field py-2.5 placeholder:text-muted/30"
                                placeholder="PRO-2025"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted font-rajdhani tracking-widest uppercase">Create Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="input-field py-2.5"
                            placeholder="••••••••"
                        />
                        {/* Password Strength Indicator */}
                        <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4].map((step) => (
                                <div
                                    key={step}
                                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= step ? strengthColor[passwordStrength] : 'bg-surface2'}`}
                                />
                            ))}
                        </div>
                        <p className={`text-[10px] mt-1 font-bold uppercase tracking-widest text-right ${strengthColor[passwordStrength].replace('bg-', 'text-')}`}>
                            Strength: {strengthText[passwordStrength]}
                        </p>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group py-2">
                        <input
                            name="agree"
                            type="checkbox"
                            required
                            checked={formData.agree}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-border bg-surface text-accent focus:ring-accent accent-accent transition-all"
                        />
                        <span className="text-xs text-muted font-medium select-none group-hover:text-white transition-colors">
                            I agree to the <span className="text-accent underline">Terms & Conditions</span>
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-fire w-full py-3.5 flex items-center justify-center gap-2 group text-sm"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                INITIALIZE ACCOUNT
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-muted font-medium mt-6 text-sm">
                    Already a member?{' '}
                    <Link href="/auth/login" className="text-accent hover:underline font-bold">
                        Login →
                    </Link>
                </p>
            </div>
        </main>
    )
}