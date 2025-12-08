import { useQuery } from '@tanstack/react-query'
import { Card, Statistic } from 'antd'
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react'
import { dashboardStatsService } from '@/app/features/dashboard/services/dashboardStatsService'

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardStatsService,
  })

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-medium"></div>
        <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-coffee">
          <Statistic
            title="Ventas Totales"
            value={stats?.totalSales || 0}
            prefix={<DollarSign size={20} className="text-coffee-medium" />}
            valueStyle={{ color: '#8B6F47' }}
            suffix="$"
          />
        </Card>
        <Card className="shadow-coffee">
          <Statistic
            title="Órdenes Totales"
            value={stats?.totalOrders || 0}
            prefix={<ShoppingCart size={20} className="text-coffee-medium" />}
            valueStyle={{ color: '#8B6F47' }}
          />
        </Card>
        <Card className="shadow-coffee">
          <Statistic
            title="Ganancias"
            value={stats?.totalRevenue || 0}
            prefix={<TrendingUp size={20} className="text-coffee-medium" />}
            valueStyle={{ color: '#8B6F47' }}
            suffix="$"
          />
        </Card>
        <Card className="shadow-coffee">
          <Statistic
            title="Productos en Stock"
            value={stats?.totalProducts || 0}
            prefix={<Package size={20} className="text-coffee-medium" />}
            valueStyle={{ color: '#8B6F47' }}
          />
        </Card>
      </div>

      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <Card title="Órdenes Recientes" className="shadow-coffee">
          <div className="space-y-3">
            {stats.recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-coffee-darker">
                    Orden #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-coffee-dark">
                    ${Number(order.total).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
