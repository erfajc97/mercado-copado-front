import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const getRelatedProductsService = async (
  id: string,
  limit?: number,
) => {
  try {
    const url = limit
      ? `${API_ENDPOINTS.PRODUCTS}/related/${id}?limit=${limit}`
      : `${API_ENDPOINTS.PRODUCTS}/related/${id}`
    const response = await axiosInstance.get(url)
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error(
      'Ocurrió un error desconocido al obtener los productos relacionados',
    )
  }
}

