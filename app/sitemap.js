import { dbConnect } from '@/lib/mongodb'
import Game from '@/models/Game'
import { blogPosts } from '@/data/blog-posts'

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://diamondzone.com.bd'

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/games',
        '/blog',
        '/track',
        '/dashboard',
        '/auth/login',
        '/auth/register'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1.0 : route === '/games' ? 0.9 : 0.7
    }))

    // 2. Dynamic Game Routes (0.8 Priority)
    let gameRoutes = []
    try {
        await dbConnect()
        const activeGames = await Game.find({ status: 'active' }).select('slug updatedAt').lean()
        gameRoutes = activeGames.map((game) => ({
            url: `${baseUrl}/games/${game.slug}`,
            lastModified: game.updatedAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        }))
    } catch (error) {
        console.error('Sitemap Game Generation Error:', error)
    }

    // 3. Dynamic Blog Routes (0.7 Priority)
    const blogRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.7
    }))

    return [...staticRoutes, ...gameRoutes, ...blogRoutes]
}