import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTransactionAndOrderService } from '../services/createTransactionAndOrderService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'
import { useCartStore } from '@/app/store/cart/cartStore'

export const useCreateTransactionAndOrderMutation = () => {
  const queryClient = useQueryClient()
  const { clearCart } = useCartStore()

  return useMutation({
    mutationFn: createTransactionAndOrderService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingTransactions'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'my-orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      clearCart() // Limpiar el carrito después de crear la orden
      sonnerResponse('Orden creada exitosamente', 'success')
    },
    onError: (error) => {
      console.error('[useCreateTransactionAndOrderMutation] Error:', error)
      const message =
        error instanceof Error
          ? error.message
          : 'Error al crear la transacción y orden. Por favor, verifica que la orden se haya creado correctamente.'
      sonnerResponse(message, 'error')
    },
  })
}
