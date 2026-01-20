import { useState } from 'react'
import { generateTransactionId } from '../../shared/helpers/generateTransactionId'
import { isValidUUID } from '../../shared/helpers/isValidUUID'
import { detectSafari } from '../../shared/helpers/detectSafari'
import { buildPayphoneLinkBody } from '../helpers/buildPayphoneLinkBody'
import { useLinkPayphoneMutation } from '../../mutations/usePayPhoneMutation'
import { useCreateTransactionAndOrderMutation } from '@/app/features/payments/mutations/useCreateTransactionAndOrderMutation'
import { useRegenerateTransactionMutation } from '@/app/features/payments/mutations/useRegenerateTransactionMutation'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface UseButtonPayPhoneLinkHookProps {
  amount: number
  addressId: string
  paymentMethodId: string
  clientTransactionId?: string
  onSuccess?: () => void
  orderId?: string
}

export const useButtonPayPhoneLinkHook = ({
  amount,
  addressId,
  paymentMethodId,
  clientTransactionId: propClientTransactionId,
  onSuccess,
  orderId,
}: UseButtonPayPhoneLinkHookProps) => {
  const { mutateAsync: linkPayphone, isPending: isPendingLink } =
    useLinkPayphoneMutation()
  const { mutateAsync: createTransactionAndOrder } =
    useCreateTransactionAndOrderMutation()
  const { mutateAsync: regenerateTransaction } =
    useRegenerateTransactionMutation()

  const [showLinkConfirmationModal, setShowLinkConfirmationModal] =
    useState(false)

  const handleLinkPayment = () => {
    setShowLinkConfirmationModal(true)
  }

  const handleConfirmLinkPayment = async () => {
    if (detectSafari()) {
      sonnerResponse(
        'No es posible generar links de pago en Safari. Por favor, utiliza Google Chrome u otro navegador compatible.',
        'error',
      )
      setShowLinkConfirmationModal(false)
      return
    }

    if (!amount || amount <= 0 || isNaN(amount)) {
      sonnerResponse('Error: El monto de la transacción no es válido', 'error')
      setShowLinkConfirmationModal(false)
      return
    }

    try {
      // 1. Generar clientTransactionId
      const transactionId = orderId
        ? propClientTransactionId || generateTransactionId()
        : generateTransactionId()

      // 2. Llamar a Payphone PRIMERO
      const payphoneBody = buildPayphoneLinkBody({
        clientTransactionId: transactionId,
        amount,
      })

      const payphoneResponse = await linkPayphone(payphoneBody)

      // 3. Si Payphone responde exitosamente, abrir la pasarela
      if (typeof payphoneResponse === 'object' && payphoneResponse.paymentId) {
        setShowLinkConfirmationModal(false)
        window.open(payphoneResponse.payWithCard, '_blank', 'noopener')

        // 4. Crear transacción+orden en el backend DESPUÉS
        try {
          // Validar que payphoneResponse tiene la estructura correcta
          if (!payphoneResponse.paymentId) {
            throw new Error(
              'Error: payphoneResponse no contiene paymentId. No se puede crear la transacción.',
            )
          }

          // Estructura correcta de payphoneData para links
          const payphoneDataForLink = {
            paymentId: payphoneResponse.paymentId,
            payWithCard: payphoneResponse.payWithCard,
          }

          console.log(
            '[useButtonPayPhoneLinkHook] Creando/regenerando transacción con LINK:',
            {
              orderId: orderId || 'nueva orden',
              clientTransactionId: transactionId,
              paymentId: payphoneDataForLink.paymentId,
              hasPayWithCard: !!payphoneDataForLink.payWithCard,
            },
          )

          if (orderId) {
            await regenerateTransaction({
              orderId,
              paymentProvider: 'PAYPHONE',
              ...(isValidUUID(paymentMethodId) ? { paymentMethodId } : {}),
              payphoneData: payphoneDataForLink,
            })
            onSuccess?.()
          } else {
            await createTransactionAndOrder({
              addressId: addressId.trim(),
              clientTransactionId: transactionId,
              paymentProvider: 'PAYPHONE',
              ...(isValidUUID(paymentMethodId) ? { paymentMethodId } : {}),
              payphoneData: payphoneDataForLink,
            })
            onSuccess?.()
          }
        } catch (backendError) {
          console.error(
            '[useButtonPayPhoneLinkHook] Error al crear transacción/orden en backend:',
            backendError,
          )
          // Las mutations ya manejan sonnerResponse en onError
        }
      }
    } catch (e) {
      console.error('Error al generar link de pago:', e)
      setShowLinkConfirmationModal(false)
      // useLinkPayphoneMutation ya maneja sonnerResponse en onError
    }
  }

  return {
    showLinkConfirmationModal,
    setShowLinkConfirmationModal,
    isPendingLink,
    handleLinkPayment,
    handleConfirmLinkPayment,
  }
}
