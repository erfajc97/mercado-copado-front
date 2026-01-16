import { useQuery } from '@tanstack/react-query'
import { getPaymentMethodsService } from '../services/getPaymentMethodsService'
import type { UseQueryOptions } from '@tanstack/react-query'

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
