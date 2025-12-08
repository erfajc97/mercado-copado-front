import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const logoutService = async () => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGOUT)
    return response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al cerrar sesión')
  }
}

