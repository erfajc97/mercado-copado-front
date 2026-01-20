import { useCallback, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getStatusTransactionService } from '@/app/features/payments/services/getStatusTransactionService'
import { useUpdatePaymentStatusMutation } from '@/app/features/payments/mutations/usePaymentMutations'

interface UsePaymentVerificationHookProps {
  orders: Array<{
    id: string
    status: string
    payments?: Array<{
      clientTransactionId?: string
      status: string
      payphoneData?: { paymentId?: string }
    }>
  }>
  currentPage: number
  refetch: () => void
}

export const usePaymentVerificationHook = ({
  orders,
  currentPage,
  refetch,
}: UsePaymentVerificationHookProps) => {
  const queryClient = useQueryClient()
  const { mutateAsync: updatePaymentStatus } = useUpdatePaymentStatusMutation()
  const hasVerifiedRef = useRef(false)
  const refetchRef = useRef(refetch)
  const queryClientRef = useRef(queryClient)

  // Actualizar refs cuando cambian
  useEffect(() => {
    refetchRef.current = refetch
    queryClientRef.current = queryClient
  }, [refetch, queryClient])

  const handleVerifyPaymentStatus = useCallback(
    async (clientTransactionId: string, payment?: any) => {
      if (!clientTransactionId) return false

      try {
        const payphoneDataRaw = payment?.payphoneData
        let paymentId: string | undefined

        if (payphoneDataRaw) {
          if (typeof payphoneDataRaw === 'string') {
            try {
              const parsed = JSON.parse(payphoneDataRaw)
              paymentId = parsed?.paymentId
            } catch {
              // Ignorar error de parsing
            }
          } else if (typeof payphoneDataRaw === 'object' && payphoneDataRaw !== null) {
            paymentId = (payphoneDataRaw as { paymentId?: string }).paymentId
          }
        }

        if (paymentId) {
          return false
        }

        const response = await getStatusTransactionService(
          clientTransactionId,
          undefined,
        )
        const { statusCode } = response

        if (statusCode === 3) {
          await updatePaymentStatus({
            clientTransactionId,
            status: 'completed',
          })
          return true
        }
        return false
      } catch {
        return false
      }
    },
    [updatePaymentStatus],
  )

  // Resetear el ref cuando cambia la página
  useEffect(() => {
    hasVerifiedRef.current = false
  }, [currentPage])

  // Verificar pagos pendientes automáticamente
  useEffect(() => {
    // Asegurar que orders sea un array
    const safeOrders = Array.isArray(orders) ? orders : []

    // Solo verificar una vez al montar el componente o cuando cambian las órdenes
    // Usar una clave única basada en orders.length y currentPage para detectar cambios
    const verificationKey = `${safeOrders.length}-${currentPage}`
    const lastVerificationKey = (hasVerifiedRef as any).lastKey

    if (hasVerifiedRef.current && verificationKey === lastVerificationKey) {
      return
    }

    if (safeOrders.length === 0) {
      hasVerifiedRef.current = true
      ;(hasVerifiedRef as any).lastKey = verificationKey
      return
    }

    // Filtrar órdenes pendientes que tengan payments con clientTransactionId
    const pendingOrders = safeOrders.filter(
      (order: any) =>
        order.status === 'pending' &&
        order.payments &&
        order.payments.length > 0,
    )

    if (pendingOrders.length === 0) {
      hasVerifiedRef.current = true
      return
    }

    // Marcar como verificado inmediatamente para evitar múltiples ejecuciones
    hasVerifiedRef.current = true
    ;(hasVerifiedRef as any).lastKey = verificationKey

    // Verificar cada orden pendiente
    const verifyPromises = pendingOrders.map(async (order: any) => {
      const payment = order.payments.find(
        (p: any) => p.clientTransactionId && p.status === 'pending',
      )

      if (payment?.clientTransactionId) {
        const payphoneDataRaw = payment?.payphoneData
        let hasPaymentId = false

        if (payphoneDataRaw) {
          let parsedData: any = payphoneDataRaw
          if (typeof payphoneDataRaw === 'string') {
            try {
              parsedData = JSON.parse(payphoneDataRaw)
            } catch {
              // Ignorar error de parsing
            }
          }
          hasPaymentId = !!parsedData?.paymentId
        }

        if (!hasPaymentId) {
          return handleVerifyPaymentStatus(payment.clientTransactionId, payment)
        }
        return false
      }
      return false
    })

    Promise.all(verifyPromises)
      .then((results) => {
        const hasUpdates = results.some((updated) => updated === true)
        if (hasUpdates) {
          setTimeout(() => {
            queryClientRef.current.invalidateQueries({
              queryKey: ['orders'],
              exact: false,
            })
            refetchRef.current()
          }, 2000)
        }
      })
      .catch(() => {
        hasVerifiedRef.current = false
      })
  }, [orders.length, currentPage])

  return {
    handleVerifyPaymentStatus,
  }
}
