'use client'
import { useEffect } from 'react'
import axios from 'axios'
import useAuthStore from '@/store/authStore'

export default function AuthInitializer() {
    const { setUser, setLoading } = useAuthStore()

    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data } = await axios.get('/api/auth/me')
                if (data.user) {
                    setUser(data.user)
                }
            } catch (err) {
                if (err?.response?.status !== 401) {
                    // Only log unexpected errors
                    console.error('Auth check failed:', err)
                }
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        initAuth()
    }, [setUser, setLoading])

    return null
}
