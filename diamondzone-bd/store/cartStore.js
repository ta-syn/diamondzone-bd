import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Zustand Store for Cart Tracking and Purchase Flow.
 * Handles the "Buy Now" and "Saved Items" logic.
 */
export const useCartStore = create(
    persist(
        (set, get) => ({
            activePackage: null, // The currently selected package for purchase
            cart: [], // Future: support for multiple items (e.g., gift cards)
            history: [], // Recent searches or views for a faster UX

            // Set the package before navigating to payment page
            setActivePackage: (pkg, game) => set({
                activePackage: {
                    ...pkg,
                    game: { id: game._id, name: game.name, slug: game.slug, emoji: game.emoji }
                }
            }),

            clearActivePackage: () => set({ activePackage: null }),

            // Add to Cart Logic (future-proof)
            addItem: (item) => {
                const currentCart = get().cart
                const exists = currentCart.find(i => i.id === item.id)
                if (exists) {
                    set({ cart: currentCart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) })
                } else {
                    set({ cart: [...currentCart, { ...item, qty: 1 }] })
                }
            },

            removeItem: (id) => set({ cart: get().cart.filter(i => i.id !== id) }),

            updateQty: (id, qty) => set({
                cart: get().cart.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i)
            }),

            clearCart: () => set({ cart: [] }),

            // Track view history
            addHistory: (game) => {
                const history = get().history
                const filtered = history.filter(h => h.slug !== game.slug)
                set({ history: [game, ...filtered].slice(0, 5) })
            }
        }),
        {
            name: 'dzbd-cart-reserve',
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export default useCartStore