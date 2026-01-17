import { Link } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useOrdersHook } from './hooks/useOrdersHook'
import { OrderCard } from './components/OrderCard'
import { OrderProductsModal } from './components/OrderProductsModal'
import CustomPagination from '@/components/UI/table-nextui/CustomPagination'
import { PaymentRetryModal } from '@/app/features/payments/components/payphone/components/PaymentRetryModal'

export function Orders() {
  const queryClient = useQueryClient()
  const {
    orders,
    pagination,
    isLoading,
    selectedOrder,
    isModalOpen,
    selectedOrderForPayment,
    isPaymentRetryModalOpen,
    addresses,
    paymentMethods,
    formatPrice,
    currency,
    isAdmin,
    handleViewProducts,
    handleCloseModal,
    handlePayNow,
    handleClosePaymentRetryModal,
    handlePageChange,
    checkPaymentButtonDisabled,
    getPaymentButtonTextForOrder,
    refetch,
  } = useOrdersHook()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-medium"></div>
        <p className="mt-4 text-coffee-darker">Cargando órdenes...</p>
      </div>
    )
  }

  // Asegurar que orders sea un array antes de verificar
  const safeOrders = Array.isArray(orders) ? orders : []

  if (safeOrders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No tienes órdenes</h1>
        <p className="text-gray-600 mb-6">
          Aún no has realizado ninguna compra
        </p>
        <Link
          to="/"
          className="inline-block bg-gradient-coffee text-white px-6 py-2 rounded-lg hover:opacity-90 shadow-coffee hover:shadow-coffee-md transition-all duration-200 font-semibold"
        >
          Ver Productos
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Órdenes</h1>
      <div className="space-y-4">
        {safeOrders.map((order: any) => (
          <OrderCard
            key={order.id}
            order={order}
            isAdmin={isAdmin}
            formatPrice={formatPrice}
            currency={currency}
            onViewProducts={handleViewProducts}
            onPayNow={handlePayNow}
            isPaymentButtonDisabled={checkPaymentButtonDisabled}
            getPaymentButtonText={getPaymentButtonTextForOrder}
          />
        ))}
      </div>

      <OrderProductsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
        isAdmin={isAdmin}
        formatPrice={formatPrice}
        currency={currency}
      />

      <CustomPagination
        page={pagination?.page || 1}
        pages={pagination?.totalPages || 1}
        setPage={handlePageChange}
        isLoading={isLoading}
      />

      {/* Modal de retry de pago */}
      {selectedOrderForPayment && (
        <PaymentRetryModal
          open={isPaymentRetryModalOpen}
          onCancel={handleClosePaymentRetryModal}
          orderId={selectedOrderForPayment.id}
          orderAmount={Number(selectedOrderForPayment.total)}
          addressId={selectedOrderForPayment.addressId}
          paymentMethodId={
            selectedOrderForPayment.payments?.[0]?.paymentMethodId
          }
          addresses={addresses}
          paymentMethods={paymentMethods}
          onSuccess={() => {
            refetch()
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            queryClient.invalidateQueries({ queryKey: ['orders', 'all'] })
            queryClient.invalidateQueries({ queryKey: ['orders', 'my-orders'] })
          }}
        />
      )}
    </div>
  )
}
