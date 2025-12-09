import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { usePaymentConfirmationByPayphoneMutation } from '@/app/components/payphone/mutations/usePayPhoneMutation'
import { useUpdatePaymentStatusMutation } from '../mutations/usePaymentMutations'

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
    mutateAsync: paymentConfirmationByPayphone,
    isPending,
    isError,
  } = usePaymentConfirmationByPayphoneMutation()
  const { mutateAsync: updateStatusTransaction } =
    useUpdatePaymentStatusMutation()

  useEffect(() => {
    if (!id || !clientTransactionId || isError) {
      console.warn('Faltan parámetros requeridos: id o clientTransactionId')
      navigate({ to: '/' })
      return
    }
    handlePaymentConfirmation()
  }, [id, clientTransactionId])

  const handlePaymentConfirmation = async () => {
    try {
      const response = await paymentConfirmationByPayphone({
        id,
        clientTxId: clientTransactionId,
      })
      const { statusCode } = response
      if (statusCode === 3) {
        await updateStatusTransaction({
          clientTransactionId,
          status: 'completed',
        })
        setTimeout(() => {
          navigate({ to: '/orders' })
        }, 2000)
      } else {
        setTimeout(() => {
          navigate({ to: '/' })
        }, 3000)
      }
    } catch (error) {
      console.error('Error al confirmar el pago:', error)
      setTimeout(() => {
        navigate({ to: '/' })
      }, 3000)
    }
  }

  if (!id || !clientTransactionId || isError) {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg">
        <h1 className="text-2xl font-bold text-coffee-darker mb-6 text-center">
          Gracias por tu compra
        </h1>
        <div className="space-y-4">
          <div className="pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Tu transacción está siendo procesada. Recibirás una confirmación
              por correo electrónico.
            </p>
            <button
              onClick={() => navigate({ to: '/' })}
              className="w-full bg-gradient-coffee text-white py-2 px-4 rounded-xl hover:opacity-90 transition-colors cursor-pointer"
            >
              Volver al Inicio
            </button>
            <button
              onClick={() => navigate({ to: '/orders' })}
              className="w-full mt-4 border border-coffee-medium text-coffee-darker py-2 px-4 rounded-xl hover:bg-coffee-light transition-colors cursor-pointer"
            >
              Ver mis órdenes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

