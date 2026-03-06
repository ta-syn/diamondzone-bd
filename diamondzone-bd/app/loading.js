import Spinner from '@/components/ui/Spinner'

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center animate-fade-in">
            <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-accent/20 border-t-accent rounded-full animate-spin shadow-glow" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-orbitron font-black text-2xl text-white animate-pulse tracking-tighter">DZ</span>
                </div>
            </div>
            <div className="space-y-2 text-center">
                <h2 className="font-orbitron font-black text-xl text-white tracking-[0.4em] uppercase italic">STREAMING <span className="text-accent underline">INTEL</span></h2>
                <p className="font-rajdhani font-black text-muted text-[10px] uppercase tracking-[0.5em] opacity-60">Initializing Secure Connection...</p>
            </div>
        </div>
    )
}