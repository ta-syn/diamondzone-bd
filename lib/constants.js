/**
 * Global Constants for DiamondZoneBD.
 * Use these for consistency in UI labels, role checks, and database status tokens.
 */

export const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
    HOLD: 'hold',
}

export const TRANSACTION_TYPE = {
    DEPOSIT: 'deposit',
    PURCHASE: 'purchase',
    REFUND: 'refund',
    REFERRAL: 'referral_commission',
    PROMOTIONAL: 'promotional',
}

export const USER_ROLES = {
    USER: 'user',
    RESELLER: 'reseller',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
}

export const PAYMENT_METHODS = {
    BKASH: 'bkash',
    NAGAD: 'nagad',
    ROCKET: 'rocket',
    UPAY: 'upay',
    CARD: 'card',
    WALLET: 'wallet',
}

export const GAME_CATEGORIES = {
    MOBILE: 'Mobile Games',
    PC: 'PC Games',
    CONSOLE: 'Console Games',
    GIFT_CARDS: 'Gift Cards',
    SOFTWARE: 'Software/Utils',
}

// Bangladesh Timezone offset (+6:00)
export const BANGLADESH_TZ_OFFSET = 6 * 60 * 60 * 1000

// Minimum and maximum order limits (server-side)
export const ORDER_LIMITS = {
    MIN_ORDER: 10,
    MAX_ORDER: 25000,
    RATE_LIMIT_HOUR: 3600,
    MAX_REQUESTS_PER_HOUR: 10,
}

// Smile.one specific constants
export const SMILEONE_DEFAULTS = {
    REGION: 'ID',
    QUANTITY: '1',
}
