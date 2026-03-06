'use client'

const variants = {
    primary: 'border-accent text-accent bg-accent/5 shadow-glow',
    secondary: 'border-accent2 text-accent2 bg-accent2/5 shadow-glow-orange',
    success: 'border-success text-success bg-success/5 shadow-glow-green',
    danger: 'border-danger text-danger bg-danger/5 shadow-glow-orange',
    gold: 'border-gold text-gold bg-gold/5',
    muted: 'border-border text-muted bg-surface/50'
}

const sizes = {
    sm: 'px-2 py-0.5 text-[8px]',
    md: 'px-3 py-1 text-[10px]',
    lg: 'px-4 py-1.5 text-xs'
}

export default function Badge({ children, variant = 'primary', size = 'md', className = '', glow = false }) {
    return (
        <span className={`
            inline-flex items-center justify-center font-orbitron font-black uppercase tracking-widest rounded-full border 
            ${variants[variant] || variants.primary} 
            ${sizes[size] || sizes.md}
            ${glow ? 'animate-pulse' : ''}
            ${className}
        `}>
            {children}
        </span>
    )
}