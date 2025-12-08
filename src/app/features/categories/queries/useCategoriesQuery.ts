import { useQuery } from '@tanstack/react-query'
import { getAllCategoriesService } from '../services/getAllCategoriesService'

export const useAllCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getAllCategoriesService(),
  })
}

