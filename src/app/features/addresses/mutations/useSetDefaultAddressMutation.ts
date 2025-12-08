import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setDefaultAddressService } from '../services/setDefaultAddressService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useSetDefaultAddressMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<unknown, Error, string>({
    mutationFn: setDefaultAddressService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      sonnerResponse(
        'Dirección establecida como predeterminada exitosamente',
        'success',
      )
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al establecer la dirección por defecto'
      sonnerResponse(message, 'error')
    },
  })
}
