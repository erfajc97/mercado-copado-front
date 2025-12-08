import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

export const createProductService = async (data: {
  name: string
  description: string
  price: number
  discount?: number
  categoryId: string
  subcategoryId: string
  images?: Array<File>
}) => {
  try {
    const formData = new FormData()

    // Agregar campos del producto
    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('price', data.price.toString())
    if (data.discount !== undefined) {
      formData.append('discount', data.discount.toString())
    }
    formData.append('categoryId', data.categoryId)
    formData.append('subcategoryId', data.subcategoryId)

    // Agregar imágenes
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image)
      })
    }

    const response = await axiosInstance.post(
      API_ENDPOINTS.PRODUCTS,
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

    throw new Error('Ocurrió un error desconocido al crear el producto')
  }
}
