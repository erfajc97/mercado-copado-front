import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUserProfileService } from '../services/updateUserProfileService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface UpdateUserProfileData {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  country?: string
  documentId?: string
}

export const useUpdateUserProfileMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<unknown, Error, UpdateUserProfileData>({
    mutationFn: updateUserProfileService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] })
      sonnerResponse('Perfil actualizado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error al actualizar el perfil'
      sonnerResponse(message, 'error')
    },
  })
}
