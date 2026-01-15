import { createFileRoute, redirect } from '@tanstack/react-router'
import { Orders } from '@/app/features/orders/Orders'
import { useAuthStore } from '@/app/store/auth/authStore'

export const Route = createFileRoute('/orders')({
  beforeLoad: () => {
    const { token } = useAuthStore.getState()
    if (!token) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Orders,
})
