import { create } from 'zustand'
import { nanoid } from 'nanoid'

export const useToastStore = create((set, get) => ({
    toasts: [],
    addToast: (message, type = 'info', duration = 4000) => {
        const id = nanoid(6)
        set({ toasts: [...get().toasts, { id, message, type, duration }] })
        setTimeout(() => get().removeToast(id), duration)
    },
    success: (msg) => get().addToast(msg, 'success'),
    error: (msg) => get().addToast(msg, 'error'),
    info: (msg) => get().addToast(msg, 'info'),
    warning: (msg) => get().addToast(msg, 'warning'),
    removeToast: (id) => set({ toasts: get().toasts.filter(t => t.id !== id) }),
}))

export default useToastStore