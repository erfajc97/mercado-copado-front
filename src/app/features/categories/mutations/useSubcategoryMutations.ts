import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSubcategoryService } from '../services/createSubcategoryService'
import { updateSubcategoryService } from '../services/updateSubcategoryService'
import { deleteSubcategoryService } from '../services/deleteSubcategoryService'
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
      sonnerResponse('Subcategoría creada exitosamente', 'success')
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
