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

  // Función para verificar el estado de un pago
  const handleVerifyPaymentStatus = useCallback(
    async (clientTransactionId: string, payment?: any) => {
      if (!clientTransactionId) return false

      try {
        // Extraer paymentId de payphoneData si existe (para pagos por link)
        const payphoneData = payment?.payphoneData as
          | { paymentId?: string }
          | null
          | undefined
        const paymentId = payphoneData?.paymentId

        const response = await getStatusTransactionService(
          clientTransactionId,
          paymentId,
        )
        const { statusCode } = response

        if (statusCode === 3) {
          // Pago completado - actualizar estado
          await updatePaymentStatus({
            clientTransactionId,
            status: 'completed',
          })
          return true
        } else {
          // Pago aún pendiente
          console.log(
            `La transacción ${clientTransactionId} aún está pendiente (statusCode: ${statusCode})`,
          )
          return false
        }
      } catch (error) {
        console.error(
          'Error al verificar el estado de la transacción:',
          clientTransactionId,
          error,
        )
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
    if (hasVerifiedRef.current || safeOrders.length === 0) {
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

    // Verificar cada orden pendiente
    const verifyPromises = pendingOrders.map(async (order: any) => {
      const payment = order.payments.find(
        (p: any) => p.clientTransactionId && p.status === 'pending',
      )

      if (payment?.clientTransactionId) {
        return handleVerifyPaymentStatus(payment.clientTransactionId, payment)
      }
      return false
    })

    // Ejecutar todas las verificaciones
    Promise.all(verifyPromises)
      .then((results) => {
        const hasUpdates = results.some((updated) => updated === true)
        if (hasUpdates) {
          // Refetch órdenes después de actualizar estados (tanto mis órdenes como dashboard)
          // Usar setTimeout para evitar loops infinitos y dar tiempo a que se complete la actualización
          setTimeout(() => {
            queryClientRef.current.invalidateQueries({
              queryKey: ['orders'],
              exact: false, // Invalidar todas las variantes de orders
            })
            refetchRef.current()
          }, 2000) // Aumentar a 2 segundos para dar más tiempo
        }
      })
      .catch((error) => {
        console.error('Error al verificar pagos pendientes:', error)
        // Resetear el ref en caso de error para permitir reintentos
        hasVerifiedRef.current = false
      })
    // Dependencias: solo orders.length y currentPage para evitar loops infinitos
    // handleVerifyPaymentStatus es estable (useCallback) y se accede a través del closure
  }, [orders.length, currentPage])

  return {
    handleVerifyPaymentStatus,
  }
}
