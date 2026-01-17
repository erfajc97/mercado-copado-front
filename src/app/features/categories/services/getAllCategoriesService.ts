import { AxiosError } from 'axios'
import { parsePaginatedResponse } from '@/app/helpers/parsePaginatedResponse'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const getAllCategoriesService = async (params?: {
  search?: string
  page?: number
  limit?: number
}) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const queryString = queryParams.toString()
    const url = queryString
      ? `${API_ENDPOINTS.CATEGORIES}?${queryString}`
      : API_ENDPOINTS.CATEGORIES

    const response = await axiosInstance.get(url)
    return parsePaginatedResponse(response.data)
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al obtener las categorías')
  }
}

