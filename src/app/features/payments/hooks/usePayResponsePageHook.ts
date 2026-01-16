import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { usePaymentConfirmationByPayphoneMutation } from '@/app/features/payments/components/payphone/mutations/usePayPhoneMutation'
import { useUpdatePaymentStatusMutation } from '@/app/features/payments/mutations/usePaymentMutations'

interface UsePayResponsePageHookProps {
  id: string
  clientTransactionId: string
}

export const usePayResponsePageHook = ({
  id,
  clientTransactionId,
}: UsePayResponsePageHookProps) => {
  const navigate = useNavigate()
  const {
    mutateAsync: paymentConfirmationByPayphone,
    isPending,
    isError,
  } = usePaymentConfirmationByPayphoneMutation()
  const { mutateAsync: updateStatusTransaction } =
    useUpdatePaymentStatusMutation()

  const handlePaymentConfirmation = async () => {
    try {
      const response = await paymentConfirmationByPayphone({
        id,
        clientTxId: clientTransactionId,
      })
      const { statusCode } = response
      if (statusCode === 3) {
        // Pago completado exitosamente - actualizar estado de transacción y orden
        // La orden ya existe (se creó cuando se inició el pago), solo actualizar su estado
        await updateStatusTransaction({
          clientTransactionId,
          status: 'completed',
        })
        // El carrito ya se limpió cuando se creó la orden, no es necesario limpiarlo de nuevo
        // Redirigir directamente a órdenes
        navigate({ to: '/orders' })
      } else {
        // Pago pendiente o en proceso - redirigir a órdenes para verificar
        navigate({ to: '/orders' })
      }
    } catch (error) {
      console.error('Error al confirmar el pago:', error)
      // Si hay error, redirigir a órdenes para que el usuario pueda verificar el estado
      navigate({ to: '/orders' })
    }
  }

  useEffect(() => {
    if (!id || !clientTransactionId) {
      console.warn('Faltan parámetros requeridos: id o clientTransactionId')
      navigate({ to: '/' })
      return
    }
    if (!isError) {
      handlePaymentConfirmation()
    }
  }, [id, clientTransactionId, isError])

  return {
    isPending,
    isError,
    hasRequiredParams: Boolean(id && clientTransactionId),
  }
}
