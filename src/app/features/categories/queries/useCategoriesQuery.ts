import { useQuery } from '@tanstack/react-query'
import { getAllCategoriesService } from '../services/getAllCategoriesService'

export const useAllCategoriesQuery = (params?: {
  search?: string
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: ['categories', params?.search, params?.page, params?.limit],
    queryFn: () => getAllCategoriesService(params),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 30000, // 30 segundos
  })
}

