import { createFileRoute, Link } from '@tanstack/react-router'
import { useMyOrdersQuery } from '@/app/features/orders/queries/useOrdersQuery'

export const Route = createFileRoute('/orders')({
  component: Orders,
})

function Orders() {
  const { data: orders, isLoading } = useMyOrdersQuery()

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
          <Link
            key={order.id}
            to="/orders/$orderId"
            params={{ orderId: order.id }}
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
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
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  ${Number(order.total).toFixed(2)}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                    order.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.status === 'completed'
                    ? 'Completada'
                    : order.status === 'processing'
                      ? 'Procesando'
                      : order.status === 'cancelled'
                        ? 'Cancelada'
                        : 'Pendiente'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
