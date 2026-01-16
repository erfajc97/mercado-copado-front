import { createFileRoute } from '@tanstack/react-router'
import { PaymentPage } from '@/app/features/payments/PaymentPage'

export const Route = createFileRoute('/payment/$transactionId')({
  component: PaymentPageRoute,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      paymentLink: (search.paymentLink as string) || '',
      paymentId: (search.paymentId as string) || '',
    }
  },
})

function PaymentPageRoute() {
  const { transactionId } = Route.useParams()
  const { paymentLink, paymentId } = Route.useSearch()
  return (
    <PaymentPage
      transactionId={transactionId}
      paymentLink={paymentLink}
      paymentId={paymentId}
    />
  )
}
