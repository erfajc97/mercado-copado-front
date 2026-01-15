import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const forgotPasswordService = async (body: { email: string }) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.FORGOT_PASSWORD,
      body,
    )
    return response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Error al enviar el correo de recuperación')
  }
}
