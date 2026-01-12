import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToCartService } from '../services/addToCartService'
import { updateCartItemService } from '../services/updateCartItemService'
import { removeCartItemService } from '../services/removeCartItemService'
import { clearCartService } from '../services/clearCartService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addToCartService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      sonnerResponse('Producto agregado al carrito', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al agregar producto al carrito'
      sonnerResponse(message, 'error')
    },
  })
}

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      updateCartItemService(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      sonnerResponse('Carrito actualizado', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al actualizar el carrito'
      sonnerResponse(message, 'error')
    },
  })
}

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeCartItemService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      sonnerResponse('Producto eliminado del carrito', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al eliminar producto del carrito'
      sonnerResponse(message, 'error')
    },
  })
}

export const useClearCartMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: clearCartService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      sonnerResponse('Carrito limpiado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al limpiar el carrito'
      sonnerResponse(message, 'error')
    },
  })
}
