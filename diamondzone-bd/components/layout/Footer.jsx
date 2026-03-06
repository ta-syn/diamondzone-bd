import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const quickLinks = [
        { name: 'Home', href: '/' },
        { name: 'Games', href: '/games' },
        { name: 'Track Order', href: '/track' },
        { name: 'Blog', href: '/blog' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
    ]

    const topGames = [
        { name: 'Free Fire', href: '/games/free-fire' },
        { name: 'PUBG Mobile', href: '/games/pubg-mobile' },
        { name: 'Mobile Legends', href: '/games/mobile-legends' },
        { name: 'Valorant', href: '/games/valorant' },
        { name: 'Genshin Impact', href: '/games/genshin-impact' },
    ]

    const supportLinks = [
        { name: 'FAQ', href: '/faq' },
        { name: 'Refund Policy', href: '/refund-policy' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'WhatsApp: +8801234567890', href: 'https://wa.me/8801234567890' },
    ]

    return (
        <footer className="relative bg-surface border-t border-border mt-20 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* COL 1: LOGO & ABOUT */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="font-orbitron text-2xl font-black italic tracking-tighter text-white">
                                DIAMOND<span className="text-accent2">⚡</span><span className="text-accent">ZONE</span>
                            </span>
                        </Link>
                        <p className="text-muted text-sm leading-relaxed font-rajdhani font-semibold pr-4">
                            Bangladesh's #1 gaming top-up platform providing instant recharge,
                            secure payments, and 24/7 support for elite gamers.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { name: 'facebook', icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
                                { name: 'youtube', icon: <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.04z" /> },
                                { name: 'discord', icon: <path d="M18.6 4.6l-1.3-1.4c-.1-.1-.3-.1-.4-.1-.1 0-.3.1-.4.2-.6.7-1.4 1.7-2 2.6H9.5c-.6-1-1.4-1.9-2-2.6-.1-.1-.3-.2-.4-.2-.1 0-.3 0-.4.1L5.4 4.6c-.1 0-.1.1-.1.2-.4 3.7.2 7.3 1.8 10.4.1.2.2.3.4.4.8.4 1.7.7 2.6.9.2 0 .4-.1.5-.3.2-.4.4-.8.6-1.2h2.4c.2.4.4.8.6 1.2.1.2.3.3.5.3.9-.2 1.8-.5 2.6-.9.2-.1.3-.2.4-.4 1.6-3.1 2.2-6.7 1.8-10.4.1-.1 0-.2-.1-.2zm-8.6 8.4C9.1 13 8.3 12.2 8.3 11s.8-2 1.7-2 1.7.8 1.7 2-.8 2-1.7 2zm4.1 0C13.2 13 12.4 12.2 12.4 11s.8-2 1.7-2 1.7.8 1.7 2-.8 2-1.7 2z" /> }
                            ].map((soc) => (
                                <Link key={soc.name} href="#" className="w-10 h-10 rounded-lg bg-surface2 border border-border flex items-center justify-center hover:border-accent hover:text-accent group transition-all duration-300">
                                    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        {soc.icon}
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* COL 2: QUICK LINKS */}
                    <div className="space-y-6">
                        <h3 className="font-orbitron text-sm font-bold tracking-[0.2em] text-white uppercase">Quick Links</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {quickLinks.map((link) => (
                                <Link key={link.name} href={link.href} className="text-muted text-sm font-rajdhani font-bold hover:text-accent hover:translate-x-1 transition-all inline-block">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* COL 3: TOP GAMES */}
                    <div className="space-y-6">
                        <h3 className="font-orbitron text-sm font-bold tracking-[0.2em] text-white uppercase">Top Ecosystems</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {topGames.map((game) => (
                                <Link key={game.name} href={game.href} className="text-muted text-sm font-rajdhani font-bold hover:text-accent hover:translate-x-1 transition-all inline-block">
                                    {game.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* COL 4: SUPPORT */}
                    <div className="space-y-6">
                        <h3 className="font-orbitron text-sm font-bold tracking-[0.2em] text-white uppercase">Player Support</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {supportLinks.map((link) => (
                                <Link key={link.name} href={link.href} className="text-muted text-sm font-rajdhani font-bold hover:text-accent hover:translate-x-1 transition-all inline-block">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* PAYMENT METHODS */}
                <div className="border-y border-border/50 py-10 md:py-16 text-center">
                    <p className="font-orbitron text-[10px] tracking-[0.5em] text-muted font-black uppercase mb-10">Trusted Settlement Networks</p>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-40 hover:opacity-100 transition-opacity duration-700 items-center">
                        {[
                            { name: 'bKash', color: 'bg-[#E3106D]' },
                            { name: 'Nagad', color: 'bg-[#F14100]' },
                            { name: 'Rocket', color: 'bg-[#8C3494]' },
                            { name: 'Visa', color: 'bg-[#1A1F71]' },
                            { name: 'Mastercard', color: 'bg-[#EB001B]' },
                            { name: 'SSLCommerz', color: 'bg-[#005BAC]' }
                        ].map((method) => (
                            <div key={method.name} className="flex flex-col items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-default scale-90 md:scale-100">
                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${method.color} flex items-center justify-center shadow-lg`}>
                                    <span className="font-orbitron font-black text-white text-[8px] md:text-[10px] uppercase">{method.name.charAt(0)}</span>
                                </div>
                                <span className="text-[10px] font-black text-white/50 font-rajdhani uppercase tracking-widest">{method.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted text-xs font-rajdhani font-medium tracking-wider">
                        © {currentYear} <span className="text-white">DIAMONDZONEBD</span>. ALL SYSTEMS GO.
                    </p>
                    <p className="text-muted text-xs font-rajdhani font-medium">
                        MADE WITH <span className="text-danger animate-pulse">❤</span> IN BANGLADESH
                    </p>
                    <p className="text-muted text-xs font-rajdhani font-medium">
                        sir amar nam <span className="text-accent font-bold">Nishan</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}