import { useSignupMutation } from '../../login/mutations/useSignupMutation'
import { getGoogleAuthUrl } from '../../login/services/googleAuthService'

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

  const handleGoogleLogin = () => {
    const googleAuthUrl = getGoogleAuthUrl()
    window.location.href = googleAuthUrl
  }

  return {
    handleSignup,
    handleGoogleLogin,
    isPending,
  }
}

