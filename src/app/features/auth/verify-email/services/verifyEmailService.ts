import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export interface VerifyEmailResponse {
  message: string
  success: boolean
}

/**
 * Verifica el email del usuario usando el token recibido.
 */
export const verifyEmailService = async (
  token: string,
): Promise<VerifyEmailResponse> => {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.VERIFY_EMAIL}/${token}`,
    )
    return {
      message: response.data.message || 'Email verificado exitosamente',
      success: true,
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Error al verificar el email')
  }
}
