import { useQuery } from '@tanstack/react-query'
import { getAllProductsService } from '../services/getAllProductsService'
import type { ProductFilters } from '../types'

export const useProductsQuery = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getAllProductsService(filters),
  })
}

