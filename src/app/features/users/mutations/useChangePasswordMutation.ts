import { useMutation } from '@tanstack/react-query'
import { changePasswordService } from '../services/changePasswordService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export const useChangePasswordMutation = () => {
  return useMutation<unknown, Error, ChangePasswordData>({
    mutationFn: changePasswordService,
    onSuccess: () => {
      sonnerResponse('Contraseña cambiada exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al cambiar la contraseña'
      sonnerResponse(message, 'error')
    },
  })
}
