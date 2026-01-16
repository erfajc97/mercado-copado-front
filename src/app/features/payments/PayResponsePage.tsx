import { usePayResponsePageHook } from './hooks/usePayResponsePageHook'

interface PayResponsePageProps {
  id: string
  clientTransactionId: string
}

export const PayResponsePage = ({
  id,
  clientTransactionId,
}: PayResponsePageProps) => {
  const { isPending, isError, hasRequiredParams } = usePayResponsePageHook({
    id,
    clientTransactionId,
  })

  if (!hasRequiredParams || isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-coffee-darker mb-4">
            Hubo un error al procesar el pago...
          </h1>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  // Mientras se procesa, mostrar loading
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg">
          <h1 className="text-2xl font-bold text-coffee-darker mb-6 text-center">
            Procesando respuesta de pago...
          </h1>
          <p className="text-gray-600 text-center">Por favor espera...</p>
        </div>
      </div>
    )
  }

  // Si llegamos aquí, significa que el pago fue exitoso y ya redirigimos
  // Este componente no debería renderizarse, pero por si acaso mostramos loading
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg">
        <h1 className="text-2xl font-bold text-coffee-darker mb-6 text-center">
          Redirigiendo...
        </h1>
      </div>
    </div>
  )
}
