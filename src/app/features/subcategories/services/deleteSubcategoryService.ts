import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const deleteSubcategoryService = async (subcategoryId: string) => {
  try {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.SUBCATEGORY}/${subcategoryId}`,
    )
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error al eliminar la subcategoría')
  }
}

