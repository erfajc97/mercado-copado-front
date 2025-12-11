import { useQuery } from '@tanstack/react-query'
import { getMyOrdersService } from '../services/getMyOrdersService'
import { getOrderService } from '../services/getOrderService'
import { getAllOrdersService } from '../services/getAllOrdersService'

export const useMyOrdersQuery = () => {
  return useQuery({
    queryKey: ['orders', 'my-orders'],
    queryFn: () => getMyOrdersService(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}

export const useOrderQuery = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderService(orderId),
    enabled: !!orderId,
  })
}

export const useAllOrdersQuery = () => {
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: () => getAllOrdersService(),
  })
}
