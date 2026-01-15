import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'
import type { Product } from '../types'

export const getProductService = async (id: string): Promise<Product> => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCT}/${id}`)
    return response.data.content as Product
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al obtener el producto')
  }
}

