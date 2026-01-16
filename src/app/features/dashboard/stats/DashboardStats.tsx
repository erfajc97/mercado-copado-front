import { useQuery } from '@tanstack/react-query'
import { dashboardStatsService } from '../services/dashboardStatsService'
import { StatsCards } from './components/StatsCards'
import { AdditionalStatsCards } from './components/AdditionalStatsCards'
import { RecentOrdersTable } from './components/RecentOrdersTable'
import { getDolarBlueRate } from '@/app/services/currencyService'
import { useAllOrdersQuery } from '@/app/features/orders/queries/useOrdersQuery'

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardStatsService,
  })

  const { data: blueRate } = useQuery({
    queryKey: ['dolarBlueRate'],
    queryFn: getDolarBlueRate,
    staleTime: 60 * 60 * 1000,
    refetchInterval: 60 * 60 * 1000,
  })

  const { data: recentOrdersData } = useAllOrdersQuery({
    page: 1,
    limit: 5,
  })

  // Asegurar que recentOrders siempre sea un array
  const recentOrders = Array.isArray(recentOrdersData)
    ? recentOrdersData
    : Array.isArray(recentOrdersData?.content)
      ? recentOrdersData.content
      : []

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
      <StatsCards stats={stats} />
      <AdditionalStatsCards blueRate={blueRate} stats={stats} />
      <RecentOrdersTable recentOrders={recentOrders} />
    </div>
  )
}
