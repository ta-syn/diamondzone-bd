import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export function hashPassword(password) {
    return bcrypt.hash(password, 12)
}

export function comparePassword(password, hash) {
    return bcrypt.compare(password, hash)
}

export function generateToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', { expiresIn })
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    } catch {
        return null
    }
}

export async function getAuthUser() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value
        if (!token) return null
        
        const decoded = verifyToken(token)
        if (decoded) {
            decoded.id = decoded.userId || decoded.id
        }
        return decoded
    } catch (e) {
        return null
    }
}

export async function requireAuth() {
    const user = await getAuthUser()
    if (!user) throw new Error('Unauthorized')
    return user
}

export async function requireAdmin() {
    const user = await getAuthUser()
    if (!user || user.role !== 'admin') throw new Error('Forbidden')
    return user
}

export async function requireReseller() {
    const user = await getAuthUser()
    if (!user || (user.role !== 'reseller' && user.role !== 'admin')) throw new Error('Forbidden')
    return user
}