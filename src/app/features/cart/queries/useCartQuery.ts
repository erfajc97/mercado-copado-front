import { useQuery } from '@tanstack/react-query'
import { getCartService } from '../services/getCartService'

export const useCartQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => getCartService(),
    enabled: options?.enabled !== false,
  })
}
