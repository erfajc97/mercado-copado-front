import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, Modal } from 'antd'
import { CreditCard, Eye, Package } from 'lucide-react'
import { useMyOrdersQuery } from '@/app/features/orders/queries/useOrdersQuery'
import { useGetOrderPaymentLinkMutation } from '@/app/features/orders/mutations/useOrderMutations'
import { useCurrency } from '@/app/hooks/useCurrency'
import { formatUSD } from '@/app/services/currencyService'
import { useAuthStore } from '@/app/store/auth/authStore'

export const Route = createFileRoute('/orders')({
  component: Orders,
})

function Orders() {
  const { data: orders, isLoading } = useMyOrdersQuery()
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { formatPrice, currency } = useCurrency()
  const { roles } = useAuthStore()
  const isAdmin = roles === 'ADMIN'
  const { mutateAsync: getPaymentLink, isPending: isGettingPaymentLink } =
    useGetOrderPaymentLinkMutation()

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
                  {order.status === 'pending' && (
                    <Button
                      type="primary"
                      icon={<CreditCard size={16} />}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        getPaymentLink(order.id)
                      }}
                      loading={isGettingPaymentLink}
                      className="bg-green-600 border-none hover:bg-green-700"
                    >
                      Pagar Ahora
                    </Button>
                  )}
                  <Button
                    type="primary"
                    icon={<Eye size={16} />}
                    onClick={(e) => handleViewProducts(order, e)}
                    className="bg-gradient-coffee border-none hover:opacity-90"
                  >
                    Ver Productos
                  </Button>
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
    </div>
  )
}
