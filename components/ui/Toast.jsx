'use client'
import useToastStore from '@/store/toastStore'
import { useEffect, useState } from 'react'

const ToastIcon = ({ type }) => {
    switch (type) {
        case 'success': return <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        case 'error': return <svg className="w-5 h-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        case 'warning': return <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        default: return <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    }
}

const ToastColors = {
    success: 'border-success/40 text-success bg-surface shadow-glow-green',
    error: 'border-danger/40 text-danger bg-surface shadow-glow-orange',
    info: 'border-accent/40 text-accent bg-surface shadow-glow',
    warning: 'border-gold/40 text-gold bg-surface',
}

const ProgressBarColors = {
    success: 'bg-success',
    error: 'bg-danger',
    info: 'bg-accent',
    warning: 'bg-gold',
}

function ToastItem({ toast }) {
    const removeToast = useToastStore((state) => state.removeToast)
    const [progress, setProgress] = useState(100)

    useEffect(() => {
        const step = 100 / (toast.duration / 10)
        const interval = setInterval(() => {
            setProgress((prev) => Math.max(0, prev - step))
        }, 10)
        return () => clearInterval(interval)
    }, [toast.duration])

    return (
        <div className={`relative flex items-center gap-4 p-4 rounded-xl border min-w-[320px] max-w-sm animate-slide-in pointer-events-auto transition-all ${ToastColors[toast.type]}`}>
            <div className="flex-shrink-0">
                <ToastIcon type={toast.type} />
            </div>

            <p className="flex-1 text-sm font-rajdhani font-semibold tracking-wide text-white">
                {toast.message}
            </p>

            <button
                onClick={() => removeToast(toast.id)}
                className="text-muted hover:text-white transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 overflow-hidden rounded-b-xl w-full">
                <div
                    className={`h-full transition-all duration-100 ease-linear ${ProgressBarColors[toast.type]}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}

export default function ToastContainer() {
    const toasts = useToastStore((state) => state.toasts)

    return (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[200] flex flex-col gap-4 pointer-events-none">
            {toasts.slice(0, 4).map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}

            <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
        </div>
    )
}

export function useToast() {
    const store = useToastStore()
    return {
        success: store.success,
        error: store.error,
        info: store.info,
        warning: store.warning,
        addToast: store.addToast
    }
}