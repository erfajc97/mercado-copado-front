import { createFileRoute, redirect } from '@tanstack/react-router'
import { OrdersDashboard } from '@/app/features/dashboard/orders/OrdersDashboard'
import { DashboardLayout } from '@/app/features/dashboard/DashboardLayout'

export const Route = createFileRoute('/_authenticated/dashboard/orders/')({
  beforeLoad: ({ context }) => {
    if (context.auth.roles !== 'ADMIN') {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => (
    <DashboardLayout>
      <OrdersDashboard />
    </DashboardLayout>
  ),
})
