import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

interface GetAllOrdersParams {
  page?: number
  limit?: number
}

export const getAllOrdersService = async (params?: GetAllOrdersParams) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const url = params
      ? `${API_ENDPOINTS.ORDERS}?${queryParams.toString()}`
      : API_ENDPOINTS.ORDERS

    console.log('[getAllOrdersService] Llamando a:', url, 'con params:', params)
    const response = await axiosInstance.get(url)
    const data = response.data
    console.log('[getAllOrdersService] Respuesta del backend:', data)

    // Asegurar que siempre retornemos un objeto con content y pagination
    if (Array.isArray(data)) {
      return {
        content: data,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || data.length,
          total: data.length,
          totalPages: 1,
        },
      }
    }

    // Si ya tiene la estructura correcta, retornarlo tal cual
    if (data && typeof data === 'object' && 'content' in data) {
      return data
    }

    // Fallback: retornar estructura vacía
    return {
      content: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: 0,
        totalPages: 0,
      },
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al obtener las órdenes')
  }
}

