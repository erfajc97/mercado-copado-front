import { createFileRoute } from '@tanstack/react-router'
import { Orders } from '@/app/features/orders/Orders'

export const Route = createFileRoute('/_authenticated/orders')({
  component: Orders,
})
