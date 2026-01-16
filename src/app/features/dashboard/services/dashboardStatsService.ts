import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const dashboardStatsService = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD_STATS)
    const data = response.data

    // El backend puede retornar response.data directamente o response.data.content
    if (data && typeof data === 'object') {
      // Si tiene content, usar content
      if ('content' in data) {
        return data.content
      }
      // Si tiene data, usar data
      if ('data' in data) {
        return data.data
      }
      // Si es el objeto directamente, retornarlo
      return data
    }

    return {}
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Error al obtener las estadísticas del dashboard')
  }
}
