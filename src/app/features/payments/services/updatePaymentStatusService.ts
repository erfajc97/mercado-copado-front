import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

interface UpdatePaymentStatusData {
  clientTransactionId: string
  status: 'pending' | 'completed' | 'failed'
  payphoneData?: Record<string, unknown>
}

export const updatePaymentStatusService = async (
  data: UpdatePaymentStatusData,
) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.UPDATE_TRANSACTION_STATUS,
      data,
    )
    return response.data
  } catch (error: unknown) {
    console.error('Error en updatePaymentStatusService:', error)
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Ocurrió un error al actualizar el estado de la transacción')
  }
}

