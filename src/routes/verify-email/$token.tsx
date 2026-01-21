import { createFileRoute } from '@tanstack/react-router'
import { VerifyEmail } from '@/app/features/auth/verify-email/VerifyEmail'

export const Route = createFileRoute('/verify-email/$token')({
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const { token } = Route.useParams()

  return <VerifyEmail token={token} />
}
