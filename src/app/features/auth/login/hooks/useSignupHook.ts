import { useSignupMutation } from '../mutations/useSignupMutation'

type UseSignupHookProps = {
  onSuccess?: () => void
}

export const useSignupHook = ({ onSuccess }: UseSignupHookProps = {}) => {
  const { mutateAsync: signup, isPending } = useSignupMutation()

  const handleSignup = async (values: {
    email: string
    password: string
    firstName: string
    lastName?: string
    country?: string
  }) => {
    try {
      await signup(values)
      onSuccess?.()
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  return {
    handleSignup,
    isPending,
  }
}
