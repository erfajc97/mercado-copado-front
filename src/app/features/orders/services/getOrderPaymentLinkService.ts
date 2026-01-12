import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const getOrderPaymentLinkService = async (orderId: string) => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.ORDER}/${orderId}/payment-link`,
    )
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error(
      'Ocurrió un error desconocido al obtener el link de pago de la orden',
    )
  }
}
