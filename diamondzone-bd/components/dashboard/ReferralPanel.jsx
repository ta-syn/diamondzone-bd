'use client'
import useToastStore from '@/store/toastStore'

export default function ReferralPanel({ user }) {
    const toast = useToastStore()
    const refCode = user?.referral_code || 'DZ-PILOT-01'
    const refLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/register?ref=${refCode}`

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        toast.success('Frequency Signal Copied to Clipboard!')
    }

    return (
        <div className="space-y-12 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="font-orbitron font-black text-3xl text-white tracking-widest italic uppercase">OPERATIVE <span className="text-accent2">INFLUENCE</span></h2>
                    <p className="font-rajdhani font-black text-muted text-xs uppercase tracking-[0.4em] mt-2 opacity-60">Recruit Operatives & EARN 2% COMMISSIONS</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                    <div className="card p-10 bg-surface/50 border-border/50 space-y-8 relative overflow-hidden">
                        <div className="absolute bottom-[-20px] left-[-20px] text-9xl opacity-[0.03] select-none italic font-orbitron font-black">REF</div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-muted tracking-widest uppercase">Secret Referral Code</label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-bg/50 border border-border/80 h-16 flex items-center justify-center font-orbitron font-black text-xl text-accent2 tracking-[0.3em] rounded-xl">{refCode}</div>
                                <button
                                    onClick={() => copyToClipboard(refCode)}
                                    className="w-16 h-16 bg-accent2 flex items-center justify-center text-bg text-2xl rounded-xl hover:scale-105 transition-all shadow-glow-orange cursor-pointer"
                                >
                                    📋
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-muted tracking-widest uppercase">Signal Propagation Link</label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-bg/50 border border-border/80 h-14 flex items-center px-6 font-mono text-[10px] text-muted overflow-hidden whitespace-nowrap rounded-xl">{refLink}</div>
                                <button
                                    onClick={() => copyToClipboard(refLink)}
                                    className="px-6 h-14 bg-surface2 border border-border/80 text-white text-[10px] font-black tracking-widest uppercase rounded-xl hover:bg-accent2 hover:text-bg transition-all"
                                >
                                    LINK SIGNAL
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card p-8 border-border/40 bg-orange/5 space-y-4">
                        <h3 className="font-orbitron font-black text-sm text-white tracking-widest uppercase italic">SIGNAL PROTOCOL</h3>
                        <div className="space-y-4 font-rajdhani text-xs font-black uppercase tracking-widest text-muted">
                            <div className="flex items-start gap-4">
                                <span className="w-6 h-6 rounded bg-orange/20 flex items-center justify-center text-orange">01</span>
                                <p>Propagate your unique signal link to fellow operatives (Gamers).</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="w-6 h-6 rounded bg-orange/20 flex items-center justify-center text-orange">02</span>
                                <p>Once they register under your frequency, they become your Recruit.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="w-6 h-6 rounded bg-orange/20 flex items-center justify-center text-orange">03</span>
                                <p>EARN 2% CREDITS from every payload (Order) they transmit to our uplink - FOR LIFE.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <h3 className="font-orbitron font-black text-lg text-white tracking-widest uppercase italic opacity-60">RECRUITMENT TELEMETRY</h3>
                    <div className="card h-[400px] flex flex-col items-center justify-center text-center p-10 bg-surface/40 border-border/30 gap-6 opacity-40">
                        <span className="text-8xl">🛰️</span>
                        <div>
                            <h4 className="font-orbitron font-black text-white text-md tracking-widest uppercase mb-2">Zero Recruits Detected</h4>
                            <p className="font-rajdhani font-black text-[10px] text-muted uppercase tracking-[0.3em]">Start propagating your frequency to build your intel network.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}