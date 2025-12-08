import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signupService } from '../services/signupService'
import { useAuthStore } from '@/app/store/auth/authStore'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

type SignupPayload = {
  email: string
  password: string
  firstName: string
  lastName?: string
}

export const useSignupMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const data = await signupService(payload)

      const token = data.accessToken
      const refreshToken = data.refreshToken
      const decoded = JSON.parse(atob(token.split('.')[1]))
      const expiration = decoded.exp * 1000

      useAuthStore.getState().setToken(token, refreshToken, expiration)
      useAuthStore.getState().setRoles('USER')

      return data
    },
    onSuccess: () => {
      queryClient.clear()
      sonnerResponse('Registro exitoso', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error desconocido al registrarse'
      sonnerResponse(message, 'error')
    },
  })
}

