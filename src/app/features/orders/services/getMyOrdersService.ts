import { AxiosError } from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import axiosInstance from '@/app/config/axiosConfig'

interface PaginationParams {
  page?: number
  limit?: number
}

export const getMyOrdersService = async (params?: PaginationParams) => {
  try {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const url = params
      ? `${API_ENDPOINTS.MY_ORDERS}?${queryParams.toString()}`
      : API_ENDPOINTS.MY_ORDERS

    const response = await axiosInstance.get(url)
    const data = response.data

    // El backend retorna {statusCode: 200, message: 'Success', content: {...}}
    // Necesitamos extraer el content y verificar su estructura
    let ordersArray: Array<any> = []
    let paginationData: any = null

    if (data && typeof data === 'object' && 'content' in data) {
      const content = data.content

      // Si content es un array, usarlo directamente
      if (Array.isArray(content)) {
        ordersArray = content
        paginationData = data.pagination || data.paginationData
      }
      // Si content es un objeto, buscar el array de órdenes en diferentes propiedades
      else if (content && typeof content === 'object') {
        // Caso 1: content.orders
        if ('orders' in content && Array.isArray(content.orders)) {
          ordersArray = content.orders
          paginationData = content.pagination || data.pagination
        }
        // Caso 2: content.data
        else if ('data' in content && Array.isArray(content.data)) {
          ordersArray = content.data
          paginationData = content.pagination || data.pagination
        }
        // Caso 3: content.content (anidado)
        else if ('content' in content && Array.isArray(content.content)) {
          ordersArray = content.content
          paginationData = content.pagination || data.pagination
        }
        // Caso 4: content.items
        else if (Array.isArray(content.items)) {
          ordersArray = content.items
          paginationData = content.pagination || data.pagination
        }
        // Caso 5: Si content tiene pagination pero no encontramos el array, puede estar en otra propiedad
        else if (content.pagination) {
          // Buscar cualquier propiedad que sea un array
          for (const key in content) {
            if (Array.isArray(content[key]) && key !== 'pagination') {
              ordersArray = content[key]
              paginationData = content.pagination || data.pagination
              break
            }
          }
        }
      }
    } else if (Array.isArray(data)) {
      ordersArray = data
    } else if (
      data &&
      typeof data === 'object' &&
      'data' in data &&
      Array.isArray(data.data)
    ) {
      ordersArray = data.data
      paginationData = data.pagination
    }

    // Construir el resultado con la estructura esperada
    const finalResult = {
      content: ordersArray,
      pagination:
        paginationData ||
        (ordersArray.length > 0
          ? {
              page: params?.page || 1,
              limit: params?.limit || ordersArray.length,
              total: ordersArray.length,
              totalPages: 1,
            }
          : {
              page: params?.page || 1,
              limit: params?.limit || 10,
              total: 0,
              totalPages: 0,
            }),
    }

    return finalResult
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }

    throw new Error('Ocurrió un error desconocido al obtener las órdenes')
  }
}
