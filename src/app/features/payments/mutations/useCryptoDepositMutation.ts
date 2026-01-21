import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { cryptoDepositService } from '../services/cryptoDepositService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useCryptoDepositMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: {
      addressId: string
      clientTransactionId: string
      depositImage: File
      orderId?: string // Para retry de pagos en órdenes existentes
    }) => {
      const response = await cryptoDepositService(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'my-orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'all'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      sonnerResponse(
        'Comprobante crypto enviado exitosamente. Tu orden está en revisión.',
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
          : 'Error al procesar el pago crypto'
      sonnerResponse(message, 'error')
    },
  })
}
