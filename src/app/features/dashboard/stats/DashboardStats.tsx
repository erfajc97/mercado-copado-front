import { useQuery } from '@tanstack/react-query'
import { Card, Statistic, Table } from 'antd'
import { Link } from '@tanstack/react-router'
import {
  Clock,
  DollarSign,
  Eye,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import { dashboardStatsService } from '@/app/features/dashboard/services/dashboardStatsService'
import { formatUSD, getDolarBlueRate } from '@/app/services/currencyService'
import { useAllOrdersQuery } from '@/app/features/orders/queries/useOrdersQuery'

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardStatsService,
  })

  const { data: blueRate } = useQuery({
    queryKey: ['dolarBlueRate'],
    queryFn: getDolarBlueRate,
    staleTime: 60 * 60 * 1000, // Cache por 1 hora
    refetchInterval: 60 * 60 * 1000, // Refrescar cada hora
  })

  const { data: recentOrdersData } = useAllOrdersQuery({
    page: 1,
    limit: 5,
  })

  // Extraer órdenes recientes
  const recentOrders = Array.isArray(recentOrdersData)
    ? recentOrdersData
    : recentOrdersData?.content || []

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendiente',
      created: 'Creada',
      processing: 'Procesando',
      shipping: 'En Envío',
      completed: 'Completada',
      delivered: 'Entregada',
      cancelled: 'Cancelada',
      paid_pending_review: 'Procesando Pago',
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      created: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipping: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      paid_pending_review: 'bg-purple-100 text-purple-800',
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  const columns: ColumnsType<any> = [
    {
      title: 'ID Orden',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Link
          to="/admin/orders/$orderId"
          params={{ orderId: id }}
          className="text-coffee-medium hover:text-coffee-darker font-semibold"
        >
          #{id.slice(0, 8)}
        </Link>
      ),
    },
    {
      title: 'Usuario',
      dataIndex: ['user', 'email'],
      key: 'user',
      render: (email: string) => email || 'N/A',
    },
    {
      title: 'Fecha',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) =>
        new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <span className="font-semibold text-green-600">
          {formatUSD(Number(total))}
        </span>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}
        >
          {getStatusLabel(status)}
        </span>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-medium"></div>
        <p className="mt-4 text-coffee-darker">Cargando estadísticas...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cards de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <Statistic
            title="Total de Productos"
            value={stats?.totalProducts || 0}
            prefix={<Package className="text-blue-500" size={24} />}
            valueStyle={{ color: '#3b82f6' }}
          />
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <Statistic
            title="Total de Usuarios"
            value={stats?.totalUsers || 0}
            prefix={<Users className="text-green-500" size={24} />}
            valueStyle={{ color: '#10b981' }}
          />
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <Statistic
            title="Total de Órdenes"
            value={stats?.totalOrders || 0}
            prefix={<ShoppingCart className="text-purple-500" size={24} />}
            valueStyle={{ color: '#a855f7' }}
          />
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
          <Statistic
            title="Ingresos Totales"
            value={stats?.totalRevenue || 0}
            prefix={<DollarSign className="text-yellow-500" size={24} />}
            valueStyle={{ color: '#eab308' }}
            precision={2}
          />
        </Card>
      </div>

      {/* Tasa de Dólar Blue y métricas adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {blueRate && (
          <Card className="shadow-md border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-coffee-darker mb-2">
                  Tasa de Dólar Blue
                </h3>
                <p className="text-sm text-gray-600">
                  <Clock size={14} className="inline mr-1" />
                  {new Date().toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-green-500" size={24} />
                  <span className="text-3xl font-bold text-coffee-darker">
                    ${blueRate.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card
          className="shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500"
          onClick={() =>
            (window.location.href = '/_authenticated/dashboard/products')
          }
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-coffee-darker mb-2">
                Productos Activos
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats?.activeProducts || 0}
              </p>
            </div>
            <Eye className="text-blue-500" size={32} />
          </div>
        </Card>

        <Card
          className="shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500"
          onClick={() =>
            (window.location.href = '/_authenticated/dashboard/orders')
          }
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-coffee-darker mb-2">
                Órdenes Pendientes
              </h3>
              <p className="text-3xl font-bold text-orange-600">
                {stats?.pendingOrders || 0}
              </p>
            </div>
            <ShoppingCart className="text-orange-500" size={32} />
          </div>
        </Card>
      </div>

      {/* Órdenes Recientes */}
      <Card className="shadow-md">
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
          <Table
            columns={columns}
            dataSource={recentOrders}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No hay órdenes recientes</p>
          </div>
        )}
      </Card>
    </div>
  )
}
