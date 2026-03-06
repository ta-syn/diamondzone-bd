import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-bg">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="text-center z-10 animate-fade-in">
                {/* 404 Glitch Effect */}
                <div className="relative inline-block mb-10">
                    <h1 className="text-8xl md:text-9xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-br from-accent to-cyan-800 tracking-tighter animate-pulse select-none">
                        404
                    </h1>
                    <div className="absolute top-0 left-0 w-full h-full text-8xl md:text-9xl font-orbitron font-black text-danger/20 mix-blend-screen animate-glitch opacity-50 select-none">
                        404
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-4 uppercase tracking-[0.2em]">
                    PLAYER NOT FOUND
                </h2>

                <p className="text-muted font-rajdhani font-medium text-lg max-w-md mx-auto mb-10 uppercase tracking-widest leading-relaxed">
                    Looks like this page respawned somewhere else or took a massive headshot.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <Link href="/" className="btn-primary px-8 py-4 w-full md:w-64 flex items-center justify-center gap-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        RETURN TO BASE
                    </Link>
                    <Link href="/games" className="btn-outline px-8 py-4 w-full md:w-64 border-accent/30 text-accent hover:border-accent">
                        SEE ALL GAMES
                    </Link>
                </div>
            </div>

        </main>
    )
}