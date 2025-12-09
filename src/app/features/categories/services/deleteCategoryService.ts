import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const deleteCategoryService = async (categoryId: string) => {
  try {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.CATEGORY}/${categoryId}`,
    )
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error al eliminar la categoría')
  }
}

