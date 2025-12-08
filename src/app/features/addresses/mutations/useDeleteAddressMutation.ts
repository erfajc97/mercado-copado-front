import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAddressService } from '../services/deleteAddressService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useDeleteAddressMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<unknown, Error, string>({
    mutationFn: deleteAddressService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      sonnerResponse('Dirección eliminada exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al eliminar la dirección'
      sonnerResponse(message, 'error')
    },
  })
}
