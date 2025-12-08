import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProductService } from '../services/createProductService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProductService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      sonnerResponse('Producto creado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al crear el producto'
      sonnerResponse(message, 'error')
    },
  })
}

