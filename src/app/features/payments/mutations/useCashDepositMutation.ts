import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { cashDepositService } from '../services/cashDepositService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useCashDepositMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: {
      addressId: string
      clientTransactionId: string
      depositImage: File
    }) => {
      const response = await cashDepositService(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      sonnerResponse(
        'Depósito enviado exitosamente. Tu orden está en revisión.',
        'success',
      )
      // Redirigir a órdenes después de un breve delay
      setTimeout(() => {
        navigate({ to: '/orders' })
      }, 1500)
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al procesar el depósito en efectivo'
      sonnerResponse(message, 'error')
    },
  })
}
