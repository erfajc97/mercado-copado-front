import { useQuery } from '@tanstack/react-query'
import { getProductService } from '../services/getProductService'
import type { UseQueryOptions } from '@tanstack/react-query'

export const useProductQuery = (
  id: string,
  options?: Omit<UseQueryOptions<unknown, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductService(id),
    enabled: !!id,
    ...options,
  })
}
