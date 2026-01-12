import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { useNavigate } from '@tanstack/react-router'
import { createOrderFromTransactionService } from '../services/createOrderFromTransactionService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useCreateOrderFromTransactionMutation = () => {
  const queryClient = useQueryClient()
  // const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: {
      clientTransactionId: string
      initialStatus?: 'pending' | 'created' | 'processing'
    }) => {
      const response = await createOrderFromTransactionService(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      sonnerResponse('Orden creada exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al crear la orden desde la transacción'
      sonnerResponse(message, 'error')
    },
  })
}
