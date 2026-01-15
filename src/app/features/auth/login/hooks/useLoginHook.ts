import { useLoginMutation } from '../mutations/useLoginMutation'
import { getGoogleAuthUrl } from '../services/googleAuthService'

type UseLoginHookProps = {
  onSuccess?: () => void
}

export const useLoginHook = ({ onSuccess }: UseLoginHookProps = {}) => {
  const { mutateAsync: login, isPending } = useLoginMutation()

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await login(values)
      onSuccess?.()
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const handleGoogleLogin = () => {
    const googleAuthUrl = getGoogleAuthUrl()
    window.location.href = googleAuthUrl
  }

  return {
    handleLogin,
    handleGoogleLogin,
    isPending,
  }
}

