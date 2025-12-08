import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signinService } from '../services/signinService'
import { useAuthStore } from '@/app/store/auth/authStore'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

type LoginPayload = {
  email: string
  password: string
}

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const data = await signinService(payload)

      const token = data.accessToken
      const refreshToken = data.refreshToken
      const decoded = JSON.parse(atob(token.split('.')[1]))
      const expiration = decoded.exp * 1000

      useAuthStore.getState().setToken(token, refreshToken, expiration)
      useAuthStore.getState().setRoles(data.userRole)

      return data
    },
    onSuccess: () => {
      queryClient.clear()
      sonnerResponse('Inicio de sesión exitoso', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error desconocido al iniciar sesión'
      sonnerResponse(message, 'error')
    },
  })
}
