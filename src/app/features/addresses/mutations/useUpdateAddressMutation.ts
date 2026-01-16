import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAddressService } from '../services/updateAddressService'
import type { UpdateAddressData } from '../types'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useUpdateAddressMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<
    unknown,
    Error,
    { addressId: string; data: UpdateAddressData }
  >({
    mutationFn: ({ addressId, data }) => updateAddressService(addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      sonnerResponse('Dirección actualizada exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al actualizar la dirección'
      sonnerResponse(message, 'error')
    },
  })
}
