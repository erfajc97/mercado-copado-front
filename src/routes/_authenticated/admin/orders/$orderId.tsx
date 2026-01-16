import { createFileRoute } from '@tanstack/react-router'
import { AdminOrderDetail } from '@/app/features/dashboard/orders/AdminOrderDetail'

export const Route = createFileRoute('/_authenticated/admin/orders/$orderId')({
  component: AdminOrderDetailPage,
})

function AdminOrderDetailPage() {
  const { orderId } = Route.useParams()
  return <AdminOrderDetail orderId={orderId} />
}
