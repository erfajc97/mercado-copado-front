import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategoryService } from '../services/createCategoryService'
import { updateCategoryService } from '../services/updateCategoryService'
import { deleteCategoryService } from '../services/deleteCategoryService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCategoryService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      sonnerResponse('Categoría creada exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al crear la categoría'
      sonnerResponse(message, 'error')
    },
  })
}

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ categoryId, name }: { categoryId: string; name: string }) =>
      updateCategoryService(categoryId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      sonnerResponse('Categoría actualizada exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al actualizar la categoría'
      sonnerResponse(message, 'error')
    },
  })
}

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategoryService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      sonnerResponse('Categoría eliminada exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al eliminar la categoría'
      sonnerResponse(message, 'error')
    },
  })
}

