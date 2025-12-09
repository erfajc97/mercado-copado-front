import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

interface CreatePaymentMethodData {
  gatewayToken: string
  cardBrand: string
  last4Digits: string
  expirationMonth: number
  expirationYear: number
  isDefault?: boolean
}

export const createPaymentMethodService = async (
  data: CreatePaymentMethodData,
) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PAYMENT_METHODS,
      data,
    )
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al crear el método de pago')
  }
}
