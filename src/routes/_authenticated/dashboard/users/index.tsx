import { createFileRoute, redirect } from '@tanstack/react-router'
import { UsersDashboard } from '@/app/features/dashboard/users/UsersDashboard'
import { DashboardLayout } from '@/app/features/dashboard/DashboardLayout'

export const Route = createFileRoute('/_authenticated/dashboard/users/')({
  beforeLoad: ({ context }) => {
    if (context.auth.roles !== 'ADMIN') {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => (
    <DashboardLayout>
      <UsersDashboard />
    </DashboardLayout>
  ),
})
