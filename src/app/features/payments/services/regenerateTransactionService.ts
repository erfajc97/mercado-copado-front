import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'

interface RegenerateTransactionData {
  orderId: string
  paymentProvider?: string
  paymentMethodId?: string
  payphoneData?: Record<string, unknown>
}

export const regenerateTransactionService = async (
  data: RegenerateTransactionData,
) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.REGENERATE_TRANSACTION,
      data,
    )
    return response.data
  } catch (error: unknown) {
    console.error('Error en regenerateTransactionService:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Error al regenerar la transacción')
  }
}
