import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/app/layout/DashboardLayout'
import { AdminOrders } from '@/app/features/orders/AdminOrders'

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
      <AdminOrders />
    </DashboardLayout>
  ),
})
