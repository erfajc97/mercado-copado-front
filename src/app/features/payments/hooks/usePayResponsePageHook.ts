import { useEffect, useState } from 'react'
import { usePaymentConfirmationByPayphoneMutation } from '@/app/features/payments/components/payphone/mutations/usePayPhoneMutation'
import { useUpdatePaymentStatusMutation } from '@/app/features/payments/mutations/usePaymentMutations'
import { verifyMercadoPagoPaymentService } from '@/app/features/payments/services/verifyMercadoPagoPaymentService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface UsePayResponsePageHookProps {
  id: string
  clientTransactionId: string
  from?: string
  mpStatus?: string
  externalReference?: string
  mpPaymentId?: string // ID del pago en Mercado Pago (viene en la redirección)
}

export const usePayResponsePageHook = ({
  id,
  clientTransactionId,
  from,
  mpStatus,
  externalReference,
  mpPaymentId,
}: UsePayResponsePageHookProps) => {
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [paymentPending, setPaymentPending] = useState(false)
  const [paymentRejected, setPaymentRejected] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isMpVerifying, setIsMpVerifying] = useState(false)

  const {
    mutateAsync: paymentConfirmationByPayphone,
    isPending,
    isError,
  } = usePaymentConfirmationByPayphoneMutation()
  const { mutateAsync: updateStatusTransaction } =
    useUpdatePaymentStatusMutation()

  // Mercado Pago: verificar el pago con el backend
  const isMercadoPago = from === 'mercadopago'

  // Verificación de Mercado Pago
  useEffect(() => {
    if (!isMercadoPago) return

    // Usar external_reference de MP o clientTransactionId como fallback
    const txReference = externalReference || clientTransactionId

    // Si no hay payment_id de MP, usar el status de la URL directamente
    if (!mpPaymentId) {
      // Fallback: usar el status que viene en la URL de MP
      if (mpStatus === 'approved') {
        setPaymentConfirmed(true)
      } else if (mpStatus === 'pending' || mpStatus === 'in_process') {
        setPaymentPending(true)
      } else {
        setPaymentRejected(true)
      }
      return
    }

    // Si tenemos payment_id, verificar con el backend
    const verifyMercadoPago = async () => {
      setIsMpVerifying(true)

      try {
        const result = await verifyMercadoPagoPaymentService({
          paymentId: mpPaymentId,
          externalReference: txReference,
        })

        console.log('[usePayResponsePageHook] Resultado verificación MP:', result)

        if (result.status === 'approved' || result.status === 'already_completed') {
          setPaymentConfirmed(true)
          if (result.updated) {
            sonnerResponse('¡Pago confirmado exitosamente!', 'success')
          }
        } else if (result.status === 'pending') {
          setPaymentPending(true)
        } else if (result.status === 'rejected' || result.status === 'cancelled') {
          setPaymentRejected(true)
          setErrorMessage(result.message || 'El pago fue rechazado')
        } else if (result.status === 'not_found') {
          // Transacción no encontrada, usar status de URL como fallback
          if (mpStatus === 'approved') {
            setPaymentConfirmed(true)
          } else if (mpStatus === 'pending') {
            setPaymentPending(true)
          } else {
            setPaymentRejected(true)
          }
        } else if (result.status === 'error') {
          setErrorMessage(result.message || 'Error al verificar el pago')
          // Fallback al status de la URL
          if (mpStatus === 'approved') {
            setPaymentConfirmed(true)
          } else if (mpStatus === 'pending') {
            setPaymentPending(true)
          } else {
            setPaymentRejected(true)
          }
        } else {
          // Estado desconocido, usar status de URL
          if (mpStatus === 'approved') {
            setPaymentConfirmed(true)
          } else if (mpStatus === 'pending') {
            setPaymentPending(true)
          } else {
            setPaymentRejected(true)
          }
        }
      } catch (error) {
        console.error('[usePayResponsePageHook] Error verificando MP:', error)
        setErrorMessage(
          error instanceof Error ? error.message : 'Error al verificar el pago',
        )
        // Fallback al status de la URL en caso de error
        if (mpStatus === 'approved') {
          setPaymentConfirmed(true)
        } else if (mpStatus === 'pending') {
          setPaymentPending(true)
        } else {
          setPaymentRejected(true)
        }
      } finally {
        setIsMpVerifying(false)
      }
    }

    verifyMercadoPago()
  }, [isMercadoPago, mpPaymentId, externalReference, clientTransactionId, mpStatus])

  // Verificación de Payphone
  useEffect(() => {
    if (isMercadoPago) return

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
        const errorMsg =
          error instanceof Error
            ? error.message
            : 'Error desconocido al confirmar el pago'
        setErrorMessage(errorMsg)
        sonnerResponse(`Error al confirmar el pago: ${errorMsg}`, 'error')
      }
    }

    handlePaymentConfirmation()
  }, [id, clientTransactionId, isMercadoPago])

  // Normalizar clientTransactionId para la validación (Payphone)
  const clientTxIdNormalized = Array.isArray(clientTransactionId)
    ? clientTransactionId[0]
    : String(clientTransactionId || '')

  // Para MP, también consideramos válido si tenemos mpStatus aunque no tengamos los params de Payphone
  const hasRequiredParams =
    Boolean(id && clientTxIdNormalized) || (isMercadoPago && Boolean(mpStatus))

  return {
    isPending: isMercadoPago ? isMpVerifying : isPending,
    isError: isError || !!errorMessage,
    hasRequiredParams,
    paymentConfirmed,
    paymentPending,
    paymentRejected,
    errorMessage,
  }
}
