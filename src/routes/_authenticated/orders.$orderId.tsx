import { createFileRoute } from '@tanstack/react-router'
import { OrderDetail } from '@/app/features/orders/OrderDetail'

export const Route = createFileRoute('/_authenticated/orders/$orderId')({
  component: OrderDetailPage,
})

function OrderDetailPage() {
  const { orderId } = Route.useParams()
  return <OrderDetail orderId={orderId} />
}
