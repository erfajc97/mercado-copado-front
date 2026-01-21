import { useMutation } from '@tanstack/react-query'
import { resendVerificationService } from '../services/resendVerificationService'
import type { ResendVerificationResponse } from '../services/resendVerificationService'

/**
 * Mutation para reenviar el email de verificación.
 */
export const useResendVerificationMutation = () => {
  return useMutation<ResendVerificationResponse, Error, string>({
    mutationFn: resendVerificationService,
  })
}
