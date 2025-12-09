import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

interface AdminUsersQueryParams {
  search?: string
  country?: string
  page?: number
  limit?: number
}

export const getAdminUsersService = async (params: AdminUsersQueryParams) => {
  try {
    const queryParams = new URLSearchParams()
    if (params.search) queryParams.append('search', params.search)
    if (params.country) queryParams.append('country', params.country)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())

    const response = await axiosInstance.get(
      `${API_ENDPOINTS.ADMIN_USERS}?${queryParams.toString()}`,
    )
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error(
      'Ocurrió un error desconocido al obtener la lista de usuarios',
    )
  }
}
