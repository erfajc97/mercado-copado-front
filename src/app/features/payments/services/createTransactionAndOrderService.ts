import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'

interface CreateTransactionAndOrderData {
  addressId: string
  clientTransactionId: string
  paymentProvider?: string
  paymentMethodId?: string
  payphoneData?: Record<string, unknown>
}

export const createTransactionAndOrderService = async (
  data: CreateTransactionAndOrderData,
) => {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.PAYMENTS}/create-transaction-and-order`,
      data,
    )
    return response.data
  } catch (error: unknown) {
    console.error('Error en createTransactionAndOrderService:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Error al crear la transacción y orden')
  }
}
