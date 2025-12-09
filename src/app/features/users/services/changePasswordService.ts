import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export const changePasswordService = async (data: ChangePasswordData) => {
  try {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.USER_INFO}/password`,
      data,
    )
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al cambiar la contraseña')
  }
}
