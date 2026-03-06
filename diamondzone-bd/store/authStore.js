import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    setLoading: (isLoading) => set({ isLoading }),
    logout: () => set({ user: null, token: null }),
}))

export default useAuthStore