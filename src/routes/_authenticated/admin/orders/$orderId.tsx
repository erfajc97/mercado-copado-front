import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminOrderDetail } from '@/app/features/dashboard/orders/AdminOrderDetail'
import { useAuthStore } from '@/app/store/auth/authStore'

export const Route = createFileRoute('/_authenticated/admin/orders/$orderId')({
  beforeLoad: ({ context }) => {
    // Intentar usar context.auth primero, si no está disponible leer del store
    const auth = context.auth
    let roles: string
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (auth?.roles) {
      roles = auth.roles
    } else {
      // Fallback: leer directamente del store
      const store = useAuthStore.getState()
      roles = store.roles || ''
    }
    // Verificar que el rol sea ADMIN (la autenticación ya está verificada por el layout padre)
    const normalizedRole = String(roles || '')
      .toUpperCase()
      .trim()
    if (normalizedRole !== 'ADMIN') {
      throw redirect({
        to: '/',
      })
    }
  },
  component: AdminOrderDetailPage,
})

function AdminOrderDetailPage() {
  const { orderId } = Route.useParams()
  return <AdminOrderDetail orderId={orderId} />
}
