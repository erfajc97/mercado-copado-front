import { useMutation } from '@tanstack/react-query'
import { forgotPasswordService } from '../services/forgotPasswordService'

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: forgotPasswordService,
  })
}
