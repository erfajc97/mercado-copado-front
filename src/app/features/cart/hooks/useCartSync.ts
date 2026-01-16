import { useCallback, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useCartStore } from '@/app/store/cart/cartStore'
import { useCartQuery } from '@/app/features/cart/queries/useCartQuery'
import {
  useAddToCartMutation,
  useUpdateCartItemMutation,
} from '@/app/features/cart/mutations/useCartMutations'

export function useCartSync() {
  const { token } = useAuthStore()
  const { items: localCartItems, clearCart } = useCartStore()
  const queryClient = useQueryClient()
  const hasSyncedRef = useRef(false)

  // Obtener carrito de BD si está autenticado
  const { data: dbCartItems } = useCartQuery({
    enabled: !!token,
  })

  const { mutateAsync: addToCart } = useAddToCartMutation()
  const { mutateAsync: updateCartItem } = useUpdateCartItemMutation()

  // Sincronizar items de localStorage a BD sin duplicar
  const syncLocalCartToDB = useCallback(async () => {
    if (localCartItems.length === 0) return

    // Si dbCartItems no está disponible aún, esperar a que se cargue
    // o proceder con los items del localStorage
    const existingItemsMap = dbCartItems
      ? new Map(dbCartItems.map((item: any) => [item.productId, item]))
      : new Map()

    // Sincronizar cada item del localStorage
    const syncPromises = localCartItems.map(async (localItem) => {
      const existingItem = existingItemsMap.get(localItem.productId)

      if (existingItem) {
        // Si el producto ya existe, actualizar cantidad (sumar)
        const newQuantity = existingItem.quantity + localItem.quantity
        await updateCartItem({ id: existingItem.id, quantity: newQuantity })
      } else {
        // Si no existe, agregarlo
        await addToCart({
          productId: localItem.productId,
          quantity: localItem.quantity,
        })
      }
    })

    try {
      await Promise.all(syncPromises)
      // Limpiar localStorage después de sincronizar exitosamente
      clearCart()
      // Invalidar query para obtener datos actualizados
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      hasSyncedRef.current = true
    } catch (error) {
      console.error('Error sincronizando carrito:', error)
      // No limpiar el localStorage si hay error, para que el usuario no pierda sus items
    }
  }, [
    dbCartItems,
    localCartItems,
    addToCart,
    updateCartItem,
    clearCart,
    queryClient,
  ])

  useEffect(() => {
    // Resetear el flag cuando el usuario cierra sesión
    if (!token) {
      hasSyncedRef.current = false
      return
    }

    // Sincronizar cuando el usuario se autentica y hay items en localStorage
    // Esperar a que dbCartItems esté disponible (puede ser array vacío o undefined inicialmente)
    if (
      token &&
      localCartItems.length > 0 &&
      !hasSyncedRef.current &&
      dbCartItems !== undefined
    ) {
      syncLocalCartToDB()
    }
  }, [token, localCartItems.length, dbCartItems, syncLocalCartToDB])

  return {
    isSyncing: false,
  }
}
