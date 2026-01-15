import { createFileRoute, redirect } from '@tanstack/react-router'
import DashboardStats from '@/app/features/dashboard/stats/DashboardStats'

export const Route = createFileRoute('/_authenticated/dashboard/dashboard')({
  beforeLoad: ({ context }) => {
    if (context.auth.roles !== 'ADMIN') {
      throw redirect({
        to: '/',
      })
    }
  },
  component: DashboardStats,
})
