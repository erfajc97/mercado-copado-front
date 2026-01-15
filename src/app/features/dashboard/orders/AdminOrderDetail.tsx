import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, Select } from 'antd'
import { ArrowLeft } from 'lucide-react'
import { useOrderQuery } from '@/app/features/orders/queries/useOrdersQuery'
import { useUpdateOrderStatusMutation } from '@/app/features/orders/mutations/useOrderMutations'
import { useCurrency } from '@/app/hooks/useCurrency'
import { formatUSD } from '@/app/services/currencyService'
import { allStatusOptions, getValidStatusOptions } from './data'

interface AdminOrderDetailProps {
  orderId: string
}

export function AdminOrderDetail({ orderId }: AdminOrderDetailProps) {
  const navigate = useNavigate()
  const { data: order, isLoading, refetch } = useOrderQuery(orderId)
  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatusMutation()
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const { formatPrice, currency } = useCurrency()

  const getStatusLabel = (status: string) => {
    return allStatusOptions.find((opt) => opt.value === status)?.label || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid_pending_review: 'bg-purple-100 text-purple-800',
      shipping: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  const handleStatusChange = async () => {
    if (!selectedStatus) return
    try {
      await updateStatus({ orderId, status: selectedStatus as any })
      await refetch()
      setSelectedStatus('')
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Orden no encontrada
      </div>
    )
  }

  // Obtener opciones válidas según el estado actual
  const validStatusOptions = getValidStatusOptions(order.status)

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <Button
        icon={<ArrowLeft color="white" size={16} />}
        onClick={() => navigate({ to: '/_authenticated/dashboard/orders' })}
        className="mb-4 sm:mb-6 bg-gradient-coffee text-white border-none hover:opacity-90 shadow-coffee hover:shadow-coffee-md"
      >
        <p className="text-white">Volver</p>
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-coffee-darker wrap-break-word">
            Orden #{order.id.slice(0, 8)}
          </h1>
          <span
            className={`inline-block px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${getStatusColor(order.status)}`}
          >
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>

      {validStatusOptions.length > 0 && (
        <div className="mb-6 bg-white rounded-lg shadow-coffee p-6">
          <h2 className="text-xl font-bold mb-4 text-coffee-darker">
            Cambiar Estado de la Orden
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              placeholder="Seleccionar nuevo estado"
              value={selectedStatus || undefined}
              onChange={setSelectedStatus}
              size="large"
              className="flex-1 w-full sm:w-auto"
            >
              {validStatusOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
            <Button
              type="primary"
              onClick={handleStatusChange}
              loading={isUpdating}
              disabled={!selectedStatus || selectedStatus === order.status}
              className="bg-gradient-coffee border-none hover:opacity-90 w-full sm:w-auto"
            >
              Actualizar Estado
            </Button>
          </div>
        </div>
      )}
      {validStatusOptions.length === 0 && (
        <div className="mb-6 bg-white rounded-lg shadow-coffee p-6">
          <h2 className="text-xl font-bold mb-4 text-coffee-darker">
            Estado de la Orden
          </h2>
          <p className="text-gray-600">
            Esta orden está en un estado final y no puede ser modificada.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-coffee p-6">
            <h2 className="text-xl font-bold mb-4 text-coffee-darker">
              Desglose de Productos
            </h2>
            <div className="space-y-4">
              {order.items.map((item: any) => {
                const mainImage =
                  item.product.images && item.product.images.length > 0
                    ? item.product.images[0].url
                    : null
                const itemPrice = Number(item.price)
                const itemTotal = itemPrice * item.quantity
                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-coffee transition-shadow"
                  >
                    {mainImage && (
                      <img
                        src={mainImage}
                        alt={item.product.name}
                        className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg shadow-coffee"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-coffee-darker mb-2 text-base sm:text-lg wrap-break-word">
                        {item.product.name}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Cantidad:
                          </span>
                          <span className="bg-coffee-medium text-white px-3 py-1 rounded-full text-sm font-bold">
                            x{item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-gray-600">
                            Precio unitario:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-coffee-dark">
                              {formatUSD(itemPrice)}
                            </span>
                            {currency === 'ARS' && (
                              <span className="text-xs font-semibold text-coffee-medium">
                                / {formatPrice(itemPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        {item.product.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {item.product.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex flex-row sm:flex-col justify-between sm:justify-start">
                      <div>
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-lg sm:text-xl font-bold text-coffee-darker">
                            {formatUSD(itemTotal)}
                          </p>
                          {currency === 'ARS' && (
                            <p className="text-sm font-semibold text-coffee-medium">
                              {formatPrice(itemTotal)}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">Subtotal</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-coffee p-6">
            <h2 className="text-xl font-bold mb-4 text-coffee-darker">
              Dirección de Envío
            </h2>
            <div className="space-y-2">
              <p className="font-semibold text-coffee-darker">
                {order.address.street}
              </p>
              <p className="text-gray-600">
                {order.address.city}, {order.address.state}
              </p>
              <p className="text-gray-600">
                {order.address.zipCode}, {order.address.country}
              </p>
              {order.address.reference && (
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Referencia:</strong> {order.address.reference}
                </p>
              )}
            </div>
          </div>

          {order.depositImageUrl && (
            <div className="bg-white rounded-lg shadow-coffee p-6">
              <h2 className="text-xl font-bold mb-4 text-coffee-darker">
                Comprobante de Depósito
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">
                    Imagen del comprobante de depósito en efectivo:
                  </p>
                  <div className="flex justify-center">
                    <img
                      src={order.depositImageUrl}
                      alt="Comprobante de depósito"
                      className="max-w-full h-auto rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() =>
                        window.open(order.depositImageUrl, '_blank')
                      }
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Haz clic en la imagen para verla en tamaño completo
                  </p>
                </div>
              </div>
            </div>
          )}

          {order.payments && order.payments.length > 0 && (
            <div className="bg-white rounded-lg shadow-coffee p-6">
              <h2 className="text-xl font-bold mb-4 text-coffee-darker">
                Detalles de Pago
              </h2>
              <div className="space-y-4">
                {order.payments.map((payment: any) => (
                  <div
                    key={payment.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-coffee-darker">
                          Transacción #
                          {payment.clientTransactionId?.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Estado: {payment.status}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-lg font-bold text-coffee-dark">
                          {formatUSD(Number(payment.amount))}
                        </span>
                        {currency === 'ARS' && (
                          <span className="text-sm font-semibold text-coffee-medium">
                            {formatPrice(Number(payment.amount))}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-coffee p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4 text-coffee-darker">
              Resumen de Orden
            </h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <div className="flex flex-col items-end">
                  <span>{formatUSD(Number(order.total))}</span>
                  {currency === 'ARS' && (
                    <span className="text-xs text-gray-500">
                      {formatPrice(Number(order.total))}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t border-gray-200">
                <span className="text-coffee-darker">Total:</span>
                <div className="flex flex-col items-end">
                  <span className="text-coffee-dark">
                    {formatUSD(Number(order.total))}
                  </span>
                  {currency === 'ARS' && (
                    <span className="text-sm font-semibold text-coffee-medium">
                      {formatPrice(Number(order.total))}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Cliente:</p>
              <p className="text-sm font-medium text-coffee-darker">
                {order.user?.firstName} {order.user?.lastName || ''}
              </p>
              <p className="text-xs text-gray-500">{order.user?.email}</p>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Fecha de creación:</p>
              <p className="text-sm font-medium text-coffee-darker">
                {new Date(order.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
