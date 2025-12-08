import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategoryService } from '../services/createCategoryService'
import type { Category } from '../types'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<Category, Error, string>({
    mutationFn: createCategoryService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      sonnerResponse('Categoría creada exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error al crear la categoría'
      sonnerResponse(message, 'error')
    },
  })
}
