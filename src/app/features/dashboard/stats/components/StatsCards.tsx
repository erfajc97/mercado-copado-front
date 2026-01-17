import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalProducts?: number
    totalUsers?: number
    totalOrders?: number
    totalRevenue?: number
  } | undefined
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-500 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Package className="text-blue-500" size={24} />
          <h3 className="text-sm font-medium text-gray-600">
            Total de Productos
          </h3>
        </div>
        <p className="text-3xl font-bold text-blue-600">
          {stats?.totalProducts || 0}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-green-500 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="text-green-500" size={24} />
          <h3 className="text-sm font-medium text-gray-600">
            Total de Usuarios
          </h3>
        </div>
        <p className="text-3xl font-bold text-green-600">
          {stats?.totalUsers || 0}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-purple-500 p-6">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="text-purple-500" size={24} />
          <h3 className="text-sm font-medium text-gray-600">
            Total de Órdenes
          </h3>
        </div>
        <p className="text-3xl font-bold text-purple-600">
          {stats?.totalOrders || 0}
        </p>
        <p className="text-xs text-gray-500 mt-1">Histórico</p>
      </div>

      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500 p-6">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="text-yellow-500" size={24} />
          <h3 className="text-sm font-medium text-gray-600">
            Ingresos Totales
          </h3>
        </div>
        <p className="text-3xl font-bold text-yellow-600">
          {stats?.totalRevenue
            ? new Intl.NumberFormat('es-SV', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(stats.totalRevenue)
            : '$0.00'}
        </p>
        <p className="text-xs text-gray-500 mt-1">Solo órdenes completadas</p>
      </div>
    </div>
  )
}
