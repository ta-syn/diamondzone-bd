'use client'

export default function ProgressStepper({ status }) {
    const steps = [
        { id: 'pending', name: 'Order Placed', icon: '🛒' },
        { id: 'payment', name: 'Payment Verified', icon: '💰' },
        { id: 'processing', name: 'Recharge Sent', icon: '🚀' },
        { id: 'completed', name: 'Delivered', icon: '✅' },
    ]

    // Track status codes: pending, processing, completed, cancelled, refunded
    // We'll map them to the 4 steps
    const getStepStatus = (index) => {
        if (status === 'cancelled' || status === 'refunded') return 'failed'

        const stepMapping = {
            'pending': 1,
            'processing': 2, // 2 complete, 3 active
            'completed': 4,
        }

        const currentStep = stepMapping[status] || 1

        if (index + 1 < currentStep) return 'completed'
        if (index + 1 === currentStep) {
            // Special case for processing - step 3 is pulsing
            if (status === 'processing' && index === 1) return 'completed'
            if (status === 'processing' && index === 2) return 'active'
            return 'active'
        }
        return 'pending'
    }

    return (
        <div className="w-full py-10 relative">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-0 px-4">
                {steps.map((step, i) => {
                    const stepStatus = getStepStatus(i)
                    const isLast = i === steps.length - 1

                    return (
                        <div key={step.id} className="flex-1 w-full md:w-auto relative group">
                            <div className="flex md:flex-col items-center gap-6 md:gap-4 relative z-10">

                                {/* Circle Icon */}
                                <div
                                    className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 border-2 relative ${stepStatus === 'completed' ? 'bg-success border-success text-bg shadow-glow-green' :
                                            stepStatus === 'active' ? 'bg-accent/10 border-accent text-accent animate-pulse-glow shadow-glow' :
                                                stepStatus === 'failed' ? 'bg-danger border-danger text-bg' :
                                                    'bg-surface2 border-border text-muted opacity-40'
                                        }`}
                                >
                                    <span className="text-xl md:text-2xl filter group-hover:scale-110 transition-transform select-none">
                                        {stepStatus === 'completed' ? '✓' : step.icon}
                                    </span>

                                    {/* Subtle Pulse for Active */}
                                    {stepStatus === 'active' && (
                                        <div className="absolute inset-0 rounded-full animate-ping bg-accent/30 pointer-events-none" />
                                    )}
                                </div>

                                {/* Label */}
                                <div className="text-left md:text-center pointer-events-none">
                                    <p className={`font-orbitron font-black text-[10px] md:text-xs tracking-widest uppercase transition-colors ${stepStatus === 'completed' ? 'text-success' :
                                            stepStatus === 'active' ? 'text-accent' :
                                                stepStatus === 'failed' ? 'text-danger' : 'text-muted'
                                        }`}>
                                        {step.name}
                                    </p>
                                    <p className="text-[10px] text-muted font-bold font-rajdhani tracking-tighter hidden md:block mt-1 uppercase opacity-40">
                                        Step 0{i + 1}
                                    </p>
                                </div>
                            </div>

                            {/* Connecting Line (Desktop) */}
                            {!isLast && (
                                <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-border transition-all duration-700 z-0">
                                    <div className={`h-full bg-success shadow-glow-green transition-all duration-1000 origin-left ${stepStatus === 'completed' ? 'w-full' : 'w-0'
                                        }`} />
                                </div>
                            )}

                            {/* Connecting Line (Mobile) */}
                            {!isLast && (
                                <div className="md:hidden absolute left-6 top-12 w-[2px] h-full bg-border -z-10 bg-opacity-30 translate-y-4">
                                    <div className={`w-full bg-success transition-all duration-700 origin-top ${stepStatus === 'completed' ? 'h-full' : 'h-0'
                                        }`} />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Failed Banner */}
            {(status === 'cancelled' || status === 'refunded') && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-fade-in pointer-events-none">
                    <div className="bg-danger/10 border-2 border-danger/40 text-danger font-black text-2xl md:text-4xl font-orbitron px-8 py-3 rounded-xl rotate-[-5deg] backdrop-blur-md opacity-20 uppercase tracking-[0.5em]">
                        MISSION FAILED
                    </div>
                </div>
            )}

        </div>
    )
}