import { useEffect, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CartItem } from '@/app/store/cart/cartStore'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useCartStore } from '@/app/store/cart/cartStore'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export function useCartSync() {
  const { token } = useAuthStore()
  const { items: localCartItems, clearCart } = useCartStore()
  const queryClient = useQueryClient()
  const hasSyncedRef = useRef(false)

  const syncCartMutation = useMutation({
    mutationFn: async (items: Array<CartItem>) => {
      // Sincronizar cada item del carrito local con el servidor
      const syncPromises = items.map((item) =>
        axiosInstance.post(API_ENDPOINTS.CART, {
          productId: item.productId,
          quantity: item.quantity,
        }),
      )
      await Promise.all(syncPromises)
    },
    onSuccess: () => {
      // Limpiar el carrito local después de sincronizar
      clearCart()
      // Invalidar la query del carrito para obtener los datos actualizados del servidor
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      hasSyncedRef.current = true
    },
  })

  useEffect(() => {
    // Resetear el flag cuando el usuario cierra sesión
    if (!token) {
      hasSyncedRef.current = false
      return
    }

    // Solo sincronizar si el usuario está autenticado, hay items en el carrito local
    // y aún no se ha sincronizado
    if (token && localCartItems.length > 0 && !hasSyncedRef.current) {
      // Sincronizar los items locales con el servidor
      syncCartMutation.mutate(localCartItems)
    }
  }, [token, localCartItems.length]) // Ejecutar cuando cambie el token o el número de items

  return {
    isSyncing: syncCartMutation.isPending,
  }
}
