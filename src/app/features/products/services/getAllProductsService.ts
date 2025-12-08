import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const getAllProductsService = async (params?: {
  categoryId?: string
  subcategoryId?: string
  search?: string
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId)
    if (params?.subcategoryId)
      queryParams.append('subcategoryId', params.subcategoryId)
    if (params?.search) queryParams.append('search', params.search)

    const queryString = queryParams.toString()
    const url = queryString
      ? `${API_ENDPOINTS.PRODUCTS}?${queryString}`
      : API_ENDPOINTS.PRODUCTS

    const response = await axiosInstance.get(url)
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al obtener los productos')
  }
}

