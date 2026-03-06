'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import { motion, AnimatePresence } from 'framer-motion'

const NavSection = ({ title, items, currentPath }) => (
    <div className="mb-8 px-4">
        <h4 className="text-[10px] font-black text-muted tracking-[0.4em] uppercase mb-4 px-3 opacity-50">
            {title}
        </h4>
        <div className="space-y-1">
            {items.map((item) => {
                const isActive = currentPath === item.href
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative group overflow-hidden ${isActive
                            ? 'text-accent bg-accent/5 font-bold shadow-glow-sm'
                            : 'text-muted/70 hover:text-white hover:bg-surface2'
                            }`}
                    >
                        {/* Active Indicator */}
                        {isActive && (
                            <motion.div
                                layoutId="active-indicator"
                                className="absolute left-0 w-1 h-2/3 bg-accent rounded-full"
                            />
                        )}

                        <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className="font-rajdhani text-sm tracking-widest uppercase font-black">
                            {item.name}
                        </span>
                    </Link>
                )
            })}
        </div>
    </div>
)

export default function Sidebar({ isOpen, toggle }) {
    const pathname = usePathname()
    const { user, logout } = useAuthStore()

    const sections = [
        {
            title: 'OVERVIEW',
            items: [
                { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
                { name: 'Orders', href: '/admin/orders', icon: '📦' },
            ]
        },
        {
            title: 'CATALOG',
            items: [
                { name: 'Games', href: '/admin/games', icon: '🎮' },
                { name: 'Packages', href: '/admin/packages', icon: '💎' },
                { name: 'Coupons', href: '/admin/coupons', icon: '🎁' },
            ]
        },
        {
            title: 'USERS',
            items: [
                { name: 'All Users', href: '/admin/users', icon: '👥' },
            ]
        },
        {
            title: 'SYSTEM',
            items: [
                { name: 'API (Smile)', href: '/admin/settings/smile', icon: '🔗' },
                { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
            ]
        }
    ]

    return (
        <>
            {/* MOBILE OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggle}
                        className="fixed inset-0 bg-bg/80 backdrop-blur-md z-[60] md:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`fixed inset-y-0 left-0 z-[70] w-64 bg-surface border-r border-border transition-all duration-500 ease-cyber transform md:translate-x-0 ${isOpen ? 'translate-x-0 shadow-glow shadow-accent/20' : '-translate-x-full'}`}>

                {/* HEADER: LOGO */}
                <div className="h-20 flex items-center px-8 border-b border-border/50 bg-surface/50 backdrop-blur-xl">
                    <Link href="/" className="inline-block" onClick={() => isOpen && toggle()}>
                        <span className="font-orbitron font-black text-white italic text-lg tracking-tighter">
                            DIAMOND<span className="text-accent2">⚡</span><span className="text-accent">ZONE</span>
                        </span>
                        <p className="text-[8px] font-black text-accent tracking-[0.5em] uppercase leading-none mt-1">ADMIN CONTROL</p>
                    </Link>
                </div>

                {/* NAV SECTION */}
                <nav className="flex-1 overflow-y-auto py-8">
                    {sections.map(sec => (
                        <div key={sec.title} onClick={() => isOpen && toggle()}>
                            <NavSection {...sec} currentPath={pathname} />
                        </div>
                    ))}
                </nav>

                {/* FOOTER: ADMIN INFO */}
                <div className="p-4 border-t border-border/50 bg-surface2/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-accent text-bg flex items-center justify-center font-orbitron font-black text-sm uppercase">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-rajdhani font-black text-white text-sm truncate uppercase tracking-widest">{user?.name || 'ADMIN'}</p>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none">Global Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { logout(); isOpen && toggle(); }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-danger/5 border border-danger/20 text-danger text-[10px] font-black tracking-[0.3em] uppercase hover:bg-danger/10 transition-all"
                    >
                        <span>🛑</span> ABORT SESSION
                    </button>
                </div>
            </aside>
        </>
    )
}