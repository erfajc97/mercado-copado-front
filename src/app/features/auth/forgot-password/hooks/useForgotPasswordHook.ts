import { useState } from 'react'
import { useForgotPasswordMutation } from '../mutations/useForgotPasswordMutation'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

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
      await forgotPassword(values)
      setEmailSent(true)
      sonnerResponse(
        'Se ha enviado un correo con las instrucciones para recuperar tu contraseña',
        'success',
      )
      onSuccess?.()
    } catch (error: any) {
      const message =
        error?.message || 'Error al enviar el correo de recuperación'
      sonnerResponse(message, 'error')
      throw error
    }
  }

  return {
    handleForgotPassword,
    isPending,
    emailSent,
  }
}
