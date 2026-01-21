import { useMutation } from '@tanstack/react-query'
import { resendVerificationService } from '@/app/features/auth/verify-email/services/resendVerificationService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

/**
 * Mutation para reenviar email de verificación desde el panel de admin.
 */
export const useAdminResendVerificationMutation = () => {
  return useMutation({
    mutationFn: resendVerificationService,
    onSuccess: () => {
      sonnerResponse('Email de verificación enviado exitosamente', 'success')
    },
    onError: (error: Error) => {
      sonnerResponse(error.message || 'Error al enviar el email de verificación', 'error')
    },
  })
}
