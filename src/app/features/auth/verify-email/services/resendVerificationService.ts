import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export interface ResendVerificationResponse {
  message: string
  success: boolean
}

/**
 * Reenvía el email de verificación al usuario.
 */
export const resendVerificationService = async (
  email: string,
): Promise<ResendVerificationResponse> => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.RESEND_VERIFICATION_EMAIL,
      { email },
    )
    return {
      message:
        response.data.message || 'Email de verificación enviado exitosamente',
      success: true,
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Error al reenviar el email de verificación')
  }
}
