'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

import MobileMenu from './MobileMenu'

export default function Navbar() {
    const pathname = usePathname()
    const { user, setUser, logout } = useAuthStore()
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data } = await axios.get('/api/auth/me')
                if (data.user) setUser(data.user)
            } catch (err) {
                if (err?.response?.status !== 401) {
                    // Only log unexpected errors
                    console.error('Navbar auth check failed:', err)
                }
            }
        }
        checkUser()
    }, [setUser])

    useEffect(() => {
        setMobileMenuOpen(false)
        setDropdownOpen(false)
    }, [pathname])

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Games', href: '/games' },
        { name: 'Track Order', href: '/track' },
        { name: 'Blog', href: '/blog' },
    ]

    const isActive = (path) => pathname === path

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout')
            logout()
        } catch (e) {
            console.error('Logout error:', e)
        }
    }

    return (
        <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'h-16 bg-bg/80 backdrop-blur-xl border-b border-border shadow-glow' : 'h-20 bg-transparent'}`}>
            <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="font-orbitron text-2xl font-black italic tracking-tighter text-white group-hover:drop-shadow-glow transition-all">
                        DIAMOND<span className="text-accent2 group-hover:animate-pulse">⚡</span><span className="text-accent">ZONE</span>
                    </span>
                </Link>

                {/* CENTER NAV (Desktop) */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`relative font-rajdhani font-bold tracking-[0.2em] uppercase text-xs transition-all hover:text-accent ${isActive(link.href) ? 'text-accent' : 'text-muted'}`}
                        >
                            {link.name}
                            {isActive(link.href) && (
                                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent rounded-full animate-fade-in" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* RIGHT (Desktop) */}
                <div className="hidden md:flex items-center gap-5">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="bg-surface2 border border-border px-3 py-1.5 rounded-lg flex items-center gap-2 group cursor-default">
                                <span className="text-gold text-lg">💰</span>
                                <span className="text-white font-orbitron font-bold text-sm">৳{user.wallet_balance.toLocaleString()}</span>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-cyan-700 p-0.5 group active:scale-95 transition-all"
                                >
                                    <div className="w-full h-full rounded-full bg-surface flex items-center justify-center border border-white/20 group-hover:border-white transition-colors">
                                        <span className="font-orbitron font-black text-xs text-accent uppercase">
                                            {user.name.charAt(0)}
                                        </span>
                                    </div>
                                </button>

                                {/* Dropdown */}
                                {dropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                        <div className="absolute right-0 mt-3 w-52 bg-surface border border-border rounded-xl shadow-glow-lg overflow-hidden py-2 animate-fade-in z-20">
                                            <p className="px-4 py-2 text-[10px] uppercase font-black text-muted tracking-widest border-b border-border/50 mb-1">Commander {user.name.split(' ')[0]}</p>
                                            {user.role === 'admin' && (
                                                <Link href="/admin" className="block px-4 py-2 text-sm font-rajdhani font-bold text-accent hover:bg-accent/10 transition-colors">ADMIN PANEL ⚡</Link>
                                            )}
                                            <Link href="/dashboard" className="block px-4 py-2 text-sm font-rajdhani font-bold text-white hover:bg-accent/10 hover:text-accent transition-colors">DASHBOARD</Link>
                                            <Link href="/dashboard/orders" className="block px-4 py-2 text-sm font-rajdhani font-bold text-white hover:bg-accent/10 hover:text-accent transition-colors">MY ORDERS</Link>
                                            <Link href="/dashboard/wallet" className="block px-4 py-2 text-sm font-rajdhani font-bold text-white hover:bg-accent/10 hover:text-accent transition-colors">MY WALLET</Link>
                                            <div className="border-t border-border/50 mt-2 pt-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm font-rajdhani font-black text-danger hover:bg-danger/10 transition-colors"
                                                >
                                                    ABORT MISSION (LOGOUT)
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/auth/login" className="btn-outline px-5 py-2 text-[10px] tracking-[0.2em] font-black border-border/50 rounded-lg">
                                LOGIN
                            </Link>
                            <Link href="/auth/register" className="btn-primary px-5 py-2 text-[10px] tracking-[0.2em] font-black rounded-lg">
                                SIGN UP
                            </Link>
                        </div>
                    )}
                </div>

                {/* MOBILE TOGGLE */}
                <button
                    className="md:hidden text-white p-2 z-[110]"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <div className="w-6 flex flex-col gap-1.5">
                        <span className={`h-0.5 w-full bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`h-0.5 w-full bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`h-0.5 w-full bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </div>
                </button>
            </div>

            {/* NEW MODULAR MOBILE MENU */}
            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                navLinks={navLinks}
                user={user}
                isActive={isActive}
                handleLogout={handleLogout}
            />
        </nav>
    )
}