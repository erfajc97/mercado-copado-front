import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'

interface CreateAddressData {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  reference?: string
  isDefault?: boolean
}

export const createAddressService = async (data: CreateAddressData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ADDRESSES, data)
  return response.data.content
}
