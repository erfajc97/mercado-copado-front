import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/app/layout/DashboardLayout'
import { Dashboard } from '@/app/features/dashboard/Dashboard'

export const Route = createFileRoute('/_authenticated/dashboard/dashboard')({
  beforeLoad: ({ context }) => {
    if (context.auth.roles !== 'ADMIN') {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  ),
})
