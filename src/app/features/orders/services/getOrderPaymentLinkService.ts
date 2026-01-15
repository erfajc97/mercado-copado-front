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
    console.error('Error en getOrderPaymentLinkService:', error)
    
    if (error instanceof AxiosError) {
      // Si hay una respuesta del servidor, usar su mensaje
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      // Si no hay respuesta, podría ser un error de red o CORS
      if (error.request && !error.response) {
        throw new Error(
          'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.',
        )
      }
      
      // Si hay un código de estado, incluir información adicional
      if (error.response?.status) {
        throw new Error(
          `Error ${error.response.status}: ${error.response.data?.message || 'Error al obtener el link de pago'}`,
        )
      }
    }

    throw new Error(
      'Ocurrió un error desconocido al obtener el link de pago de la orden',
    )
  }
}
