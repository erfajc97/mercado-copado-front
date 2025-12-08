import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAddressService } from '../services/createAddressService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface CreateAddressData {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  reference?: string
  isDefault?: boolean
}

interface Address {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  reference?: string | null
  isDefault: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

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
