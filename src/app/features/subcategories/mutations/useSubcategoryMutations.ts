import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSubcategoryService } from '../services/updateSubcategoryService'
import { deleteSubcategoryService } from '../services/deleteSubcategoryService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useUpdateSubcategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      subcategoryId,
      name,
    }: {
      subcategoryId: string
      name: string
    }) => updateSubcategoryService(subcategoryId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      sonnerResponse('Subcategoría actualizada exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al actualizar la subcategoría'
      sonnerResponse(message, 'error')
    },
  })
}

export const useDeleteSubcategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSubcategoryService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      sonnerResponse('Subcategoría eliminada exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al eliminar la subcategoría'
      sonnerResponse(message, 'error')
    },
  })
}

