import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const updateCategoryService = async (categoryId: string, name: string) => {
  try {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.CATEGORY}/${categoryId}`,
      { name },
    )
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error al actualizar la categoría')
  }
}

