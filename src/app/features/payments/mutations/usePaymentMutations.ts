import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPaymentTransactionService } from '../services/createPaymentTransactionService'
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
