import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

interface UpdateUserProfileData {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  country?: string
  documentId?: string
}

export const updateUserProfileService = async (data: UpdateUserProfileData) => {
  try {
    const response = await axiosInstance.patch(API_ENDPOINTS.USER_INFO, data)
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error(
      'Ocurrió un error desconocido al actualizar el perfil del usuario',
    )
  }
}
