import { Calendar, CalendarDays, CalendarRange, Clock, DollarSign, Eye, ShoppingCart, TrendingUp } from 'lucide-react'

interface AdditionalStatsCardsProps {
  blueRate?: number
  stats: {
    activeProducts?: number
    pendingOrders?: number
    monthlyRevenue?: Array<{ month: string; revenue: number }>
    ordersToday?: number
    ordersThisMonth?: number
    ordersThisYear?: number
    revenueToday?: number
    revenueThisMonth?: number
    revenueThisYear?: number
  } | undefined
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const AdditionalStatsCards = ({
  blueRate,
  stats,
}: AdditionalStatsCardsProps) => {
  return (
    <div className="space-y-6">
      {/* Segunda fila: Estado actual */}
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

      {/* Tercera fila: Órdenes por período */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-coffee-darker mb-2">
                Órdenes Hoy
              </h3>
              <p className="text-3xl font-bold text-indigo-600">
                {stats?.ordersToday || 0}
              </p>
            </div>
            <Calendar className="text-indigo-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-teal-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-coffee-darker mb-2">
                Órdenes Este Mes
              </h3>
              <p className="text-3xl font-bold text-teal-600">
                {stats?.ordersThisMonth || 0}
              </p>
            </div>
            <CalendarDays className="text-teal-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-cyan-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-coffee-darker mb-2">
                Órdenes Este Año
              </h3>
              <p className="text-3xl font-bold text-cyan-600">
                {stats?.ordersThisYear || 0}
              </p>
            </div>
            <CalendarRange className="text-cyan-500" size={32} />
          </div>
        </div>
      </div>

      {/* Cuarta fila: Ingresos por período (solo órdenes completadas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-coffee-darker mb-2">
                Ingresos Hoy
              </h3>
              <p className="text-2xl font-bold text-emerald-600">
                {stats?.revenueToday
                  ? formatCurrency(stats.revenueToday)
                  : '$0.00'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Solo órdenes completadas
              </p>
            </div>
            <DollarSign className="text-emerald-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-teal-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-coffee-darker mb-2">
                Ingresos Este Mes
              </h3>
              <p className="text-2xl font-bold text-teal-600">
                {stats?.revenueThisMonth
                  ? formatCurrency(stats.revenueThisMonth)
                  : '$0.00'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Solo órdenes completadas
              </p>
            </div>
            <DollarSign className="text-teal-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-amber-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-coffee-darker mb-2">
                Ingresos Este Año
              </h3>
              <p className="text-2xl font-bold text-amber-600">
                {stats?.revenueThisYear
                  ? formatCurrency(stats.revenueThisYear)
                  : '$0.00'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Solo órdenes completadas
              </p>
            </div>
            <DollarSign className="text-amber-500" size={32} />
          </div>
        </div>
      </div>
    </div>
  )
}
