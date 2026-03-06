import Link from 'next/link'
import { blogPosts } from '@/data/blog-posts'

export const metadata = {
    title: 'Gaming News & Guides — Top-Up Tips | DiamondZoneBD',
    description: 'Stay updated with the latest gaming news, bKash recharge guides, and security tips for Free Fire, PUBG, Mobile Legends, and more in Bangladesh.',
    openGraph: {
        title: 'Gaming News & Guides | DiamondZoneBD',
        description: 'Expert guides and tips for safer and cheaper gaming top-ups.',
        type: 'website'
    }
}

export default function BlogListing() {
    return (
        <div className="min-h-screen bg-bg pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Protocol */}
                <div className="text-center space-y-4 mb-20 animate-fade-in relative z-10">
                    <h1 className="font-orbitron font-black text-4xl md:text-6xl text-white tracking-[0.2em] uppercase italic drop-shadow-glow">
                        GAMING <span className="text-accent">INTEL</span> FEED
                    </h1>
                    <p className="font-rajdhani font-black text-muted text-xs md:text-sm uppercase tracking-[0.4em] opacity-60">
                        Latest Signals · Recharge Guides · Security Protocols
                    </p>
                    <div className="w-24 h-1 bg-accent mx-auto mt-8 shadow-glow" />
                </div>

                {/* Blog Pulse Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogPosts.map((post) => (
                        <Link
                            href={`/blog/${post.slug}`}
                            key={post.slug}
                            className="card bg-surface/40 backdrop-blur-xl border-border/80 group hover:border-accent/50 hover:bg-surface/60 transition-all overflow-hidden flex flex-col"
                        >
                            {/* Visual Cover */}
                            <div className="aspect-video relative overflow-hidden bg-bg/50 flex items-center justify-center text-7xl select-none group-hover:scale-105 transition-transform">
                                <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent pointer-events-none" />
                                {post.coverEmoji}
                                <div className="absolute bottom-4 left-4 flex gap-2">
                                    {post.tags.slice(0, 2).map((tag) => (
                                        <span key={tag} className="px-2 py-1 text-[8px] font-black uppercase tracking-widest text-accent border border-accent/30 bg-accent/5 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Content Uplink */}
                            <div className="p-8 flex-1 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] font-rajdhani line-clamp-1">{post.author} · {new Date(post.publishedAt).toLocaleDateString()}</p>
                                    <h3 className="font-orbitron font-black text-lg text-white group-hover:text-accent transition-colors tracking-tight leading-tight">
                                        {post.title}
                                    </h3>
                                    <p className="text-xs text-muted font-rajdhani font-bold leading-relaxed line-clamp-2 opacity-70 italic">
                                        {post.excerpt}
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-border/20 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-muted uppercase tracking-widest">{post.readTime} READ</span>
                                    <span className="text-accent text-[9px] font-black tracking-widest uppercase group-hover:translate-x-1 transition-transform">DECODE SIGNAL →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>

            {/* Background World Decor */}
            <div className="fixed top-1/2 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[200px] -z-10" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-orange/5 rounded-full blur-[200px] -z-10" />
        </div>
    )
}