import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const updateOrderStatusService = async (
  orderId: string,
  status: string,
) => {
  try {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.ORDER}/${orderId}/status`,
      { status },
    )
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al actualizar el estado')
  }
}
