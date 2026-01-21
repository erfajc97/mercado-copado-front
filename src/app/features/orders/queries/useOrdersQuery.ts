import { useQuery } from '@tanstack/react-query'
import { getMyOrdersService } from '../services/getMyOrdersService'
import { getOrderService } from '../services/getOrderService'
import { getAllOrdersService } from '../services/getAllOrdersService'

interface UseMyOrdersQueryParams {
  page?: number
  limit?: number
}

export const useMyOrdersQuery = (params?: UseMyOrdersQueryParams) => {
  return useQuery({
    queryKey: ['orders', 'my-orders', params?.page, params?.limit],
    queryFn: () => getMyOrdersService(params),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 30000, // 30 segundos - evita refetches innecesarios
  })
}

export const useOrderQuery = (orderId: string, isAdmin: boolean = false) => {
  return useQuery({
    queryKey: ['order', orderId, isAdmin],
    queryFn: () => getOrderService(orderId, isAdmin),
    enabled: !!orderId,
  })
}

interface UseAllOrdersQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export const useAllOrdersQuery = (params?: UseAllOrdersQueryParams) => {
  return useQuery({
    queryKey: ['orders', 'all', params?.page, params?.limit, params?.search, params?.status],
    queryFn: () => getAllOrdersService(params),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 30000, // 30 segundos - evita refetches innecesarios
  })
}
