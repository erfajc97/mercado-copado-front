import { useQuery } from '@tanstack/react-query'
import { getPaymentMethodsService } from '../services/getPaymentMethodsService'

export const usePaymentMethodsQuery = () => {
  return useQuery({
    queryKey: ['paymentMethods'],
    queryFn: getPaymentMethodsService,
  })
}
