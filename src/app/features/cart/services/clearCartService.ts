import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const clearCartService = async () => {
  try {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART)
    return response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error al limpiar el carrito')
  }
}
