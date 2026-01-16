import { useLocation } from '@tanstack/react-router'

export const useDashboardHook = () => {
  const location = useLocation()

  const isDashboardHome =
    location.pathname === '/dashboard' ||
    location.pathname === '/dashboard/dashboard'

  const isAnyCardSelected =
    location.pathname.startsWith('/dashboard/products') ||
    location.pathname.startsWith('/dashboard/categories') ||
    location.pathname.startsWith('/dashboard/orders') ||
    location.pathname.startsWith('/dashboard/users')

  const shouldShowStats = isDashboardHome || !isAnyCardSelected

  return {
    shouldShowStats,
    isDashboardHome,
  }
}
