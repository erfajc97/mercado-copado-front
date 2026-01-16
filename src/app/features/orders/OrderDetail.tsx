import { Button } from '@heroui/react'
import { useOrderDetailHook } from './hooks/useOrderDetailHook'
import { getStatusLabel } from './helpers/getStatusLabel'
import { getStatusColor } from './helpers/getStatusColor'
import { formatOrderDateFull } from './helpers/formatOrderDate'
import { formatUSD } from '@/app/services/currencyService'

interface OrderDetailProps {
  orderId: string
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const {
    order,
    isLoading,
    formatPrice,
    currency,
    isAdmin,
    isGettingPaymentLink,
    handleGetPaymentLink,
  } = useOrderDetailHook({ orderId })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-medium"></div>
        <p className="mt-4 text-coffee-darker">Cargando orden...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600">Orden no encontrada</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-coffee-darker">
          Orden #{order.id.slice(0, 8)}
        </h1>
        <span
          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-coffee transition-shadow"
                  >
                    {mainImage && (
                      <img
                        src={mainImage}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg shadow-coffee"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-coffee-darker mb-2 text-lg">
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
                              {isAdmin
                                ? formatUSD(itemPrice)
                                : formatPrice(itemPrice)}
                            </span>
                            {isAdmin && currency === 'ARS' && (
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
                    <div className="text-right flex flex-col justify-between">
                      <div>
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-xl font-bold text-coffee-darker">
                            {isAdmin
                              ? formatUSD(itemTotal)
                              : formatPrice(itemTotal)}
                          </p>
                          {isAdmin && currency === 'ARS' && (
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
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-coffee p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4 text-coffee-darker">
              Resumen de Orden
            </h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <div className="flex items-center gap-2">
                  <span>
                    {isAdmin
                      ? formatUSD(Number(order.total))
                      : formatPrice(Number(order.total))}
                  </span>
                  {isAdmin && currency === 'ARS' && (
                    <span className="text-sm font-semibold text-coffee-medium">
                      / {formatPrice(Number(order.total))}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t border-gray-200">
                <span className="text-coffee-darker">Total:</span>
                <div className="flex items-center gap-2">
                  <span className="text-coffee-dark">
                    {isAdmin
                      ? formatUSD(Number(order.total))
                      : formatPrice(Number(order.total))}
                  </span>
                  {isAdmin && currency === 'ARS' && (
                    <span className="text-base font-semibold text-coffee-medium">
                      / {formatPrice(Number(order.total))}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Estado de la Orden:</p>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>
            {order.status === 'pending' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button
                  color="primary"
                  className="w-full bg-gradient-coffee border-none hover:opacity-90"
                  onPress={handleGetPaymentLink}
                  isLoading={isGettingPaymentLink}
                >
                  Pagar Ahora
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Serás redirigido a la página de pago de Payphone
                </p>
              </div>
            )}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Fecha de creación:</p>
              <p className="text-sm font-medium text-coffee-darker">
                {formatOrderDateFull(order.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
