import PackageCard from '@/components/ui/PackageCard'

export default function PackageCards({ packages = [] }) {
    if (!packages?.length) return null

    return (
        <section className="bg-surface border-y border-border/50 py-24 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-accent/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">

                {/* HEADER */}
                <div className="mb-16">
                    <div className="inline-block border border-accent2/20 bg-accent2/5 text-accent2 font-bold text-[10px] tracking-[0.4em] uppercase px-6 py-1.5 rounded-full mb-4 shadow-glow-orange font-orbitron">
                        💎 BEST DEALS
                    </div>
                    <h2 className="font-orbitron font-black text-4xl md:text-5xl text-white tracking-widest uppercase">
                        FEATURED <span className="text-accent2">PACKAGES</span>
                    </h2>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.map((pkg) => (
                        <PackageCard key={pkg._id} pkg={pkg} />
                    ))}
                </div>

            </div>
        </section>
    )
}