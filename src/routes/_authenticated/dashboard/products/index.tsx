import { createFileRoute, redirect } from '@tanstack/react-router'
import { ProductsDashboard } from '@/app/features/dashboard/products/ProductsDashboard'
import { DashboardLayout } from '@/app/features/dashboard/DashboardLayout'

export const Route = createFileRoute('/_authenticated/dashboard/products/')({
  beforeLoad: ({ context }) => {
    if (context.auth.roles !== 'ADMIN') {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => (
    <DashboardLayout>
      <ProductsDashboard />
    </DashboardLayout>
  ),
})
