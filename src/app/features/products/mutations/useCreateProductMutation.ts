import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProductService } from '../services/createProductService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface CreateProductData {
  name: string
  description: string
  price: number
  discount?: number
  categoryId: string
  subcategoryId: string
  images?: Array<File>
}

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<unknown, Error, CreateProductData>({
    mutationFn: createProductService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      sonnerResponse('Producto creado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error al crear el producto'
      sonnerResponse(message, 'error')
    },
  })
}
