export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://diamondzone.com.bd'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/dashboard/',
                    '/reseller/',
                    '/_next/',
                    '/static/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}