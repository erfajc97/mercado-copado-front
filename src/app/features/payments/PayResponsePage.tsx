import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { usePayResponsePageHook } from './hooks/usePayResponsePageHook'

interface PayResponsePageProps {
  id: string
  clientTransactionId: string
}

export const PayResponsePage = ({
  id,
  clientTransactionId,
}: PayResponsePageProps) => {
  const navigate = useNavigate()
  const {
    isPending,
    hasRequiredParams,
    paymentConfirmed,
    errorMessage,
  } = usePayResponsePageHook({
    id,
    clientTransactionId,
  })

  // Redirección automática después de 3 segundos cuando el pago es exitoso
  useEffect(() => {
    if (paymentConfirmed) {
      const timer = setTimeout(() => {
        navigate({ to: '/orders' })
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [paymentConfirmed, navigate])

  if (!hasRequiredParams) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg">
          <h1 className="text-2xl font-bold text-coffee-darker mb-4">
            Faltan parámetros requeridos
          </h1>
          <p className="text-gray-600 mb-4">
            No se recibieron los parámetros necesarios para procesar el pago.
          </p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="px-4 py-2 bg-coffee-medium text-white rounded hover:bg-coffee-darker"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  // Mostrar página de error solo si hay un errorMessage (después de intentar confirmar)
  if (errorMessage && !isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg">
          <h1 className="text-2xl font-bold text-coffee-darker mb-4">
            Error al procesar el pago
          </h1>
          <p className="text-red-600 mb-6">{errorMessage}</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate({ to: '/orders' })}
              className="px-4 py-2 bg-coffee-medium text-white rounded hover:bg-coffee-darker"
            >
              Ir a mis órdenes
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-coffee-medium text-coffee-darker rounded hover:bg-coffee-light"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg">
          <h1 className="text-2xl font-bold text-coffee-darker mb-6 text-center">
            Procesando respuesta de pago...
          </h1>
          <p className="text-gray-600 text-center">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  if (paymentConfirmed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg">
          <h1 className="text-2xl font-bold text-coffee-darker mb-6 text-center">
            ¡Pago exitoso!
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Tu transacción está siendo procesada. Recibirás una confirmación por correo electrónico.
          </p>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Serás redirigido a tus órdenes en unos momentos...
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex-1 bg-coffee-medium text-white py-2 px-4 rounded-xl hover:bg-coffee-darker transition-colors cursor-pointer"
            >
              Volver al Inicio
            </button>
            <button
              onClick={() => navigate({ to: '/orders' })}
              className="flex-1 border-2 border-coffee-medium text-coffee-darker py-2 px-4 rounded-xl hover:bg-coffee-light transition-colors cursor-pointer"
            >
              Ver mis órdenes
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg">
        <h1 className="text-2xl font-bold text-coffee-darker mb-6 text-center">
          Procesando pago...
        </h1>
        <p className="text-gray-600 text-center">Por favor espera...</p>
      </div>
    </div>
  )
}
