import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const removeCartItemService = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.CART_ITEM}/${id}`)
    return response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al eliminar del carrito')
  }
}

