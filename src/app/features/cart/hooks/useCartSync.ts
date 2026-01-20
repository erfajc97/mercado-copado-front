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
  const previousTokenRef = useRef<string | null>(null)

  // Obtener carrito de BD si está autenticado
  const { data: dbCartItems, isFetched } = useCartQuery({
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

  // Detectar cuando el usuario se autentica (token cambia de null a un valor)
  useEffect(() => {
    const tokenChanged = previousTokenRef.current === null && token !== null
    previousTokenRef.current = token

    // Resetear el flag cuando el usuario cierra sesión
    if (!token) {
      hasSyncedRef.current = false
      return
    }

    // Si el token cambió (usuario se logueó) y hay items en localStorage, resetear el flag
    // para permitir la sincronización incluso si queryClient.clear() se llamó
    if (tokenChanged && localCartItems.length > 0) {
      hasSyncedRef.current = false
    }
  }, [token, localCartItems.length])

  // Sincronizar cuando el usuario se autentica y hay items en localStorage
  useEffect(() => {
    if (!token) return

    // Sincronizar cuando:
    // 1. Hay token (usuario autenticado)
    // 2. Hay items en localStorage
    // 3. No se ha sincronizado aún
    // 4. La query se haya ejecutado completamente (isFetched === true)
    // 5. dbCartItems esté disponible (puede ser array vacío, pero no undefined)
    // Esto maneja el caso cuando queryClient.clear() se llama durante el login
    if (
      token &&
      localCartItems.length > 0 &&
      !hasSyncedRef.current &&
      isFetched &&
      dbCartItems !== undefined
    ) {
      syncLocalCartToDB()
    }
  }, [token, localCartItems.length, isFetched, dbCartItems, syncLocalCartToDB])

  return {
    isSyncing: false,
  }
}
