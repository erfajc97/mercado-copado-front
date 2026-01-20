import { useMutation, useQueryClient } from '@tanstack/react-query'
import { linkPayphoneService } from '../service/linkPayphoneService'
import { paymentConfirmationByPayphoneService } from '../service/paymentConfirmationByPayphoneService'
import { phonePayphoneService } from '../service/phonePayphoneService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useLinkPayphoneMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      return await linkPayphoneService(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingTransactions'] })
      sonnerResponse('Link de pago generado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al generar el link de pago'
      sonnerResponse(message, 'error')
    },
  })
}

export const usePaymentConfirmationByPayphoneMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await paymentConfirmationByPayphoneService(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingTransactions'] })
      sonnerResponse('Pago confirmado exitosamente', 'success')
    },
    onError: (error) => {
      sonnerResponse(error.message, 'error')
    },
  })
}

export const usePhonePayphoneMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      addressId: string
      paymentMethodId?: string
      phoneNumber: string
      clientTransactionId: string
      amount: number
    }) => {
      return await phonePayphoneService(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingTransactions'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'my-orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', 'all'] })
      sonnerResponse('Pago por teléfono procesado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al procesar el pago por teléfono'
      sonnerResponse(message, 'error')
    },
  })
}
