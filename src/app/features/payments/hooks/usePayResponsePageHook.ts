import { useEffect, useState } from 'react'
import { usePaymentConfirmationByPayphoneMutation } from '@/app/features/payments/components/payphone/mutations/usePayPhoneMutation'
import { useUpdatePaymentStatusMutation } from '@/app/features/payments/mutations/usePaymentMutations'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface UsePayResponsePageHookProps {
  id: string
  clientTransactionId: string
}

export const usePayResponsePageHook = ({
  id,
  clientTransactionId,
}: UsePayResponsePageHookProps) => {
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const {
    mutateAsync: paymentConfirmationByPayphone,
    isPending,
    isError,
  } = usePaymentConfirmationByPayphoneMutation()
  const { mutateAsync: updateStatusTransaction } =
    useUpdatePaymentStatusMutation()

  useEffect(() => {
    // Normalizar clientTransactionId (puede venir como array)
    const clientTxIdNormalized = Array.isArray(clientTransactionId)
      ? clientTransactionId[0]
      : String(clientTransactionId || '')

    if (!id || !clientTxIdNormalized) {
      return
    }

    const handlePaymentConfirmation = async () => {
      const clientTxIdString = clientTxIdNormalized

      try {
        const response = await paymentConfirmationByPayphone({
          id,
          clientTxId: clientTxIdString,
        })

        const { statusCode } = response
        if (statusCode === 3) {
          try {
            await updateStatusTransaction({
              clientTransactionId: clientTxIdString,
              status: 'completed',
            })
            setPaymentConfirmed(true)
          } catch (updateError) {
            const msg = 'Pago confirmado pero error al actualizar estado'
            setErrorMessage(msg)
            sonnerResponse(msg, 'error')
          }
        } else {
          const msg = `El pago aún no está confirmado. StatusCode: ${statusCode}`
          setErrorMessage(msg)
          sonnerResponse(msg, 'error')
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido al confirmar el pago'
        setErrorMessage(errorMsg)
        sonnerResponse(`Error al confirmar el pago: ${errorMsg}`, 'error')
      }
    }

    handlePaymentConfirmation()
  
  }, [id, clientTransactionId])

  // Normalizar clientTransactionId para la validación
  const clientTxIdNormalized = Array.isArray(clientTransactionId)
    ? clientTransactionId[0]
    : String(clientTransactionId || '')

  return {
    isPending,
    isError: isError || !!errorMessage,
    hasRequiredParams: Boolean(id && clientTxIdNormalized),
    paymentConfirmed,
    errorMessage,
  }
}
