import { useLoginMutation } from '../mutations/useLoginMutation'

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

  return {
    handleLogin,
    isPending,
  }
}

