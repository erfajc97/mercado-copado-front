import { useMemo, useState } from 'react'
import { useAllOrdersQuery } from '../queries/useOrdersQuery'
import { useCurrency } from '@/app/hooks/useCurrency'
import { extractItems, extractPagination } from '@/app/helpers/parsePaginatedResponse'
import { getStatusTransactionService } from '@/app/features/payments/services/getStatusTransactionService'
import { useUpdatePaymentStatusMutation } from '@/app/features/payments/mutations/usePaymentMutations'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

// Tipo para órdenes en la tabla de admin
type OrderData = {
  id: string
  user?: {
    email?: string
    firstName?: string
    lastName?: string
  }
  createdAt: string
  total: number | string
  status: string
  items?: Array<{ quantity?: number }>
  payments?: Array<{
    clientTransactionId?: string
    status: string
    payphoneData?: { paymentId?: string } | string
  }>
}

const pageSize = 10

export const useAdminOrdersHook = () => {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [page, setPage] = useState(1)
  const [verifyingOrders, setVerifyingOrders] = useState<Set<string>>(new Set())
  const { formatPrice, currency } = useCurrency()
  const { mutateAsync: updatePaymentStatus } = useUpdatePaymentStatusMutation()

  const { data: ordersData, isLoading, refetch } = useAllOrdersQuery({
    search: searchText || undefined,
    status: statusFilter || undefined,
    page,
    limit: pageSize,
  })

  const orders = useMemo(() => {
    if (!ordersData) return []
    return extractItems(ordersData) as Array<OrderData>
  }, [ordersData])

  const pagination = useMemo(() => {
    if (!ordersData) return undefined
    return extractPagination(ordersData)
  }, [ordersData])

  const totalPages = pagination?.totalPages || 1

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleViewOrder = (orderId: string) => {
    // Navegar a la página de detalle de la orden
    window.location.href = `/dashboard/orders/${orderId}`
  }

  const handleSearchChange = (value: string) => {
    setSearchText(value)
    setPage(1) // Resetear a la primera página al buscar
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setPage(1) // Resetear a la primera página al filtrar
  }

  // Función para verificar todas las órdenes pendientes de la página actual
  const handleVerifyAllPendingOrders = async () => {
    const pendingOrders = orders.filter(
      (order: any) =>
        order.status === 'pending' &&
        order.payments &&
        order.payments.some(
          (p: any) => p.clientTransactionId && p.status === 'pending',
        ),
    )

    if (pendingOrders.length === 0) {
      return
    }

    // Verificar todas las órdenes pendientes en paralelo
    const verifyPromises = pendingOrders.map((order: any) =>
      handleVerifyOrderPayment(order),
    )

    await Promise.all(verifyPromises)
  }

  // Función para verificar manualmente el estado de un pago
  const handleVerifyOrderPayment = async (order: any) => {
    if (!order.payments || order.payments.length === 0) {
      return
    }

    const payment = order.payments.find(
      (p: any) => p.clientTransactionId && p.status === 'pending',
    )

    if (!payment?.clientTransactionId) {
      return
    }

    // Evitar múltiples verificaciones simultáneas de la misma orden
    if (verifyingOrders.has(order.id)) {
      return
    }

    setVerifyingOrders((prev) => new Set(prev).add(order.id))

    try {
      const payphoneDataRaw = payment?.payphoneData
      let hasPaymentId = false

      if (payphoneDataRaw) {
        if (typeof payphoneDataRaw === 'string') {
          try {
            const parsed = JSON.parse(payphoneDataRaw)
            hasPaymentId = !!parsed?.paymentId
          } catch {
            // Ignorar error de parsing
          }
        } else if (typeof payphoneDataRaw === 'object' && payphoneDataRaw !== null) {
          hasPaymentId = !!(payphoneDataRaw as { paymentId?: string }).paymentId
        }
      }

      if (hasPaymentId) {
        sonnerResponse(
          'Los pagos por link no se pueden verificar manualmente. La verificación se realiza automáticamente cuando el usuario completa el pago.',
          'error',
        )
        return
      }

      const response = await getStatusTransactionService(
        payment.clientTransactionId,
        undefined,
      )

      const { statusCode } = response

      if (statusCode === 3) {
        await updatePaymentStatus({
          clientTransactionId: payment.clientTransactionId,
          status: 'completed',
        })
        refetch()
        sonnerResponse(
          `Pago verificado exitosamente para la orden ${order.id.slice(0, 8)}`,
          'success',
        )
      }
    } catch (error) {
      let errorMessage = 'Error al verificar el pago. Por favor, intenta nuevamente.'

      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase()

        if (
          errorMsg.includes('transacción no existe') ||
          errorMsg.includes('transaction does not exist') ||
          errorMsg.includes('no existe en el sistema de pagos por teléfono')
        ) {
          errorMessage =
            'Esta transacción no se encuentra en el sistema de pagos por teléfono. Es probable que sea un pago por link, el cual se verifica automáticamente cuando el usuario completa el pago.'
        } else {
          errorMessage = error.message
        }
      }

      sonnerResponse(errorMessage, 'error')
    } finally {
      setVerifyingOrders((prev) => {
        const newSet = new Set(prev)
        newSet.delete(order.id)
        return newSet
      })
    }
  }

  return {
    orders,
    isLoading,
    page,
    totalPages,
    searchText,
    statusFilter,
    formatPrice,
    currency,
    formatDate,
    handleViewOrder,
    handleVerifyOrderPayment,
    handleVerifyAllPendingOrders,
    verifyingOrders,
    setPage,
    handleSearchChange,
    handleStatusFilterChange,
  }
}
