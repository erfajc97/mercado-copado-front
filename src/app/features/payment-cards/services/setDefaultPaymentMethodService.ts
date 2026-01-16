import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const setDefaultPaymentMethodService = async (
  paymentMethodId: string,
) => {
  try {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.PAYMENT_METHOD_BY_ID}/${paymentMethodId}/set-default`,
    )
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error(
      'Ocurrió un error desconocido al establecer el método de pago por defecto',
    )
  }
}
