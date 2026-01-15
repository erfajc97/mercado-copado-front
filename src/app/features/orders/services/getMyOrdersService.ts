import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

interface PaginationParams {
  page?: number
  limit?: number
}

export const getMyOrdersService = async (params?: PaginationParams) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const url = params
      ? `${API_ENDPOINTS.MY_ORDERS}?${queryParams.toString()}`
      : API_ENDPOINTS.MY_ORDERS

    const response = await axiosInstance.get(url)
    // Si viene con paginación, retornar el objeto completo, sino solo el content
    return response.data.content || response.data
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al obtener las órdenes')
  }
}

