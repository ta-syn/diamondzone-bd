'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileMenu({ isOpen, onClose, navLinks, user, isActive, handleLogout }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 bg-bg z-[105] flex flex-col p-8 pt-24"
                >
                    <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

                    {/* Background Glow */}
                    <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] -z-10" />

                    <div className="flex flex-col gap-6 text-center relative z-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={onClose}
                                className={`font-orbitron text-2xl font-black tracking-[0.2em] uppercase italic transition-all ${isActive(link.href) ? 'text-accent drop-shadow-glow' : 'text-white/80 hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto flex flex-col gap-4 relative z-10">
                        {user ? (
                            <>
                                <div className="p-6 bg-surface2/50 border border-border/50 rounded-2xl mb-4 text-center">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">COMMANDER</p>
                                    <p className="font-orbitron font-black text-white text-lg tracking-widest uppercase">{user.name}</p>
                                </div>
                                {user.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        onClick={onClose}
                                        className="btn-primary w-full py-4 text-center font-black tracking-widest uppercase bg-gradient-to-r from-accent to-cyan-600 border-none"
                                    >
                                        ADMIN PANEL ⚡
                                    </Link>
                                )}
                                <Link
                                    href="/dashboard"
                                    onClick={onClose}
                                    className="btn-primary w-full py-4 text-center font-black tracking-widest uppercase"
                                >
                                    DASHBOARD
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); onClose(); }}
                                    className="btn-outline w-full py-4 border-danger/40 text-danger font-black tracking-widest uppercase"
                                >
                                    LOGOUT
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    onClick={onClose}
                                    className="btn-outline w-full py-4 text-center font-black tracking-widest uppercase"
                                >
                                    LOGIN
                                </Link>
                                <Link
                                    href="/auth/register"
                                    onClick={onClose}
                                    className="btn-primary w-full py-4 text-center font-black tracking-widest uppercase"
                                >
                                    JOIN NOW
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 text-center opacity-30">
                        <p className="text-[8px] font-black text-muted tracking-[0.5em] uppercase">DIAMOND ZONE v1.0.2</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}