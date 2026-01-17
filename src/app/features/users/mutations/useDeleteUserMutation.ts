import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUserService } from '../services/deleteUserService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUserService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
      sonnerResponse('Usuario eliminado exitosamente', 'success')
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Error al eliminar el usuario'
      sonnerResponse(message, 'error')
    },
  })
}
