import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/app/features/dashboard/DashboardLayout'

export const Route = createFileRoute('/_authenticated/dashboard/dashboard')({
  beforeLoad: ({ context }) => {
    if (context.auth.roles !== 'ADMIN') {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => <DashboardLayout children={<Outlet />} />,
})
