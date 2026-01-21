import { useState } from 'react'
import { Button, Card } from '@heroui/react'
import { useResendVerificationMutation } from '@/app/features/auth/verify-email/mutations/useResendVerificationMutation'

interface EmailVerificationBannerProps {
  email: string | undefined
}

type BannerState = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Banner de advertencia para usuarios con email no verificado.
 * Muestra mensaje de bloqueo y opción para reenviar verificación.
 */
export const EmailVerificationBanner = ({
  email,
}: EmailVerificationBannerProps) => {
  const [state, setState] = useState<BannerState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const resendMutation = useResendVerificationMutation()

  const handleResendVerification = () => {
    if (!email) {
      setErrorMessage('No se pudo obtener tu email')
      setState('error')
      return
    }

    setState('sending')
    resendMutation.mutate(email, {
      onSuccess: () => {
        setState('sent')
      },
      onError: (error) => {
        setErrorMessage(error.message || 'Error al enviar el email')
        setState('error')
      },
    })
  }

  return (
    <Card className="mb-4 border-2 border-amber-400 bg-amber-50 p-4">
      <div className="flex flex-col items-center gap-3 text-center">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
          <svg
            className="h-6 w-6 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Message */}
        <div>
          <h3 className="text-lg font-semibold text-amber-800">
            Verifica tu cuenta para continuar
          </h3>
          <p className="mt-1 text-sm text-amber-700">
            Debes verificar tu correo electrónico antes de poder realizar
            compras. Revisa tu bandeja de entrada o solicita un nuevo correo.
          </p>
        </div>

        {/* Action Buttons */}
        {state === 'idle' && (
          <Button
            color="warning"
            variant="solid"
            className="font-semibold"
            onPress={handleResendVerification}
          >
            Reenviar email de verificación
          </Button>
        )}

        {state === 'sending' && (
          <Button color="warning" variant="solid" isLoading disabled>
            Enviando...
          </Button>
        )}

        {state === 'sent' && (
          <div className="rounded-lg bg-green-100 p-3 text-green-700">
            <p className="flex items-center gap-2 font-medium">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Email enviado. Revisa tu bandeja de entrada.
            </p>
          </div>
        )}

        {state === 'error' && (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg bg-red-100 p-3 text-red-700">
              <p className="text-sm">{errorMessage}</p>
            </div>
            <Button
              color="warning"
              variant="bordered"
              size="sm"
              onPress={() => setState('idle')}
            >
              Intentar de nuevo
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
