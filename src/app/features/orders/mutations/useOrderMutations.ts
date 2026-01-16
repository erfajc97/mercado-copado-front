import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrderService } from '../services/createOrderService'

import { updateOrderStatusService } from '../services/updateOrderStatusService'
import { getOrderPaymentLinkService } from '../services/getOrderPaymentLinkService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'
import { useCartStore } from '@/app/store/cart/cartStore'

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient()
  const { clearCart } = useCartStore()
  return useMutation({
    mutationFn: createOrderService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'my-orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'all'] })
      clearCart() // Limpiar el carrito local después de crear la orden
      sonnerResponse('Orden creada exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error al crear la orden'
      sonnerResponse(message, 'error')
    },
  })
}

interface UpdateOrderStatusData {
  orderId: string
  status: string
}

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<unknown, Error, UpdateOrderStatusData>({
    mutationFn: ({ orderId, status }) =>
      updateOrderStatusService(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'my-orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['order'] })
      sonnerResponse('Estado de la orden actualizado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al actualizar el estado de la orden'
      sonnerResponse(message, 'error')
    },
  })
}

export const useGetOrderPaymentLinkMutation = () => {
  return useMutation<
    { paymentLink: string; orderId: string; total: number },
    Error,
    string
  >({
    mutationFn: (orderId: string) => getOrderPaymentLinkService(orderId),
    onSuccess: (data) => {
      // Abrir el link de pago en una nueva ventana
      if (data.paymentLink) {
        window.open(data.paymentLink, '_blank')
        sonnerResponse('Redirigiendo al pago...', 'success')
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al obtener el link de pago'
      sonnerResponse(message, 'error')
    },
  })
}
