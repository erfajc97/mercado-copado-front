import { createFileRoute } from '@tanstack/react-router'
import AdminUsers from '@/components/admin/tabs/AdminUsers'

export const Route = createFileRoute('/dashboard/users')({
  component: DashboardUsers,
})

function DashboardUsers() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>
      <AdminUsers />
    </div>
  )
}
