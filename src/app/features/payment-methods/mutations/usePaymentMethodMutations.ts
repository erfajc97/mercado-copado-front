import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPaymentMethodService } from '../services/createPaymentMethodService'
import { setDefaultPaymentMethodService } from '../services/setDefaultPaymentMethodService'
import { deletePaymentMethodService } from '../services/deletePaymentMethodService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface CreatePaymentMethodData {
  gatewayToken: string
  cardBrand: string
  last4Digits: string
  expirationMonth: number
  expirationYear: number
  isDefault?: boolean
}

export const useCreatePaymentMethodMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<unknown, Error, CreatePaymentMethodData>({
    mutationFn: createPaymentMethodService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] })
      sonnerResponse('Método de pago agregado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al agregar el método de pago'
      sonnerResponse(message, 'error')
    },
  })
}

export const useSetDefaultPaymentMethodMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<unknown, Error, string>({
    mutationFn: setDefaultPaymentMethodService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] })
      sonnerResponse(
        'Método de pago establecido como predeterminado exitosamente',
        'success',
      )
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al establecer el método de pago por defecto'
      sonnerResponse(message, 'error')
    },
  })
}

export const useDeletePaymentMethodMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<unknown, Error, string>({
    mutationFn: deletePaymentMethodService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] })
      sonnerResponse('Método de pago eliminado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al eliminar el método de pago'
      sonnerResponse(message, 'error')
    },
  })
}
