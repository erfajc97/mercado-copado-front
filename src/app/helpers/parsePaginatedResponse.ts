/**
 * Helper genérico para parsear respuestas paginadas del backend
 * Maneja tanto array directo como objeto con {content, pagination}
 */
export interface PaginatedResponse<T> {
  content: Array<T>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const parsePaginatedResponse = <T>(
  data: unknown,
): Array<T> | PaginatedResponse<T> => {
  // Paso 1: Extraer el content del ResponseInterceptor si existe
  // El interceptor envuelve las respuestas en {statusCode, message, content}
  if (
    data &&
    typeof data === 'object' &&
    'content' in data &&
    'statusCode' in data &&
    'message' in data
  ) {
    // Es respuesta del interceptor, extraer el content interno
    data = (data as { content: unknown }).content
  }

  // Paso 2: Si es un array, retornarlo directamente
  if (Array.isArray(data)) {
    return data
  }

  // Paso 3: Si es un objeto con content (estructura paginada)
  if (data && typeof data === 'object' && 'content' in data) {
    const content = Array.isArray(data.content) ? data.content : []
    const pagination = 'pagination' in data && data.pagination ? data.pagination : undefined

    // Si tiene pagination, retornar estructura completa
    if (pagination) {
      return {
        content,
        pagination: pagination as PaginatedResponse<T>['pagination'],
      }
    }

    // Sin pagination, retornar solo el array
    return content
  }

  // Paso 4: Manejar caso especial de usuarios que usa 'users' en lugar de 'content'
  if (data && typeof data === 'object' && 'users' in data) {
    const users = Array.isArray(data.users) ? data.users : []
    const pagination = 'pagination' in data && data.pagination ? data.pagination : undefined

    // Si tiene pagination, retornar estructura normalizada con 'content'
    if (pagination) {
      return {
        content: users,
        pagination: pagination as PaginatedResponse<T>['pagination'],
      }
    }

    // Sin pagination, retornar solo el array
    return users
  }

  // Fallback: retornar array vacío
  return []
}

/**
 * Extrae los items de una respuesta parseada
 * Siempre retorna un array, incluso si hay errores
 */
export const extractItems = <T>(
  response: Array<T> | PaginatedResponse<T> | null | undefined,
): Array<T> => {
  if (!response) {
    return []
  }
  
  if (Array.isArray(response)) {
    return response
  }
  
  if (typeof response === 'object' && 'content' in response) {
    const content = response.content
    if (Array.isArray(content)) {
      return content
    }
  }
  
  // Fallback: retornar array vacío si no se puede extraer
  return []
}

/**
 * Extrae la paginación de una respuesta parseada
 */
export const extractPagination = <T>(
  response: Array<T> | PaginatedResponse<T> | null | undefined,
): PaginatedResponse<T>['pagination'] | undefined => {
  if (!response || Array.isArray(response)) {
    return undefined
  }
  
  if (typeof response === 'object' && 'pagination' in response) {
    return response.pagination
  }
  
  return undefined
}
