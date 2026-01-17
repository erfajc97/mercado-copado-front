import { useState } from 'react'
import { useForgotPasswordMutation } from '../mutations/useForgotPasswordMutation'

type UseForgotPasswordHookProps = {
  onSuccess?: () => void
}

export const useForgotPasswordHook = ({
  onSuccess,
}: UseForgotPasswordHookProps = {}) => {
  const { mutateAsync: forgotPassword, isPending } =
    useForgotPasswordMutation()
  const [emailSent, setEmailSent] = useState(false)

  const handleForgotPassword = async (values: { email: string }) => {
    try {
      // useForgotPasswordMutation ya maneja sonnerResponse en onSuccess y onError
      await forgotPassword(values)
      setEmailSent(true)
      onSuccess?.()
    } catch (error: any) {
      throw error
    }
  }

  return {
    handleForgotPassword,
    isPending,
    emailSent,
  }
}
