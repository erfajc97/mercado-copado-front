import { useQuery } from '@tanstack/react-query'
import { getRelatedProductsService } from '../services/getRelatedProductsService'

export const useRelatedProductsQuery = (id: string, limit?: number) => {
  return useQuery({
    queryKey: ['relatedProducts', id, limit],
    queryFn: () => getRelatedProductsService(id, limit),
    enabled: !!id,
  })
}

