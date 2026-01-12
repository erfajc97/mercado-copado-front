import { Link, createFileRoute } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { useAllOrdersQuery } from '@/app/features/orders/queries/useOrdersQuery'
import { useCurrency } from '@/app/hooks/useCurrency'
import { formatUSD } from '@/app/services/currencyService'

export const Route = createFileRoute('/dashboard/orders')({
  component: DashboardOrders,
})

function DashboardOrders() {
  const { data: orders, isLoading } = useAllOrdersQuery()
  const { formatPrice, currency } = useCurrency()

  return (
    <div className="p-3 sm:p-6 overflow-x-hidden">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Todas las Órdenes</h2>
      {isLoading ? (
        <div className="text-center py-12">Cargando...</div>
      ) : orders && orders.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order: any) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.user?.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold">{formatUSD(Number(order.total))}</span>
                      {currency === 'ARS' && (
                        <span className="text-xs text-gray-500">
                          {formatPrice(Number(order.total))}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to="/admin/orders/$orderId"
                      params={{ orderId: order.id }}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={16} />
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">No hay órdenes</div>
      )}
    </div>
  )
}
