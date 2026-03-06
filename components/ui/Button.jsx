'use client'
import Spinner from './Spinner'

const variants = {
    primary: 'bg-accent text-bg border-accent shadow-glow hover:shadow-glow-lg active:scale-95',
    secondary: 'bg-accent2 text-bg border-accent2 shadow-glow-orange hover:shadow-glow-orange-lg active:scale-95',
    success: 'bg-success text-bg border-success shadow-glow-green hover:shadow-glow-green-lg active:scale-95',
    danger: 'bg-danger text-bg border-danger shadow-glow-orange hover:shadow-glow-orange-lg active:scale-95',
    outline: 'bg-transparent text-white border-border hover:border-accent hover:text-accent active:scale-95',
    ghost: 'bg-transparent text-white border-transparent hover:bg-surface2 active:scale-95',
}

const sizes = {
    sm: 'px-4 py-2 text-[10px] rounded-lg',
    md: 'px-8 py-3.5 text-[11px] rounded-xl',
    lg: 'px-12 py-5 text-xs rounded-2xl',
    icon: 'p-3 rounded-lg',
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    disabled = false,
    icon = null,
    ...props
}) {
    return (
        <button
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center font-orbitron font-black uppercase tracking-[0.2em] border transition-all duration-300 relative overflow-hidden group 
                ${variants[variant] || variants.primary} 
                ${sizes[size] || sizes.md}
                ${(disabled || loading) ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
                ${className}
            `}
            {...props}
        >
            {loading ? (
                <Spinner size="sm" className="mr-0" />
            ) : (
                <>
                    {icon && <span className="mr-3 group-hover:scale-110 transition-transform">{icon}</span>}
                    <span className="relative z-10">{children}</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </>
            )}
        </button>
    )
}