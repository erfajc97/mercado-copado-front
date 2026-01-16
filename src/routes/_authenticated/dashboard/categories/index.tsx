import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/app/layout/DashboardLayout'
import { Categories } from '@/app/features/categories/Categories'

export const Route = createFileRoute('/_authenticated/dashboard/categories/')({
  beforeLoad: ({ context }) => {
    if (context.auth.roles !== 'ADMIN') {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => (
    <DashboardLayout>
      <Categories />
    </DashboardLayout>
  ),
})
