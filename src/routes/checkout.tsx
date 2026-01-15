import { createFileRoute, redirect } from '@tanstack/react-router'
import { Checkout } from '@/app/features/checkout/Checkout'
import { useAuthStore } from '@/app/store/auth/authStore'

export const Route = createFileRoute('/checkout')({
  beforeLoad: () => {
    const { token } = useAuthStore.getState()
    if (!token) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Checkout,
})
