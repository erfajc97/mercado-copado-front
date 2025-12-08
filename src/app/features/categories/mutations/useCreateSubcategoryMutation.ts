import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSubcategoryService } from '../services/createSubcategoryService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface CreateSubcategoryData {
  name: string
  categoryId: string
}

export const useCreateSubcategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<unknown, Error, CreateSubcategoryData>({
    mutationFn: ({ name, categoryId }) =>
      createSubcategoryService(name, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['subcategories'] })
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al crear la subcategoría'
      sonnerResponse(message, 'error')
    },
  })
}
