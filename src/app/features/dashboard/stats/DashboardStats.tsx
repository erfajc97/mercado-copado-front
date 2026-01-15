import { useQuery } from '@tanstack/react-query'
import { Card, Statistic } from 'antd'
import {
  DollarSign,
  Eye,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react'
import { dashboardStatsService } from '@/app/features/dashboard/services/dashboardStatsService'
import { getDolarBlueRate } from '@/app/services/currencyService'

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <Statistic
            title="Total de Productos"
            value={stats?.totalProducts || 0}
            prefix={<Package className="text-blue-500" size={24} />}
            valueStyle={{ color: '#3b82f6' }}
          />
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <Statistic
            title="Total de Usuarios"
            value={stats?.totalUsers || 0}
            prefix={<Users className="text-green-500" size={24} />}
            valueStyle={{ color: '#10b981' }}
          />
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <Statistic
            title="Total de Órdenes"
            value={stats?.totalOrders || 0}
            prefix={<ShoppingCart className="text-purple-500" size={24} />}
            valueStyle={{ color: '#a855f7' }}
          />
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <Statistic
            title="Ingresos Totales"
            value={stats?.totalRevenue || 0}
            prefix={<DollarSign className="text-yellow-500" size={24} />}
            valueStyle={{ color: '#eab308' }}
            precision={2}
          />
        </Card>
      </div>

      {blueRate && (
        <Card className="shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-coffee-darker mb-2">
                Tasa de Dólar Blue
              </h3>
              <p className="text-gray-600">
                Última actualización: {new Date().toLocaleString('es-ES')}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() =>
            (window.location.href = '/_authenticated/dashboard/products')
          }
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-coffee-darker mb-2">
                Productos Activos
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.activeProducts || 0}
              </p>
            </div>
            <Eye className="text-blue-500" size={32} />
          </div>
        </Card>

        <Card
          className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() =>
            (window.location.href = '/_authenticated/dashboard/orders')
          }
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-coffee-darker mb-2">
                Órdenes Pendientes
              </h3>
              <p className="text-2xl font-bold text-orange-600">
                {stats?.pendingOrders || 0}
              </p>
            </div>
            <ShoppingCart className="text-orange-500" size={32} />
          </div>
        </Card>
      </div>
    </div>
  )
}
