import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPaymentTransactionWithoutOrderService } from '../services/createPaymentTransactionWithoutOrderService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useCreatePaymentTransactionWithoutOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPaymentTransactionWithoutOrderService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingTransactions'] })
      sonnerResponse('Transacción de pago creada exitosamente', 'success')
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

