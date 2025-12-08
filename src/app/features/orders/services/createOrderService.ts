import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const createOrderService = async (data: { addressId: string }) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDERS, data)
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al crear la orden')
  }
}

