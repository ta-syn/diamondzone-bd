'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ResellerSidebar = ({ isOpen, onClose, user }) => {
    const pathname = usePathname()

    const menuItems = [
        { label: 'OVERVIEW', href: '/reseller/dashboard', icon: '📡' },
        { label: 'FAST TOP-UP', href: '/reseller/recharge', icon: '⚡' },
        { label: 'HISTORY', href: '/reseller/orders', icon: '📦' },
        { label: 'SETTINGS', href: '/reseller/settings', icon: '⚙️' },
    ]

    const isActive = (path) => pathname === path

    return (
        <aside className={`fixed inset-y-0 left-0 w-64 bg-surface border-r border-border transform transition-transform duration-500 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 shadow-glow'}`}>
            <div className="flex flex-col h-full relative overflow-hidden">

                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="h-20 flex items-center px-8 border-b border-border/50 bg-bg/20 backdrop-blur-md shrink-0">
                    <span className="font-orbitron font-black text-xl text-white tracking-[0.2em] italic uppercase">
                        RESELLER<span className="text-secondary drop-shadow-glow">HUB</span>
                    </span>
                </div>

                <nav className="flex-1 overflow-y-auto py-10 px-4 space-y-3">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => onClose && onClose()}
                            className={`flex items-center gap-4 px-6 py-4 text-[10px] font-black tracking-[0.3em] uppercase rounded-xl transition-all duration-300 border ${isActive(item.href)
                                    ? 'bg-secondary/10 border-secondary text-secondary shadow-glow-orange/20'
                                    : 'border-transparent text-muted hover:text-white hover:bg-surface2/50 hover:border-border/30'
                                } group relative overflow-hidden`}
                        >
                            <span className={`transition-transform duration-500 ${isActive(item.href) ? 'scale-125' : 'group-hover:scale-110'}`}>{item.icon}</span>
                            {item.label}
                            {isActive(item.href) && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary rounded-r-full shadow-glow" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-border/50 space-y-5 bg-bg/30">
                    <div className="card p-5 bg-secondary/[0.03] border-secondary/20 space-y-3 relative overflow-hidden group">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-muted uppercase tracking-widest opacity-60">CREDIT RESERVE</span>
                            <span className="text-[10px] font-orbitron font-black text-secondary group-hover:drop-shadow-glow transition-all">
                                ৳{user?.reseller_credit_limit?.toLocaleString() || 0}
                            </span>
                        </div>
                        <div className="w-full bg-bg h-1.5 rounded-full overflow-hidden border border-border/50">
                            <div className="h-full bg-gradient-to-r from-secondary/50 to-secondary shadow-glow transition-all duration-1000" style={{ width: '85%' }} />
                        </div>
                    </div>

                    <Link href="/dashboard" className="flex items-center justify-center gap-3 w-full py-4 text-[9px] font-black tracking-[0.4em] uppercase text-muted hover:text-white transition-all bg-surface2/20 border border-border/30 rounded-xl hover:bg-surface2">
                        <span>←</span> EXIT COMMAND
                    </Link>
                </div>
            </div>
        </aside>
    )
}

export default ResellerSidebar
