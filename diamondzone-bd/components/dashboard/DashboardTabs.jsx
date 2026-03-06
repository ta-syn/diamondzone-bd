'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function DashboardTabs({ activeTab, tabs, setPage }) {
    const router = useRouter()

    return (
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-16 border-b border-border/30 pb-4">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => {
                        router.push(`?tab=${tab.id}`, { scroll: false });
                        if (setPage) setPage(1);
                    }}
                    className={`flex items-center gap-3 px-6 py-4 rounded-xl font-orbitron font-black text-[10px] tracking-[0.2em] uppercase transition-all relative overflow-hidden group ${activeTab === tab.id ? 'text-accent' : 'text-muted hover:text-white'
                        }`}
                >
                    <span className={`${activeTab === tab.id ? 'scale-125' : 'grayscale group-hover:grayscale-0'} transition-all`}>
                        {tab.icon}
                    </span>
                    {tab.label}
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 w-full h-1 bg-accent shadow-glow"
                        />
                    )}
                </button>
            ))}
        </div>
    )
}