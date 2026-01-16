import { Clock, Eye, ShoppingCart, TrendingUp } from 'lucide-react'

interface AdditionalStatsCardsProps {
  blueRate?: number
  stats: {
    activeProducts?: number
    pendingOrders?: number
  } | undefined
}

export const AdditionalStatsCards = ({
  blueRate,
  stats,
}: AdditionalStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {blueRate && (
        <div className="bg-white rounded-lg shadow-md border-l-4 border-l-green-500 p-6">
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
        </div>
      )}

      <div
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500 p-6"
        onClick={() => (window.location.href = '/dashboard/products')}
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
      </div>

      <div
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500 p-6"
        onClick={() => (window.location.href = '/dashboard/orders')}
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
      </div>
    </div>
  )
}
