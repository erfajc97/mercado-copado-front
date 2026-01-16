import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/app/layout/DashboardLayout'
import { Products } from '@/app/features/products/Products'

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
      <Products />
    </DashboardLayout>
  ),
})
