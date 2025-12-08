import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const createSubcategoryService = async (
  name: string,
  categoryId: string,
) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.SUBCATEGORIES, {
      name,
      categoryId,
    })
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al crear la subcategoría')
  }
}
