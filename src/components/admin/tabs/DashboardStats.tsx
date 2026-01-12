import { useQuery } from '@tanstack/react-query'
import { Button, Card, Statistic } from 'antd'
import { Link } from '@tanstack/react-router'
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
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-medium"></div>
        <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
      </div>
    )
  }

  // Filtrar órdenes de la última semana
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const recentOrdersThisWeek =
    stats?.recentOrders?.filter((order: any) => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= oneWeekAgo
    }) || []

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <Card className="shadow-coffee">
          <Statistic
            title="Total de Usuarios"
            value={stats?.totalUsers || 0}
            prefix={<Users size={20} className="text-coffee-medium" />}
            valueStyle={{ color: '#8B6F47' }}
          />
        </Card>
        {blueRate && (
          <Card className="shadow-coffee">
            <Statistic
              title="Dólar Blue"
              value={blueRate}
              prefix={<DollarSign size={20} className="text-coffee-medium" />}
              valueStyle={{ color: '#8B6F47' }}
              suffix="$"
            />
          </Card>
        )}
      </div>

      {recentOrdersThisWeek.length > 0 && (
        <Card
          title="Órdenes Recientes (Última Semana)"
          className="shadow-coffee"
        >
          <div
            className="space-y-3 max-h-96 overflow-y-auto pr-2"
            style={{ scrollbarWidth: 'thin' }}
          >
            {recentOrdersThisWeek.map((order: any) => (
              <div
                key={order.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold text-coffee-darker">
                    Orden #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-bold text-coffee-dark">
                    ${Number(order.total).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{order.status}</p>
                </div>
                <Link
                  to="/admin/orders/$orderId"
                  params={{ orderId: order.id }}
                >
                  <Button
                    type="primary"
                    icon={<Eye size={16} />}
                    size="small"
                    className="bg-gradient-coffee border-none hover:opacity-90"
                  >
                    Ver Detalles
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
