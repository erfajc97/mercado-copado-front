import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/app/layout/DashboardLayout'
import { Users } from '@/app/features/users/Users'

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
      <Users />
    </DashboardLayout>
  ),
})
