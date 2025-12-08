import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import secureStorage from '@/app/helpers/secureStorage'

export interface CartItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    discount: number
    images: Array<{ url: string }>
  }
  quantity: number
}

interface CartState {
  items: Array<CartItem>
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        const items = get().items
        const existingItem = items.find((i) => i.productId === item.productId)

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
          })
        } else {
          set({ items: [...items, item] })
        }
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        })
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = Number(item.product.price)
          const discount = Number(item.product.discount)
          const finalPrice = price * (1 - discount / 100)
          return total + finalPrice * item.quantity
        }, 0)
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => secureStorage),
    },
  ),
)
