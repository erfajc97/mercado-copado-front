import { useOrderQuery } from '../queries/useOrdersQuery'
import { useGetOrderPaymentLinkMutation } from '../mutations/useOrderMutations'
import { useCurrency } from '@/app/hooks/useCurrency'
import { useAuthStore } from '@/app/store/auth/authStore'

interface UseOrderDetailHookProps {
  orderId: string
}

export const useOrderDetailHook = ({ orderId }: UseOrderDetailHookProps) => {
  const { data: order, isLoading } = useOrderQuery(orderId)
  const { formatPrice, currency } = useCurrency()
  const { roles } = useAuthStore()
  const isAdmin = roles === 'ADMIN'
  const { mutateAsync: getPaymentLink, isPending: isGettingPaymentLink } =
    useGetOrderPaymentLinkMutation()

  const handleGetPaymentLink = async () => {
    try {
      await getPaymentLink(orderId)
    } catch (error) {
      console.error('Error al obtener link de pago:', error)
    }
  }

  return {
    order,
    isLoading,
    formatPrice,
    currency,
    isAdmin,
    isGettingPaymentLink,
    handleGetPaymentLink,
  }
}
