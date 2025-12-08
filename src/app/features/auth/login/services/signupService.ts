import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const signupService = async (body: {
  email: string
  password: string
  firstName: string
  lastName?: string
}) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, body)
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al registrarse')
  }
}

