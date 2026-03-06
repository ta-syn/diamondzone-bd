import { apiResponse } from '@/lib/api-helpers.js'
import { cookies } from 'next/headers'

export async function POST() {
    const cookieStore = await cookies()
    cookieStore.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
        path: '/',
        sameSite: 'strict',
    })

    return apiResponse({ success: true })
}