import { Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Modal } from 'antd'
import { Eye, Package } from 'lucide-react'
import { useMyOrdersQuery } from '@/app/features/orders/queries/useOrdersQuery'
import { useCurrency } from '@/app/hooks/useCurrency'
import { formatUSD } from '@/app/services/currencyService'
import { useAuthStore } from '@/app/store/auth/authStore'
import { getStatusTransactionService } from '@/app/features/payments/services/getStatusTransactionService'
import { useUpdatePaymentStatusMutation } from '@/app/features/payments/mutations/usePaymentMutations'
import { PaymentRetryModal } from '@/app/components/payphone/components/PaymentRetryModal'
import { getAddressesService } from '@/app/features/addresses/services/getAddressesService'
import { getPaymentMethodsService } from '@/app/features/payment-methods/services/getPaymentMethodsService'

export function Orders() {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const [currentTime, setCurrentTime] = useState(Date.now())
  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useMyOrdersQuery({
    page: currentPage,
    limit: pageSize,
  })
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrderForPayment, setSelectedOrderForPayment] =
    useState<any>(null)
  const [isPaymentRetryModalOpen, setIsPaymentRetryModalOpen] = useState(false)
  const { formatPrice, currency } = useCurrency()
  const { roles } = useAuthStore()
  const isAdmin = roles === 'ADMIN'
  const { mutateAsync: updatePaymentStatus } = useUpdatePaymentStatusMutation()
  const queryClient = useQueryClient()
  const hasVerifiedRef = useRef(false)

  // Actualizar el tiempo cada segundo para el countdown en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Obtener direcciones y métodos de pago para el modal de retry
  const { data: addresses = [] } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddressesService,
  })

  const { data: paymentMethods = [] } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: getPaymentMethodsService,
  })

  // Extraer órdenes y paginación de la respuesta
  const orders = Array.isArray(ordersData)
    ? ordersData
    : ordersData?.content || []
  const pagination = ordersData?.pagination

  // Función para verificar el estado de un pago (usando useCallback para estabilidad)
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

  // Verificar pagos pendientes automáticamente al montar el componente o cambiar de página
  useEffect(() => {
    // Resetear el ref cuando cambia la página
    hasVerifiedRef.current = false
  }, [currentPage])

  useEffect(() => {
    // Solo verificar una vez al montar el componente o cuando cambian las órdenes
    if (hasVerifiedRef.current || !orders || orders.length === 0) {
      return
    }

    // Filtrar órdenes pendientes que tengan payments con clientTransactionId
    const pendingOrders = orders.filter(
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
        return handleVerifyPaymentStatus(
          payment.clientTransactionId,
          payment,
        )
      }
      return false
    })

    // Ejecutar todas las verificaciones
    Promise.all(verifyPromises)
      .then((results) => {
        const hasUpdates = results.some((updated) => updated === true)
        if (hasUpdates) {
          // Refetch órdenes después de actualizar estados (tanto mis órdenes como dashboard)
          queryClient.invalidateQueries({ queryKey: ['orders'] })
          queryClient.invalidateQueries({ queryKey: ['orders', 'all'] })
          refetch()
        }
      })
      .catch((error) => {
        console.error('Error al verificar pagos pendientes:', error)
        // Resetear el ref en caso de error para permitir reintentos
        hasVerifiedRef.current = false
      })
  }, [orders, handleVerifyPaymentStatus, queryClient, refetch])

  const handleViewProducts = (order: any, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  const handlePayNow = (order: any) => {
    setSelectedOrderForPayment(order)
    setIsPaymentRetryModalOpen(true)
  }

  const handleClosePaymentRetryModal = () => {
    setIsPaymentRetryModalOpen(false)
    setSelectedOrderForPayment(null)
  }

  // Calcular si el botón de pago debe estar deshabilitado (cooldown de 2 minutos)
  const isPaymentButtonDisabled = (order: any) => {
    if (!order.createdAt) return true
    const orderCreatedAt = new Date(order.createdAt).getTime()
    const twoMinutesInMs = 2 * 60 * 1000
    const timeSinceCreation = currentTime - orderCreatedAt
    return timeSinceCreation < twoMinutesInMs
  }

  // Obtener el texto del botón de pago (con countdown si está en cooldown)
  const getPaymentButtonText = (order: any) => {
    if (!order.createdAt) return 'Pagar ahora'
    const orderCreatedAt = new Date(order.createdAt).getTime()
    const twoMinutesInMs = 2 * 60 * 1000
    const timeSinceCreation = currentTime - orderCreatedAt
    const remainingTime = twoMinutesInMs - timeSinceCreation

    if (remainingTime > 0) {
      const remainingSeconds = Math.ceil(remainingTime / 1000)
      const minutes = Math.floor(remainingSeconds / 60)
      const seconds = remainingSeconds % 60
      return `Espera ${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    return 'Pagar ahora'
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>
  }

  if (!orders || orders.length === 0) {
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
        {orders.map((order: any) => (
          <div
            key={order.id}
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Link
                  to="/orders/$orderId"
                  params={{ orderId: order.id }}
                  className="block"
                >
                  <h3 className="font-semibold text-lg mb-2">
                    Orden #{order.id.slice(0, 8)}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.items.length} producto(s)
                  </p>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-xl font-bold text-green-600">
                      {isAdmin
                        ? formatUSD(Number(order.total))
                        : formatPrice(Number(order.total))}
                    </p>
                    {isAdmin && currency === 'ARS' && (
                      <p className="text-sm font-semibold text-coffee-medium">
                        {formatPrice(Number(order.total))}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'shipping'
                          ? 'bg-indigo-100 text-indigo-800'
                          : order.status === 'paid_pending_review'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status === 'completed'
                      ? 'Completada'
                      : order.status === 'shipping'
                        ? 'En Envío'
                        : order.status === 'paid_pending_review'
                          ? 'Procesando Pago'
                          : order.status === 'cancelled'
                            ? 'Cancelada'
                            : 'Pendiente'}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="primary"
                    icon={<Eye size={16} />}
                    onClick={(e) => handleViewProducts(order, e)}
                    className="bg-gradient-coffee border-none hover:opacity-90"
                  >
                    Ver Productos
                  </Button>
                  {order.status === 'pending' && (
                    <Button
                      type="default"
                      onClick={() => handlePayNow(order)}
                      disabled={isPaymentButtonDisabled(order)}
                      className="border-2 border-coffee-medium text-coffee-dark hover:bg-coffee-light"
                    >
                      {getPaymentButtonText(order)}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <Package size={20} className="text-coffee-dark" />
            <span className="text-coffee-darker font-bold text-lg">
              Productos de la Orden #{selectedOrder?.id.slice(0, 8)}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key="close"
            onClick={handleCloseModal}
            type="primary"
            className="bg-gradient-coffee border-none hover:opacity-90 shadow-coffee hover:shadow-coffee-md"
            size="large"
          >
            Cerrar
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {selectedOrder.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-coffee-medium hover:shadow-coffee transition-all duration-200"
                >
                  {item.product?.images?.[0]?.url && (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-coffee-darker mb-2">
                      {item.product?.name || 'Producto eliminado'}
                    </h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Cantidad:</span>{' '}
                        <span className="bg-coffee-light text-coffee-darker px-2 py-1 rounded font-bold">
                          {item.quantity}
                        </span>
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-600 font-semibold">
                          Precio unitario:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-coffee-dark font-bold">
                            {isAdmin
                              ? formatUSD(Number(item.price))
                              : formatPrice(Number(item.price))}
                          </span>
                          {isAdmin && currency === 'ARS' && (
                            <span className="text-sm font-semibold text-coffee-medium">
                              / {formatPrice(Number(item.price))}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <p className="font-bold text-xl text-coffee-darker">
                        {isAdmin
                          ? formatUSD(Number(item.price) * item.quantity)
                          : formatPrice(Number(item.price) * item.quantity)}
                      </p>
                      {isAdmin && currency === 'ARS' && (
                        <p className="text-sm font-semibold text-coffee-medium">
                          {formatPrice(Number(item.price) * item.quantity)}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Subtotal</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-coffee-medium pt-4 mt-4 bg-linear-to-r from-coffee-light/20 to-white rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-coffee-darker">
                  Total:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-coffee-dark">
                    {isAdmin
                      ? formatUSD(Number(selectedOrder.total))
                      : formatPrice(Number(selectedOrder.total))}
                  </span>
                  {isAdmin && currency === 'ARS' && (
                    <span className="text-lg font-semibold text-coffee-medium">
                      / {formatPrice(Number(selectedOrder.total))}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isLoading}
            className="bg-gradient-coffee border-none hover:opacity-90 text-white"
          >
            Anterior
          </Button>
          <span className="text-gray-600 px-4">
            Página {pagination.page} de {pagination.totalPages} (
            {pagination.total} órdenes)
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(pagination.totalPages, prev + 1),
              )
            }
            disabled={currentPage === pagination.totalPages || isLoading}
            className="bg-gradient-coffee border-none hover:opacity-90 text-white"
          >
            Siguiente
          </Button>
        </div>
      )}

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
          }}
        />
      )}
    </div>
  )
}
