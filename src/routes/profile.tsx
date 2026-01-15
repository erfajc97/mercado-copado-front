import { createFileRoute, redirect } from '@tanstack/react-router'
import { Profile } from '@/app/features/profile/Profile'
import { useAuthStore } from '@/app/store/auth/authStore'

export const Route = createFileRoute('/profile')({
  beforeLoad: () => {
    const { token } = useAuthStore.getState()
    if (!token) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Profile,
})
