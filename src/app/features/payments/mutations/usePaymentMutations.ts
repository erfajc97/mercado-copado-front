import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPaymentTransactionService } from '../services/createPaymentTransactionService'
import { updatePaymentStatusService } from '../services/updatePaymentStatusService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useCreatePaymentTransactionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPaymentTransactionService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingTransactions'] })
      sonnerResponse('Transacción de pago creada', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al crear la transacción de pago'
      sonnerResponse(message, 'error')
    },
  })
}

export const useUpdatePaymentStatusMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updatePaymentStatusService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingTransactions'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'my-orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
      sonnerResponse('Estado de transacción actualizado', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al actualizar el estado de la transacción'
      sonnerResponse(message, 'error')
    },
  })
}
