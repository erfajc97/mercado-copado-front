import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

interface UpdateUserAdminData {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  country?: string
  documentId?: string
}

export const updateUserAdminService = async (
  userId: string,
  data: UpdateUserAdminData,
) => {
  try {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.USERS}/${userId}`,
      data,
    )
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error al actualizar el usuario')
  }
}
