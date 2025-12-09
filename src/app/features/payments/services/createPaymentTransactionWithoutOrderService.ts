import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

interface CreatePaymentTransactionWithoutOrderData {
  addressId: string
  paymentMethodId: string
  clientTransactionId: string
  paymentProvider?: 'PAYPHONE' | 'MERCADOPAGO' | 'CRYPTO'
}

export const createPaymentTransactionWithoutOrderService = async (
  data: CreatePaymentTransactionWithoutOrderData,
) => {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.PAYMENTS}/create-transaction-without-order`,
      data,
    )
    return response.data
  } catch (error: unknown) {
    console.error('Error en createPaymentTransactionWithoutOrderService:', error)
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Ocurrió un error al crear la transacción de pago')
  }
}

