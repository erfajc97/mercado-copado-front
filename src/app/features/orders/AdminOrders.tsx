import { Button } from '@heroui/react'
import { useAdminOrdersHook } from './hooks/useAdminOrdersHook'
import { OrdersTable } from './components/OrdersTable'
import { OrdersFilters } from './components/OrdersFilters'

export function AdminOrders() {
  const {
    orders,
    isLoading,
    page,
    totalPages,
    searchText,
    statusFilter,
    formatDate,
    handleViewOrder,
    handleVerifyOrderPayment,
    handleVerifyAllPendingOrders,
    verifyingOrders,
    setPage,
    handleSearchChange,
    handleStatusFilterChange,
  } = useAdminOrdersHook()

  // Contar órdenes pendientes que se pueden verificar (solo teléfono, no link)
  const pendingOrdersCount = orders.filter((order: any) => {
    if (order.status !== 'pending' || !order.payments) return false

    const hasPendingPayment = order.payments.some(
      (p: any) => p.clientTransactionId && p.status === 'pending',
    )

    if (!hasPendingPayment) return false

    // Verificar si es un pago por link (no se puede verificar manualmente)
    const payment = order.payments.find(
      (p: any) => p.clientTransactionId && p.status === 'pending',
    )

    if (payment?.payphoneData) {
      const payphoneDataRaw = payment.payphoneData
      let isLinkPayment = false

      if (typeof payphoneDataRaw === 'string') {
        try {
          const parsed = JSON.parse(payphoneDataRaw)
          isLinkPayment = !!parsed?.paymentId
        } catch (e) {
          // Ignorar error de parsing
        }
      } else if (typeof payphoneDataRaw === 'object' && payphoneDataRaw !== null) {
        isLinkPayment = !!(payphoneDataRaw as { paymentId?: string }).paymentId
      }

      // Si es un pago por link, no contar para verificación manual
      if (isLinkPayment) return false
    }

    return true
  }).length

  const isVerifyingAny = verifyingOrders.size > 0

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Gestión de Órdenes</h2>
        {pendingOrdersCount > 0 && (
          <Button
            variant="solid"
            color="primary"
            onPress={handleVerifyAllPendingOrders}
            isLoading={isVerifyingAny}
            disabled={isVerifyingAny}
          >
            Verificar todas las pendientes ({pendingOrdersCount})
          </Button>
        )}
      </div>

      <OrdersFilters
        searchText={searchText}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <OrdersTable
        orders={orders}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onViewOrder={handleViewOrder}
        formatDate={formatDate}
        onVerifyOrderPayment={handleVerifyOrderPayment}
        verifyingOrders={verifyingOrders}
      />
    </div>
  )
}
