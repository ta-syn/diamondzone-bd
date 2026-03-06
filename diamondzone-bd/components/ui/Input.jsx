'use client'

const fieldBase = 'w-full bg-surface2/50 border border-border/80 focus:border-accent text-white font-rajdhani font-bold text-md tracking-wider px-6 py-4 rounded-xl transition-all duration-300 outline-none placeholder:text-muted/50 placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest'

export default function Input({ label, error, className = '', ...props }) {
    return (
        <div className={`space-y-2 w-full ${className}`}>
            {label && (
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] px-1 pointer-events-none block animate-fade-in">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    className={`
                        ${fieldBase}
                        ${error ? 'border-danger focus:border-danger' : 'hover:border-accent/40'}
                        group-focus-within:shadow-glow/30
                    `}
                    {...props}
                />

                {/* Glow Overlay */}
                <div className={`
                    absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none border border-accent/20 shadow-glow/10 
                    ${error ? 'border-danger/30 shadow-danger/10' : ''}
                `} />
            </div>

            {error && (
                <p className="text-[10px] font-black text-danger uppercase tracking-widest px-1 animate-slide-up bg-danger/5 border border-danger/20 p-2 rounded-lg">
                    ⚠️ {error}
                </p>
            )}
        </div>
    )
}

export function Select({ label, error, options = [], className = '', ...props }) {
    return (
        <div className={`space-y-2 w-full ${className}`}>
            {label && (
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] px-1 pointer-events-none block">
                    {label}
                </label>
            )}
            <div className="relative group">
                <select
                    className={`
                        ${fieldBase}
                        ${error ? 'border-danger focus:border-danger' : 'hover:border-accent/40'}
                        appearance-none cursor-pointer pr-12
                    `}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-surface2 text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Arrow Icon */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted transition-transform group-focus-within:rotate-180">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {error && (
                <p className="text-[10px] font-black text-danger uppercase tracking-widest px-1">
                    {error}
                </p>
            )}
        </div>
    )
}