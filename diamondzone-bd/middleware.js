import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('token')?.value

    if (pathname.startsWith('/admin')) {
        if (!token) return NextResponse.redirect(new URL('/auth/login?from=admin', request.url))
        try {
            const { payload } = await jwtVerify(token, secret)
            if (payload.role !== 'admin') return NextResponse.redirect(new URL('/', request.url))
        } catch {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
    }

    if (pathname.startsWith('/dashboard') || pathname.startsWith('/reseller')) {
        if (!token) return NextResponse.redirect(new URL('/auth/login', request.url))
        try {
            await jwtVerify(token, secret)
        } catch {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*', '/dashboard/:path*', '/reseller/:path*'] }