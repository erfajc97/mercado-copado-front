import { createContext, useContext } from 'react'

export const CartSyncContext = createContext<{
  syncAndWait?: () => Promise<void>
}>({})

export function useCartSyncContext() {
  return useContext(CartSyncContext)
}
