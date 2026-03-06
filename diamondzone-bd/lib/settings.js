import Setting from '@/models/Setting'
import { dbConnect } from '@/lib/mongodb'
import redis from '@/lib/redis'

const CACHE_KEY = 'site_settings'
const CACHE_TTL = 3600 // 1 hour

/**
 * Global Site Settings Library.
 * Handles persistent configuration for the platform (e.g., maintenance mode, contact info).
 */

export async function getSettings() {
    try {
        // 1. Try Cache
        if (redis) {
            const cached = await redis.get(CACHE_KEY)
            if (cached) return JSON.parse(cached)
        }

        // 2. Try DB
        await dbConnect()
        const settings = await Setting.find({}).lean()
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value
            return acc
        }, {})

        // 3. Fallback Defaults
        const defaults = {
            maintenance_mode: false,
            whatsapp_number: '+8801XXXXXXXXX',
            support_email: 'support@diamondzone.com.bd',
            min_deposit: 10,
            max_deposit: 10000,
            referral_rate: 0.02, // 2%
            announcement: 'Welcome to DiamondZoneBD! #1 Gaming Top-Up Platform in Bangladesh.',
            is_payment_enabled: true,
        }

        const finalSettings = { ...defaults, ...settingsMap }

        // 4. Update Cache
        if (redis) {
            await redis.set(CACHE_KEY, JSON.stringify(finalSettings), 'EX', CACHE_TTL)
        }

        return finalSettings
    } catch (e) {
        console.error('Settings Library Error:', e)
        return {
            maintenance_mode: false,
            whatsapp_number: '+8801XXXXXXXXX',
            support_email: 'support@diamondzone.com.bd',
            min_deposit: 10,
            max_deposit: 10000,
            referral_rate: 0.02, // 2%
            announcement: 'Welcome to DiamondZoneBD! #1 Gaming Top-Up Platform in Bangladesh.',
            is_payment_enabled: true,
        }
    }
}

export async function getSettingByKey(key, defaultValue = null) {
    const settings = await getSettings()
    return settings && settings[key] !== undefined ? settings[key] : defaultValue
}

export async function updateSetting(key, value, userId = null) {
    try {
        await dbConnect()
        await Setting.findOneAndUpdate(
            { key },
            {
                key,
                value,
                updated_at: new Date(),
                updated_by: userId
            },
            { upsert: true, new: true }
        )

        // Clear Cache
        if (redis) {
            await redis.del(CACHE_KEY)
        }

        return true
    } catch (e) {
        console.error('Settings Update Error:', e)
        return false
    }
}
