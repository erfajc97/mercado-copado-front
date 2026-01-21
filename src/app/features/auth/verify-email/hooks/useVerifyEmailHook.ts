import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useVerifyEmailMutation } from '../mutations/useVerifyEmailMutation'

export type VerifyEmailState = 'loading' | 'success' | 'error'

interface UseVerifyEmailHookReturn {
  state: VerifyEmailState
  message: string
  goToHome: () => void
  goToLogin: () => void
}

/**
 * Hook para manejar la lógica de verificación de email.
 */
export const useVerifyEmailHook = (token: string): UseVerifyEmailHookReturn => {
  const navigate = useNavigate()
  const [state, setState] = useState<VerifyEmailState>('loading')
  const [message, setMessage] = useState('')

  const verifyEmailMutation = useVerifyEmailMutation()

  useEffect(() => {
    if (!token) {
      setState('error')
      setMessage('Token de verificación no válido')
      return
    }

    verifyEmailMutation.mutate(token, {
      onSuccess: (response) => {
        setState('success')
        setMessage(response.message)
      },
      onError: (error) => {
        setState('error')
        setMessage(error.message || 'Error al verificar el email')
      },
    })
  }, [token])

  const goToHome = () => {
    navigate({ to: '/' })
  }

  const goToLogin = () => {
    navigate({ to: '/' })
    // Aquí podrías abrir el modal de login si lo tienes implementado
  }

  return {
    state,
    message,
    goToHome,
    goToLogin,
  }
}
