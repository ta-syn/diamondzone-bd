import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
    Facebook, 
    Youtube, 
    MessageCircle, 
    Send, 
    ShieldCheck, 
    Zap, 
    Headphones,
    ArrowRight,
    MapPin,
    Mail,
    Phone
} from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        platform: [
            { name: 'Home Store', href: '/' },
            { name: 'Game Catalog', href: '/games' },
            { name: 'Track Order', href: '/track' },
            { name: 'Latest News', href: '/blog' },
            { name: 'About Elite', href: '/about' },
        ],
        ecosystems: [
            { name: 'Free Fire Max', href: '/games/free-fire' },
            { name: 'PUBG Global', href: '/games/pubg-mobile' },
            { name: 'Mobile Legends', href: '/games/mobile-legends' },
            { name: 'Valorant Points', href: '/games/valorant' },
            { name: 'Genshin Impact', href: '/games/genshin-impact' },
        ],
        support: [
            { name: 'Help Center', href: '/faq' },
            { name: 'Refund Policy', href: '/refund-policy' },
            { name: 'Privacy Hub', href: '/privacy-policy' },
            { name: 'Global Terms', href: '/terms' },
            { name: 'Partner Program', href: '/reseller/register' },
        ]
    }

    const socialLinks = [
        { name: 'Facebook', icon: <Facebook size={18} />, href: '#', color: 'hover:text-[#1877F2]' },
        { name: 'YouTube', icon: <Youtube size={18} />, href: '#', color: 'hover:text-[#FF0000]' },
        { name: 'WhatsApp', icon: <MessageCircle size={18} />, href: 'https://wa.me/8801234567890', color: 'hover:text-[#25D366]' },
    ]

    const paymentMethods = [
        { name: 'bKash', color: 'from-[#E3106D] to-[#B10D55]' },
        { name: 'Nagad', color: 'from-[#F14100] to-[#C13400]' },
        { name: 'Rocket', color: 'from-[#8C3494] to-[#6A2870]' },
        { name: 'Visa', color: 'from-[#1A1F71] to-[#0E1245]' },
        { name: 'Mastercard', color: 'from-[#EB001B] to-[#B30014]' },
    ]

    return (
        <footer className="relative bg-[#060910] border-t border-border/40 mt-20 pt-20 pb-10 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent2/5 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                    
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="inline-block group">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-500 shadow-glow">
                                    <Zap size={24} className="text-bg fill-current" />
                                </div>
                                <span className="font-orbitron text-2xl font-black italic tracking-tighter text-white">
                                    DIAMOND<span className="text-accent2">⚡</span><span className="text-accent">ZONE</span>
                                </span>
                            </div>
                        </Link>
                        
                        <p className="text-muted text-sm leading-relaxed font-rajdhani font-semibold max-w-sm">
                            Bangladesh's premier gateway for instant gaming credits. Experience lightning-fast 
                            delivery and secure transactions for all your favorite digital ecosystems.
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-muted hover:text-white transition-colors cursor-default text-sm font-rajdhani font-bold">
                                <MapPin size={16} className="text-accent" />
                                <span>Dhaka, Bangladesh</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted hover:text-white transition-colors cursor-default text-sm font-rajdhani font-bold">
                                <Mail size={16} className="text-accent" />
                                <span>support@diamondzone.com.bd</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted hover:text-white transition-colors cursor-default text-sm font-rajdhani font-bold">
                                <Phone size={16} className="text-accent" />
                                <span>+880 1234 567 890</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {socialLinks.map((soc) => (
                                <motion.a
                                    key={soc.name}
                                    href={soc.href}
                                    whileHover={{ y: -4, scale: 1.1 }}
                                    className={`w-10 h-10 rounded-xl bg-surface2 border border-border/60 flex items-center justify-center text-muted ${soc.color} transition-all duration-300 shadow-sm hover:shadow-glow/20`}
                                >
                                    {soc.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Column 1 */}
                        <div className="space-y-6">
                            <h3 className="font-orbitron text-[11px] font-bold tracking-[0.3em] text-white uppercase flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-accent" /> Platform
                            </h3>
                            <ul className="space-y-4">
                                {footerLinks.platform.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-muted hover:text-accent transition-all duration-300 flex items-center group text-sm font-rajdhani font-bold tracking-wide">
                                            <ArrowRight size={10} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all mr-2 text-accent" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-6">
                            <h3 className="font-orbitron text-[11px] font-bold tracking-[0.3em] text-white uppercase flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-accent2" /> Ecosystems
                            </h3>
                            <ul className="space-y-4">
                                {footerLinks.ecosystems.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-muted hover:text-accent2 transition-all duration-300 flex items-center group text-sm font-rajdhani font-bold tracking-wide">
                                            <ArrowRight size={10} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all mr-2 text-accent2" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3 */}
                        <div className="space-y-6">
                            <h3 className="font-orbitron text-[11px] font-bold tracking-[0.3em] text-white uppercase flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-primary" /> Player Support
                            </h3>
                            <ul className="space-y-4">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-muted hover:text-primary transition-all duration-300 flex items-center group text-sm font-rajdhani font-bold tracking-wide">
                                            <ArrowRight size={10} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all mr-2 text-primary" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Newsletter & Stats */}
                <div className="bg-surface2/50 backdrop-blur-md border border-border/40 rounded-3xl p-8 mb-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-accent/10 transition-colors duration-700" />
                    
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-glow/10">
                                <Headphones size={32} />
                            </div>
                            <div>
                                <h4 className="font-orbitron text-lg font-bold text-white mb-1">24/7 Elite Support</h4>
                                <p className="text-muted text-sm font-rajdhani font-semibold">Our squad is always online to assist with your top-ups.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                           <div className="text-center">
                                <div className="text-accent font-orbitron text-2xl font-black">99.9%</div>
                                <div className="text-muted text-[10px] font-black uppercase tracking-widest">Uptime</div>
                           </div>
                           <div className="w-px h-10 bg-border" />
                           <div className="text-center">
                                <div className="text-accent2 font-orbitron text-2xl font-black">2M+</div>
                                <div className="text-muted text-[10px] font-black uppercase tracking-widest">Orders</div>
                           </div>
                           <div className="w-px h-10 bg-border" />
                           <div className="hidden sm:block text-center">
                                <div className="text-success font-orbitron text-2xl font-black">6s</div>
                                <div className="text-muted text-[10px] font-black uppercase tracking-widest">Delivery</div>
                           </div>
                        </div>

                        <div className="flex items-center gap-4 bg-bg border border-border/80 rounded-2xl p-2 pl-4 w-full lg:w-96 focus-within:border-accent group transition-all duration-300">
                             <Mail size={18} className="text-muted group-focus-within:text-accent" />
                             <input 
                                type="email" 
                                placeholder="Stay Updated (Email)" 
                                className="bg-transparent border-none focus:ring-0 text-sm font-rajdhani font-bold text-white w-full outline-none"
                             />
                             <button className="bg-accent hover:bg-accent/90 text-bg p-3 rounded-xl transition-all shadow-glow hover:scale-105 active:scale-95">
                                <Send size={18} />
                             </button>
                        </div>
                    </div>
                </div>

                {/* Trust Badges / Payments */}
                <div className="border-t border-border/30 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4 text-muted border border-border/60 px-5 py-2 rounded-2xl bg-surface/40">
                        <ShieldCheck size={20} className="text-success" />
                        <span className="text-[11px] font-orbitron font-bold tracking-[0.1em] text-white/80 uppercase">Secured by SSL Protocol</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                        {paymentMethods.map((pm) => (
                            <div 
                                key={pm.name}
                                className={`h-10 px-6 rounded-xl bg-gradient-to-br ${pm.color} flex items-center justify-center shadow-lg grayscale-50 hover:grayscale-0 transition-all cursor-default`}
                            >
                                <span className="font-orbitron font-black text-white text-[10px] uppercase tracking-tighter">{pm.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-rajdhani font-bold tracking-widest text-muted/60">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <p className="hover:text-white transition-colors">
                            © {currentYear} <span className="text-accent">DIAMONDZONEBD</span>. ALL RIGHTS RESERVED.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] bg-accent/5 px-3 py-1 rounded-full border border-accent/10">
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                            <span>SERVERS OPERATIONAL</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <p className="group">
                             CRAFTED WITH <span className="text-danger group-hover:animate-ping inline-block">❤</span> BY <span className="text-accent font-black tracking-normal underline underline-offset-4 decoration-accent/30 group-hover:decoration-accent transition-all">NISHAN</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}