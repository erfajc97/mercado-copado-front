import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getProductService } from '../services/getProductService'

export const useProductQuery = (
  id: string,
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductService(id),
    enabled: !!id,
    ...options,
  })
}

