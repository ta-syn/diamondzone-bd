import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts } from '@/data/blog-posts'

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }))
}

export async function generateMetadata({ params }) {
    const { slug } = await params
    const post = blogPosts.find((p) => p.slug === slug)
    if (!post) return {}

    return {
        title: `${post.title} — Gaming Guide | DiamondZoneBD`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            authors: [post.author],
            publishedTime: post.publishedAt,
            tags: post.tags,
        }
    }
}

export default async function BlogPost({ params }) {
    const { slug } = await params
    const post = blogPosts.find((p) => p.slug === slug)
    if (!post) notFound()

    const related = blogPosts
        .filter((p) => p.slug !== slug && p.tags.some(t => post.tags.includes(t)))
        .slice(0, 3)

    return (
        <div className="min-h-screen bg-bg pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">

                {/* Post Transmission Header */}
                <div className="space-y-6 mb-16 animate-fade-in relative z-10">
                    <div className="flex flex-wrap gap-3 mb-8">
                        {post.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent border border-accent/30 bg-accent/5 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="font-orbitron font-black text-4xl md:text-6xl text-white tracking-tight leading-tight uppercase italic drop-shadow-glow">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-6 pt-6 border-t border-border/20">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">AUTHOR SIGNAL</span>
                            <span className="font-rajdhani font-black text-white text-md uppercase">{post.author}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">TRANSMISSION DATE</span>
                            <span className="font-rajdhani font-black text-white text-md uppercase">{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">READ CYCLE</span>
                            <span className="font-rajdhani font-black text-white text-md uppercase">{post.readTime}</span>
                        </div>
                    </div>
                </div>

                {/* Content Matrix */}
                <div
                    className="prose prose-invert prose-emerald max-w-none font-rajdhani font-bold text-lg leading-relaxed text-muted/90 blog-content-styles"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Mission CTA */}
                <div className="mt-24 p-12 card border-accent bg-accent/5 relative overflow-hidden group">
                    <div className="absolute top-[-30px] right-[-30px] text-9xl opacity-10 rotate-12 select-none grayscale group-hover:grayscale-0 transition-all">{post.coverEmoji}</div>
                    <div className="relative z-10 space-y-6 max-w-md">
                        <h2 className="font-orbitron font-black text-3xl text-white tracking-widest uppercase italic">READY TO <span className="text-accent underline">TOP UP?</span></h2>
                        <p className="font-rajdhani font-black text-muted text-xs uppercase tracking-widest">Deploy diamonds, UC, or VP instantly to your gaming world.</p>
                        <Link href="/games" className="inline-block btn-primary px-10 py-5 text-[12px] font-black tracking-[0.3em] uppercase rounded-2xl shadow-glow">
                            START NEW MISSION ⚡
                        </Link>
                    </div>
                </div>

                {/* Related Intel Grid */}
                {related.length > 0 && (
                    <div className="mt-32 space-y-10">
                        <h3 className="font-orbitron font-black text-2xl text-white tracking-[0.3em] uppercase italic opacity-60">RELATED INTEL</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {related.map((rp) => (
                                <Link
                                    href={`/blog/${rp.slug}`}
                                    key={rp.slug}
                                    className="card p-6 bg-surface/50 border-border/50 hover:border-accent/30 transition-all space-y-4 group"
                                >
                                    <div className="text-4xl group-hover:scale-110 transition-transform">{rp.coverEmoji}</div>
                                    <h4 className="font-orbitron font-black text-sm text-white group-hover:text-accent transition-colors uppercase leading-tight">{rp.title}</h4>
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest">DECODE SIGNAL →</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Background Decor */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[200px] -z-10" />
        </div>
    )
}