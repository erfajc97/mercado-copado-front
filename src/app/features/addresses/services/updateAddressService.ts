import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

interface UpdateAddressData {
  street?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  reference?: string
  isDefault?: boolean
}

export const updateAddressService = async (
  addressId: string,
  data: UpdateAddressData,
) => {
  try {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.ADDRESS}/${addressId}`,
      data,
    )
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al actualizar la dirección')
  }
}
