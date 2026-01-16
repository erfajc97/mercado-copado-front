import { Link } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'
import { getStatusColor } from '../helpers/getStatusColor'
import { getStatusLabel } from '../helpers/getStatusLabel'
import type { Column } from '@/components/UI/table-nextui/CustomTableNextUi'
import CustomTableNextUi from '@/components/UI/table-nextui/CustomTableNextUi'
import { formatUSD } from '@/app/services/currencyService'

interface RecentOrdersTableProps {
  recentOrders: Array<{
    id: string
    user?: { email?: string }
    createdAt: string
    total: number | string
    status: string
  }>
}

export const RecentOrdersTable = ({ recentOrders }: RecentOrdersTableProps) => {
  const columns: Array<Column> = [
    {
      name: 'ID Orden',
      uid: 'id',
    },
    {
      name: 'Usuario',
      uid: 'user',
    },
    {
      name: 'Fecha',
      uid: 'createdAt',
    },
    {
      name: 'Total',
      uid: 'total',
      align: 'end',
    },
    {
      name: 'Estado',
      uid: 'status',
    },
  ]

  const renderCell = (order: any, columnKey: React.Key) => {
    switch (columnKey) {
      case 'id':
        return (
          <Link
            to="/admin/orders/$orderId"
            params={{ orderId: order.id }}
            className="text-coffee-medium hover:text-coffee-darker font-semibold"
          >
            #{order.id.slice(0, 8)}
          </Link>
        )
      case 'user':
        return order.user?.email || 'N/A'
      case 'createdAt':
        return new Date(order.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      case 'total':
        return (
          <span className="font-semibold text-green-600">
            {formatUSD(Number(order.total))}
          </span>
        )
      case 'status':
        return (
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
          >
            {getStatusLabel(order.status)}
          </span>
        )
      default:
        return null
    }
  }

  const items = recentOrders.map((order: any) => ({
    ...order,
    id: order.id,
  }))

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-coffee-darker">
          Órdenes Recientes
        </h2>
        <Link
          to="/dashboard/orders"
          className="text-coffee-medium hover:text-coffee-darker font-semibold text-sm"
        >
          Ver todas →
        </Link>
      </div>
      {recentOrders.length > 0 ? (
        <CustomTableNextUi
          items={items}
          columns={columns}
          renderCell={renderCell}
          loading={false}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No hay órdenes recientes</p>
        </div>
      )}
    </div>
  )
}
