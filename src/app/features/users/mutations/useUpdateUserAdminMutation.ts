import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUserAdminService } from '../services/updateUserAdminService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface UpdateUserAdminData {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  country?: string
  documentId?: string
}

export const useUpdateUserAdminMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<
    unknown,
    Error,
    { userId: string; data: UpdateUserAdminData }
  >({
    mutationFn: ({ userId, data }) => updateUserAdminService(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      sonnerResponse('Usuario actualizado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al actualizar el usuario'
      sonnerResponse(message, 'error')
    },
  })
}
