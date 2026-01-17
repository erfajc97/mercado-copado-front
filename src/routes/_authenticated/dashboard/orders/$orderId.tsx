import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminOrderDetail } from '@/app/features/dashboard/orders/AdminOrderDetail'

export const Route = createFileRoute(
  '/_authenticated/dashboard/orders/$orderId',
)({ beforeLoad: ({ context }) => {
    if (context.auth.roles !== 'ADMIN') {
      throw redirect({
        to: '/',
      })
    }
  },
  component: AdminOrderDetailPage,
})

function AdminOrderDetailPage() {
  const { orderId } = Route.useParams()
  return <AdminOrderDetail orderId={orderId} />
}
