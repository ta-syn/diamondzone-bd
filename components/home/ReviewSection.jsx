export default function ReviewSection() {
    const reviews = [
        { name: 'Hasan Ahmed', rating: 5, text: 'Best gaming top-up site in BD! Diamond payar 30 second er moddhei chole asche. Highly recommended!', initial: 'H' },
        { name: 'Rifat Islam', rating: 5, text: 'PUBG UC recharge korar jonno best. Payment process khub e easy. bKash e kora jay.', initial: 'R' },
        { name: 'Nadia Akter', rating: 5, text: 'Instantly got my Mobile Legends diamonds. Site design is super cool and premium looking.', initial: 'N' },
        { name: 'Tanvir Hossain', rating: 5, text: 'Valorant VP kinar jonno etar cheye bhalo platform ar dekhi nai. Khub e fast delivery.', initial: 'T' },
        { name: 'Sumaiya Khatun', rating: 5, text: 'Customer support is very helpful and responsive on WhatsApp. 10/10 service!', initial: 'S' },
        { name: 'Sakib Al Hasan', rating: 5, text: 'Been using DiamondZone for months. Always reliable and cheap compared to others.', initial: 'S' },
    ]

    return (
        <section className="max-w-7xl mx-auto px-6 py-24">

            {/* HEADER */}
            <div className="text-center mb-16">
                <div className="inline-block border border-gold/20 bg-gold/5 text-gold font-bold text-[10px] tracking-[0.4em] uppercase px-6 py-1.5 rounded-full mb-4 shadow-glow-green">
                    ⭐ USER REVIEWS
                </div>
                <h2 className="font-orbitron font-black text-4xl md:text-5xl text-white tracking-widest uppercase">
                    WHAT <span className="text-gold">GAMERS</span> SAY
                </h2>
            </div>

            {/* REVIEWS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.map((rev, i) => (
                    <div key={i} className="card p-8 border-border/50 bg-bg hover:border-gold hover:shadow-glow-green transition-all duration-300 relative overflow-hidden group">

                        {/* Stars */}
                        <div className="flex gap-1 mb-6">
                            {[...Array(rev.rating)].map((_, j) => (
                                <span key={j} className="text-gold text-lg drop-shadow-glow-green">⭐</span>
                            ))}
                        </div>

                        {/* Content */}
                        <p className="font-rajdhani text-muted text-lg font-medium leading-relaxed mb-8 italic">
                            "{rev.text}"
                        </p>

                        {/* Profile */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-surface2 border border-border flex items-center justify-center font-orbitron font-black text-accent group-hover:bg-gold group-hover:text-bg transition-colors">
                                {rev.initial}
                            </div>
                            <div>
                                <h4 className="font-rajdhani font-black text-white text-md tracking-widest uppercase truncate max-w-[150px]">
                                    {rev.name}
                                </h4>
                                <span className="text-[10px] font-black text-muted tracking-widest uppercase">Verified Gamer</span>
                            </div>
                        </div>

                        {/* Background Quote Icon decoration */}
                        <div className="absolute top-4 right-4 text-white opacity-[0.03] scale-x-[-1]">
                            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21L14.017 18C14.017 16.899 14.898 16 16.017 16L21.017 16C22.119 16 23.017 15.111 23.017 14L23.017 9C23.017 7.889 22.119 7 21.017 7L16.017 7C14.898 7 14.017 7.889 14.017 9L14.017 14L11.017 14L11.017 9C11.017 5.134 14.151 2 18.017 2L18.017 2L18.017 5C15.811 5 14.017 6.791 14.017 9L14.017 12L17.017 12C18.119 12 19.017 12.889 19.017 14L19.017 19C19.017 20.111 18.119 21 17.017 21L14.017 21ZM0 21L0 18C0 16.899 0.881 16 2 16L7 16C8.102 16 9 15.111 9 14L9 9C9 7.889 8.102 7 7 7L2 7C0.881 7 0 7.889 0 9L0 14L3 14L3 9C3 5.134 6.134 2 10 2L10 2L10 5C7.811 5 6 6.791 6 9L6 12L9 12C10.102 12 11 12.889 11 14L11 19C11 20.111 10.102 21 9 21L0 21Z" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    )
}