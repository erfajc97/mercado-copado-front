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

    // Validar que la respuesta tenga la estructura esperada
    if (!response.data) {
      throw new Error(
        'La respuesta del servidor no contiene datos. La orden puede no haberse creado correctamente.',
      )
    }

    // Validar que se haya creado una orden
    if (!response.data.content && !response.data.order) {
      console.warn(
        '[createTransactionAndOrderService] Respuesta recibida pero no contiene orden:',
        response.data,
      )
    }

    return response.data
  } catch (error: unknown) {
    console.error('[createTransactionAndOrderService] Error:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Error al crear la transacción y orden')
  }
}
