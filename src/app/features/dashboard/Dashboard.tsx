import DashboardStats from './stats/DashboardStats'
import { useDashboardHook } from './hooks/useDashboardHook'

export function Dashboard() {
  const { shouldShowStats } = useDashboardHook()

  return shouldShowStats ? <DashboardStats /> : null
}
