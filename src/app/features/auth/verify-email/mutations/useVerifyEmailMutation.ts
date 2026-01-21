import { useMutation, useQueryClient } from '@tanstack/react-query'
import { verifyEmailService } from '../services/verifyEmailService'
import type { VerifyEmailResponse } from '../services/verifyEmailService'

/**
 * Mutation para verificar el email del usuario.
 */
export const useVerifyEmailMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<VerifyEmailResponse, Error, string>({
    mutationFn: verifyEmailService,
    onSuccess: () => {
      // Invalidar la query de userInfo para actualizar isVerified
      queryClient.invalidateQueries({ queryKey: ['userInfo'] })
    },
  })
}
