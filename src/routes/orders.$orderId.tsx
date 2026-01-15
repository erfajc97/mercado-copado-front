import { createFileRoute, redirect } from '@tanstack/react-router'
import { OrderDetail } from '@/app/features/orders/OrderDetail'
import { useAuthStore } from '@/app/store/auth/authStore'

export const Route = createFileRoute('/orders/$orderId')({
  beforeLoad: () => {
    const { token } = useAuthStore.getState()
    if (!token) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: OrderDetailPage,
})

function OrderDetailPage() {
  const { orderId } = Route.useParams()
  return <OrderDetail orderId={orderId} />
}
