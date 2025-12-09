import { createFileRoute, useSearch } from '@tanstack/react-router'
import { PayResponsePage } from '@/app/features/payments/PayResponsePage'

export const Route = createFileRoute('/pay-response/')({
  component: () => {
    const search = useSearch({
      strict: false,
    })

    const id = (search as any).id || ''
    const clientTransactionId = (search as any).clientTransactionId || ''

    return <PayResponsePage id={id} clientTransactionId={clientTransactionId} />
  },
})
