import { useMutation } from '@tanstack/react-query'
import { forgotPasswordService } from '../services/forgotPasswordService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: forgotPasswordService,
    onSuccess: () => {
      sonnerResponse(
        'Se ha enviado un correo con las instrucciones para restablecer tu contraseña',
        'success',
      )
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al enviar el correo de recuperación'
      sonnerResponse(message, 'error')
    },
  })
}
