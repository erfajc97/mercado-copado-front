import { createFileRoute, redirect } from '@tanstack/react-router'
import { OrdersDashboard } from '@/app/features/dashboard/orders/OrdersDashboard'
import { useAuthStore } from '@/app/store/auth/authStore'

export const Route = createFileRoute('/_authenticated/dashboard/orders/')({
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
  component: OrdersDashboard,
})
