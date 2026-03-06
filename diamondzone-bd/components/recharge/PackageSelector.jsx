'use client'

export default function PackageSelector({ packages, selectedPackage, onSelect }) {
    return (
        <div className="mb-10 animate-fade-in">
            <h3 className="font-rajdhani text-sm text-muted tracking-[0.3em] uppercase mb-4 font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                01. Select Package
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {packages.map((pkg) => {
                    const isSelected = selectedPackage?._id === pkg._id
                    return (
                        <div
                            key={pkg._id}
                            onClick={() => onSelect(pkg)}
                            className={`card group cursor-pointer transition-all duration-300 relative overflow-hidden p-5 flex flex-col justify-between min-h-[140px] ${isSelected
                                    ? 'border-accent bg-accent/5 shadow-glow'
                                    : 'hover:border-accent2/50 hover:bg-surface2'
                                }`}
                        >
                            {/* Popular Ribbon */}
                            {pkg.is_popular && (
                                <div className="absolute top-2 right-[-35px] bg-gold text-bg text-[8px] font-black rotate-45 px-10 py-1 shadow-lg tracking-widest uppercase z-10">
                                    HOT
                                </div>
                            )}

                            <div className="relative z-10">
                                <div className="font-orbitron font-black text-2xl text-white tracking-tighter mb-1 transition-transform group-hover:scale-110 origin-left">
                                    {pkg.amount}
                                </div>
                                {pkg.badge_text && (
                                    <div className="text-[9px] font-black text-accent2 tracking-widest uppercase mb-2">
                                        {pkg.badge_text}
                                    </div>
                                )}
                                {pkg.bonus_amount > 0 && (
                                    <div className="text-[10px] font-bold text-success tracking-wide uppercase">
                                        + {pkg.bonus_amount} BONUS
                                    </div>
                                )}
                            </div>

                            <div className="relative z-10 mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
                                <div className="text-xl font-orbitron font-black text-success tracking-tight">
                                    ৳{pkg.sell_price}
                                </div>
                                {isSelected && (
                                    <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center text-bg animate-fade-in">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Background Glow on hover */}
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-accent/20 transition-all duration-500 group-hover:h-full opacity-5 pointer-events-none" />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}