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
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
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
    onMutate: async ({ productId, data }) => {
      // Cancelar queries en progreso para evitar sobrescribir la actualización optimista
      await queryClient.cancelQueries({ queryKey: ['products'] })
 
      // Snapshot del valor anterior
      const previousProducts = queryClient.getQueriesData({
        queryKey: ['products'],
      })

      // Actualización optimista: actualizar el cache inmediatamente para todas las queries de productos
      queryClient.setQueriesData({ queryKey: ['products'] }, (old: any) => {
        if (!old || !Array.isArray(old)) return old
        return old.map((product: any) => {
          if (product.id === productId) {
            // Asegurar que isActive sea un boolean
            const updatedProduct = { ...product, ...data }
            if ('isActive' in data) {
              updatedProduct.isActive = Boolean(data.isActive)
            }
            return updatedProduct
          }
          return product
        })
      })
 
      return { previousProducts }
    },
    onSuccess: (updatedProduct, variables) => {
      // Actualizar el cache con la respuesta del servidor inmediatamente
      if (updatedProduct) {
        queryClient.setQueriesData({ queryKey: ['products'] }, (old: any) => {
          if (!old || !Array.isArray(old)) return old
          return old.map((product: any) => {
            if (product.id === variables.productId) {
              // Usar el producto actualizado del servidor (tiene prioridad)
              return updatedProduct
            }
            return product
          })
        })
        
        // También actualizar la query individual del producto
        queryClient.setQueryData(
          ['product', variables.productId],
          updatedProduct,
        )
      }
      
      // NO invalidar inmediatamente para evitar que el refetch sobrescriba el cambio
      // En su lugar, solo invalidar después de un pequeño delay para que la UI se actualice primero
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({
          queryKey: ['product', variables.productId],
        })
        queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
      }, 500)
      sonnerResponse('Producto actualizado exitosamente', 'success')
    },
    onError: (error, _variables, context) => {
      // Revertir a los valores anteriores si hay error
      if (context?.previousProducts) {
        context.previousProducts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
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
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
      sonnerResponse('Producto eliminado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error al eliminar el producto'
      sonnerResponse(message, 'error')
    },
  })
}
