export function validateEmail(email) {
    if (!email) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePhone(phone) {
    if (!phone) return false
    // Supports 01XXXXXXXXX or +8801XXXXXXXXX
    return /^(?:\+88|88)?(01[3-9]\d{8})$/.test(phone)
}

export function validatePlayerId(playerId, gameSlug) {
    if (!playerId) return false

    const rules = {
        'free-fire': /^\d{6,12}$/,
        'pubg-mobile': /^\d{7,10}$/,
        'mobile-legends': /^\d{6,12}(?:\(\d{4,5}\))?$/, // Optional zone ID in ML
        'valorant': /^.{3,20}#\d{4,5}$/,
        'call-of-duty': /^.{5,20}$/,
        'genshin-impact': /^\d{9,10}$/,
    }

    const regex = rules[gameSlug]
    if (!regex) return true // No rule defined, allow
    return regex.test(playerId.trim())
}

/**
 * Mobile Legends Zone ID Parser.
 * Returns { userId, zoneId }
 */
export function parseMLId(playerId) {
    const match = playerId.match(/^(\d+)(?:\((\d+)\))?$/)
    if (match) {
        return {
            userId: match[1],
            zoneId: match[2] || ''
        }
    }
    return { userId: playerId, zoneId: '' }
}

export function sanitizeString(str) {
    if (typeof str !== 'string') return ''
    return str.replace(/<[^>]*>/g, '').trim().slice(0, 500)
}

export function validateOrderBody(body) {
    const { package_id, player_id, email, phone, payment_method } = body

    if (!package_id) return 'Package is required'
    if (!player_id) return 'Player ID is required'

    if (!email || !validateEmail(email)) return 'Valid email is required'

    if (phone && !validatePhone(phone)) {
        return 'Invalid Bangladesh phone number. Format: 01XXXXXXXXX'
    }

    const validMethods = ['bkash', 'nagad', 'rocket', 'upay', 'card', 'wallet']
    if (!payment_method || !validMethods.includes(payment_method)) {
        return 'Invalid payment method'
    }

    return null
}