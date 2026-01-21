import { Button, Card, Spinner } from '@heroui/react'
import { useVerifyEmailHook } from './hooks/useVerifyEmailHook'

interface VerifyEmailProps {
  token: string
}

/**
 * Componente de página para verificación de email.
 */
export const VerifyEmail = ({ token }: VerifyEmailProps) => {
  const { state, message, goToHome, goToLogin } = useVerifyEmailHook(token)

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-amber-50 to-orange-100 p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-lg">
        {state === 'loading' && <LoadingState />}
        {state === 'success' && (
          <SuccessState message={message} onGoToHome={goToHome} />
        )}
        {state === 'error' && (
          <ErrorState message={message} onGoToLogin={goToLogin} />
        )}
      </Card>
    </div>
  )
}

const LoadingState = () => (
  <div className="flex flex-col items-center gap-4">
    <Spinner size="lg" color="warning" />
    <h2 className="text-xl font-semibold text-gray-700">
      Verificando tu email...
    </h2>
    <p className="text-gray-500">Por favor espera un momento</p>
  </div>
)

interface SuccessStateProps {
  message: string
  onGoToHome: () => void
}

const SuccessState = ({ message, onGoToHome }: SuccessStateProps) => (
  <div className="flex flex-col items-center gap-4">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
      <svg
        className="h-10 w-10 text-green-600"
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
    </div>
    <h2 className="text-2xl font-bold text-green-600">
      Email Verificado
    </h2>
    <p className="text-gray-600">{message}</p>
    <p className="text-sm text-gray-500">
      Tu cuenta ha sido verificada exitosamente. Ahora puedes acceder a todas
      las funcionalidades.
    </p>
    <Button
      color="warning"
      className="mt-4 font-semibold"
      onPress={onGoToHome}
    >
      Ir al Inicio
    </Button>
  </div>
)

interface ErrorStateProps {
  message: string
  onGoToLogin: () => void
}

const ErrorState = ({ message, onGoToLogin }: ErrorStateProps) => (
  <div className="flex flex-col items-center gap-4">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
      <svg
        className="h-10 w-10 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
    <h2 className="text-2xl font-bold text-red-600">
      Error de Verificación
    </h2>
    <p className="text-gray-600">{message}</p>
    <p className="text-sm text-gray-500">
      El enlace puede haber expirado o ya fue utilizado. Intenta solicitar un
      nuevo correo de verificación.
    </p>
    <Button
      color="warning"
      className="mt-4 font-semibold"
      onPress={onGoToLogin}
    >
      Volver al Inicio
    </Button>
  </div>
)
