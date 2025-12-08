import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logoutService } from '../services/logoutService'
import { useAuthStore } from '@/app/store/auth/authStore'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await logoutService()
      useAuthStore.getState().removeToken()
    },
    onSuccess: () => {
      queryClient.clear()
      sonnerResponse('Sesión cerrada exitosamente', 'success')
      window.location.href = '/'
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al cerrar sesión'
      sonnerResponse(message, 'error')
      // Aún así, limpiar el token local
      useAuthStore.getState().removeToken()
      window.location.href = '/'
    },
  })
}

