import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

interface UpdateProductData {
  name?: string
  description?: string
  price?: number
  discount?: number
  categoryId?: string
  subcategoryId?: string
  country?: string
  isActive?: boolean
}

export const updateProductService = async (
  productId: string,
  data: UpdateProductData,
  files?: Array<File>,
) => {
  try {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      const value = data[key as keyof UpdateProductData]
      if (value !== undefined) {
        // Para booleanos, asegurar que se envíe como string "true" o "false"
        if (typeof value === 'boolean') {
          formData.append(key, value ? 'true' : 'false')
        } else {
          formData.append(key, String(value))
        }
      }
    })

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('images', file)
      })
    }

    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.PRODUCT}/${productId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data.content
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error al actualizar el producto')
  }
}
