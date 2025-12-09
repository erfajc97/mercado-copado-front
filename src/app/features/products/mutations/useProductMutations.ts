import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProductService } from '../services/createProductService'
import { deleteProductService } from '../services/deleteProductService'
import { updateProductService } from '../services/updateProductService'
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
        error instanceof Error ? error.message : 'Error al crear el producto'
      sonnerResponse(message, 'error')
    },
  })
}

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      productId,
      data,
      files,
    }: {
      productId: string
      data: any
      files?: Array<File>
    }) => updateProductService(productId, data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      sonnerResponse('Producto actualizado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al actualizar el producto'
      sonnerResponse(message, 'error')
    },
  })
}

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProductService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      sonnerResponse('Producto eliminado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error al eliminar el producto'
      sonnerResponse(message, 'error')
    },
  })
}
