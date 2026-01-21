import { useCallback } from 'react'
import { useCreateTransactionAndOrderMutation } from '../mutations/useCreateTransactionAndOrderMutation'
import { useRegenerateTransactionMutation } from '../mutations/useRegenerateTransactionMutation'
import { generateTransactionId } from '../components/payphone/shared/helpers/generateTransactionId'
import { isValidUUID } from '../components/payphone/shared/helpers/isValidUUID'
import { useCartSyncContext } from '@/app/features/cart/context/CartSyncContext'

export type PaymentProvider = 'PAYPHONE' | 'MERCADOPAGO' | 'CASH_DEPOSIT'

export interface UsePaymentTransactionProps {
  addressId: string
  paymentMethodId?: string
  paymentProvider?: PaymentProvider
  onSuccess?: () => void
  orderId?: string
  clientTransactionId?: string
}

export interface CreateTransactionParams {
  payphoneData?: {
    paymentId?: number
    payWithCard?: string
  }
}

/**
 * Hook compartido para crear/regenerar transacciones de pago.
 * Extrae la lógica común de useButtonPayPhoneLinkHook y useButtonPayPhonePhoneHook.
 */
export const usePaymentTransaction = ({
  addressId,
  paymentMethodId,
  paymentProvider = 'PAYPHONE',
  onSuccess,
  orderId,
  clientTransactionId: propClientTransactionId,
}: UsePaymentTransactionProps) => {
  const { syncAndWait } = useCartSyncContext()
  const { mutateAsync: createTransactionAndOrder, isPending: isCreating } =
    useCreateTransactionAndOrderMutation()
  const { mutateAsync: regenerateTransaction, isPending: isRegenerating } =
    useRegenerateTransactionMutation()

  /**
   * Sincroniza el carrito antes de realizar operaciones de pago.
   */
  const syncCart = useCallback(async () => {
    if (syncAndWait) {
      await syncAndWait()
    }
  }, [syncAndWait])

  /**
   * Genera o usa el clientTransactionId proporcionado.
   */
  const getTransactionId = useCallback(() => {
    if (orderId && propClientTransactionId) {
      return propClientTransactionId
    }
    return generateTransactionId()
  }, [orderId, propClientTransactionId])

  /**
   * Crea o regenera una transacción según si hay orderId.
   */
  const createOrRegenerateTransaction = useCallback(
    async (
      transactionId: string,
      params?: CreateTransactionParams,
    ) => {
      const validPaymentMethodId = isValidUUID(paymentMethodId)
        ? paymentMethodId
        : undefined

      if (orderId) {
        // Regenerar transacción para orden existente
        await regenerateTransaction({
          orderId,
          paymentProvider,
          ...(validPaymentMethodId ? { paymentMethodId: validPaymentMethodId } : {}),
          ...(params?.payphoneData ? { payphoneData: params.payphoneData } : {}),
        })
      } else {
        // Crear nueva transacción + orden
        await createTransactionAndOrder({
          addressId: addressId.trim(),
          clientTransactionId: transactionId,
          paymentProvider,
          ...(validPaymentMethodId ? { paymentMethodId: validPaymentMethodId } : {}),
          ...(params?.payphoneData ? { payphoneData: params.payphoneData } : {}),
        })
      }

      onSuccess?.()
    },
    [
      orderId,
      addressId,
      paymentMethodId,
      paymentProvider,
      createTransactionAndOrder,
      regenerateTransaction,
      onSuccess,
    ],
  )

  /**
   * Ejecuta el flujo completo: sincronizar, generar ID, crear/regenerar transacción.
   */
  const executePaymentFlow = useCallback(
    async (params?: CreateTransactionParams) => {
      await syncCart()
      const transactionId = getTransactionId()
      await createOrRegenerateTransaction(transactionId, params)
      return transactionId
    },
    [syncCart, getTransactionId, createOrRegenerateTransaction],
  )

  return {
    syncCart,
    getTransactionId,
    createOrRegenerateTransaction,
    executePaymentFlow,
    isPending: isCreating || isRegenerating,
    isCreating,
    isRegenerating,
  }
}
