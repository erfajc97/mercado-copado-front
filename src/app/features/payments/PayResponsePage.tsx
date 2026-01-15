import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { usePaymentConfirmationByPayphoneMutation } from '@/app/components/payphone/mutations/usePayPhoneMutation'
import { useUpdatePaymentStatusMutation } from '@/app/features/payments/mutations/usePaymentMutations'
import { useCartStore } from '@/app/store/cart/cartStore'

interface PayResponsePageProps {
  id: string
  clientTransactionId: string
}

export const PayResponsePage = ({
  id,
  clientTransactionId,
}: PayResponsePageProps) => {
  const navigate = useNavigate()
  const { clearCart } = useCartStore()
  const {
    mutateAsync: paymentConfirmationByPayphone,
    isPending,
    isError,
  } = usePaymentConfirmationByPayphoneMutation()
  const { mutateAsync: updateStatusTransaction } =
    useUpdatePaymentStatusMutation()

  useEffect(() => {
    if (!id || !clientTransactionId) {
      console.warn('Faltan parámetros requeridos: id o clientTransactionId')
      navigate({ to: '/' })
      return
    }
    if (!isError) {
      handlePaymentConfirmation()
    }
  }, [id, clientTransactionId, isError])

  const handlePaymentConfirmation = async () => {
    try {
      const response = await paymentConfirmationByPayphone({
        id,
        clientTxId: clientTransactionId,
      })
      const { statusCode } = response
      if (statusCode === 3) {
        // Pago completado exitosamente - actualizar estado de transacción y orden
        // La orden ya existe (se creó cuando se inició el pago), solo actualizar su estado
        await updateStatusTransaction({
          clientTransactionId,
          status: 'completed',
        })
        // El carrito ya se limpió cuando se creó la orden, no es necesario limpiarlo de nuevo
        // Redirigir directamente a órdenes
        navigate({ to: '/orders' })
      } else {
        // Pago pendiente o en proceso - redirigir a órdenes para verificar
        navigate({ to: '/orders' })
      }
    } catch (error) {
      console.error('Error al confirmar el pago:', error)
      // Si hay error, redirigir a órdenes para que el usuario pueda verificar el estado
      navigate({ to: '/orders' })
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
