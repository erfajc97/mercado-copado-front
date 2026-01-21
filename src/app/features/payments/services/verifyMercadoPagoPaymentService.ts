import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export interface VerifyMercadoPagoPaymentData {
  paymentId: string
  externalReference: string
}

export interface VerifyMercadoPagoPaymentResponse {
  status: string
  updated: boolean
  message?: string
}

/**
 * Servicio para verificar el estado de un pago de Mercado Pago.
 * Se usa cuando el usuario regresa de la redirección de MP.
 */
export const verifyMercadoPagoPaymentService = async (
  data: VerifyMercadoPagoPaymentData,
): Promise<VerifyMercadoPagoPaymentResponse> => {
  try {
    const response = await axiosInstance.post<VerifyMercadoPagoPaymentResponse>(
      API_ENDPOINTS.VERIFY_MERCADOPAGO_PAYMENT,
      data,
    )
    return response.data
  } catch (error: unknown) {
    console.error('Error en verifyMercadoPagoPaymentService:', error)
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Ocurrió un error al verificar el pago de Mercado Pago')
  }
}
