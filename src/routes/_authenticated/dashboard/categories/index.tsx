import { createFileRoute, redirect } from '@tanstack/react-router'
import { CategoriesDashboard } from '@/app/features/dashboard/categories/CategoriesDashboard'
import { DashboardLayout } from '@/app/features/dashboard/DashboardLayout'

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
      <CategoriesDashboard />
    </DashboardLayout>
  ),
})
