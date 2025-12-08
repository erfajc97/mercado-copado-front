import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/app/store/auth/authStore'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || '',
      refreshToken: (search.refreshToken as string) || '',
    }
  },
})

function AuthCallback() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { token, refreshToken } = Route.useSearch()
  const { setToken, setRoles } = useAuthStore()

  useEffect(() => {
    if (!token || !refreshToken) {
      sonnerResponse('Error: Token no encontrado', 'error')
      navigate({ to: '/' })
      return
    }

    try {
      // Decodificar el token JWT para obtener la expiración
      const decoded = JSON.parse(atob(token.split('.')[1]))
      const expiration = decoded.exp * 1000

      // Obtener el rol del usuario del token
      const userRole = decoded.type || 'USER'

      // Guardar tokens en el store
      setToken(token, refreshToken, expiration)
      setRoles(userRole)

      // Invalidar todas las queries para forzar re-render
      queryClient.clear()

      // Mostrar mensaje de éxito
      sonnerResponse('Inicio de sesión exitoso con Google', 'success')

      // Redirigir a la página principal
      navigate({ to: '/' })
    } catch (error) {
      console.error('Error procesando callback:', error)
      sonnerResponse('Error al procesar el inicio de sesión', 'error')
      navigate({ to: '/' })
    }
  }, [token, refreshToken, navigate, queryClient, setToken, setRoles])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-dark mx-auto mb-4"></div>
        <p className="text-lg text-coffee-darker">
          Procesando inicio de sesión...
        </p>
      </div>
    </div>
  )
}
