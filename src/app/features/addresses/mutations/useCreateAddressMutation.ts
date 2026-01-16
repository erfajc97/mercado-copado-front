import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAddressService } from '../services/createAddressService'
import type { Address, CreateAddressData } from '../types'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useCreateAddressMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<Address, Error, CreateAddressData>({
    mutationFn: createAddressService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      sonnerResponse('Dirección creada exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error al crear la dirección'
      sonnerResponse(message, 'error')
    },
  })
}
