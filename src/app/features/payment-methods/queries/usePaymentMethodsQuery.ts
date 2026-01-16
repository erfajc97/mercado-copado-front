import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getPaymentMethodsService } from '../services/getPaymentMethodsService'

export const usePaymentMethodsQuery = (
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getPaymentMethodsService>>,
      Error
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: ['paymentMethods'],
    queryFn: getPaymentMethodsService,
    ...options,
  })
}
