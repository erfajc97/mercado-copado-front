import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAddressService } from '../services/updateAddressService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface UpdateAddressData {
  street?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  reference?: string
  isDefault?: boolean
}

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
