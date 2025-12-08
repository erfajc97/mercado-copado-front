import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrderService } from '../services/createOrderService'

import { updateOrderStatusService } from '../services/updateOrderStatusService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOrderService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
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
