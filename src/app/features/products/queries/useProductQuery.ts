import { useQuery } from '@tanstack/react-query'
import { getProductService } from '../services/getProductService'

export const useProductQuery = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductService(id),
    enabled: !!id,
  })
}

