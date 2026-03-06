import { BANGLADESH_TZ_OFFSET } from './constants'

/**
 * Global Utility Functions for UI/Logic consistency.
 */

/**
 * Format price as BDT Currency label ৳
 */
export function formatPrice(amount, symbol = '৳') {
    if (amount === undefined || amount === null) return `${symbol}0`
    return `${symbol}${parseFloat(amount).toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`
}

/**
 * Human-readable relative time formatter (e.g. 2 minutes ago)
 */
export function timeAgo(date) {
    if (!date) return 'Unknown'
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + " years ago"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + " months ago"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " days ago"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " hours ago"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " mins ago"
    return Math.floor(seconds) + " secs ago"
}

/**
 * Full Date/Time formatter in Bangladesh context
 */
export function formatFullDate(date) {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Dhaka',
    })
}

/**
 * Mask Player IDs for security/privacy on tracking pages
 */
export function maskPlayerId(id) {
    if (!id || typeof id !== 'string') return id
    if (id.length <= 4) return '****'
    return id.substring(0, 2) + '*'.repeat(id.length - 4) + id.substring(id.length - 2)
}

/**
 * Generate a unique verification code OR random trace ID
 */
export function generateVerificationCode(length = 6) {
    return Math.random().toString(36).substring(2, 2 + length).toUpperCase()
}

/**
 * Calculate Profit/Margin (Server-side logic reuse)
 */
export function calculateMargin(sellPrice, costPrice) {
    if (!sellPrice || !costPrice) return 0
    return ((sellPrice - costPrice) / sellPrice) * 100
}

/**
 * Wait wrapper for async processing (sleep)
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Robust string to boolean converter
 */
export function toBool(val) {
    return val === 'true' || val === true || val === 1 || val === '1'
}
