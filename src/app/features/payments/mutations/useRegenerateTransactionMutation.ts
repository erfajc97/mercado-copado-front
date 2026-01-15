import { useMutation, useQueryClient } from '@tanstack/react-query'
import { regenerateTransactionService } from '../services/regenerateTransactionService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useRegenerateTransactionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: regenerateTransactionService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingTransactions'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      sonnerResponse('Transacción regenerada exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al regenerar la transacción'
      sonnerResponse(message, 'error')
    },
  })
}
