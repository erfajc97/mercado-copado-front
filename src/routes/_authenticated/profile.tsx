import { createFileRoute } from '@tanstack/react-router'
import { Profile } from '@/app/features/profile/Profile'

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})
