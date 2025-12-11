import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'

interface CreateOrderFromTransactionData {
  clientTransactionId: string
  initialStatus?: 'pending' | 'created' | 'processing'
}

export const createOrderFromTransactionService = async (
  data: CreateOrderFromTransactionData,
) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.CREATE_ORDER_FROM_TRANSACTION,
    data,
  )
  return response.data.content
}

