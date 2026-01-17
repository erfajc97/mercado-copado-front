import { AxiosError } from 'axios'
import { parsePaginatedResponse } from '@/app/helpers/parsePaginatedResponse'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

interface GetAllOrdersParams {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export const getAllOrdersService = async (params?: GetAllOrdersParams) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status) queryParams.append('status', params.status)

    const url = params
      ? `${API_ENDPOINTS.ORDERS}?${queryParams.toString()}`
      : API_ENDPOINTS.ORDERS

    const response = await axiosInstance.get(url)
    
    // El interceptor envuelve en {statusCode, message, content}
    // El service retorna {content: [...], pagination: {...}}
    // Entonces response.data = {statusCode: 200, message: 'Success', content: {content: [...], pagination: {...}}}
    // El helper parsePaginatedResponse extrae primero el content del interceptor y luego parsea la paginación
    return parsePaginatedResponse(response.data)
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al obtener las órdenes')
  }
}

