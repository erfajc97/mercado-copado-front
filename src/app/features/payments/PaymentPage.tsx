import { Button, Spinner } from '@heroui/react'
import { AlertCircle, CheckCircle2, CreditCard } from 'lucide-react'
import { usePaymentPageHook } from './hooks/usePaymentPageHook'

interface PaymentPageProps {
  transactionId: string
  paymentLink?: string
  paymentId?: string
}

export function PaymentPage({
  transactionId,
  paymentLink,
  paymentId,
}: PaymentPageProps) {
  const {
    paymentCompleted,
    handleOpenPaymentWindow,
    handleCancel,
  } = usePaymentPageHook({ transactionId, paymentLink, paymentId })

  if (!paymentLink) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-coffee-darker mb-4">
            Link de pago no encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            No se pudo generar el link de pago. Por favor, intenta nuevamente.
          </p>
          <Button
            color="primary"
            onPress={handleCancel}
            className="bg-gradient-coffee border-none hover:opacity-90"
            size="lg"
          >
            Volver al Checkout
          </Button>
        </div>
      </div>
    )
  }

  if (paymentCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg text-center">
          <CheckCircle2 className="text-green-500 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-coffee-darker mb-4">
            ¡Pago Completado!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu pago ha sido procesado exitosamente. Redirigiendo a tus órdenes...
          </p>
          <Spinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 shadow-lg max-w-md w-full mx-4 rounded-lg">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <CreditCard className="text-coffee-medium" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-coffee-darker mb-2">
            Procesando tu Pago
          </h1>
          <p className="text-gray-600">
            Se ha abierto una nueva ventana para completar tu pago con Payphone.
          </p>
        </div>

        <div className="bg-linear-to-r from-coffee-light/20 to-coffee-medium/20 p-4 rounded-lg border-2 border-coffee-medium mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-coffee-medium shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-coffee-darker font-semibold mb-1">
                Instrucciones
              </p>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Completa el pago en la ventana que se abrió</li>
                <li>No cierres esta página hasta completar el pago</li>
                <li>Una vez completado, serás redirigido automáticamente</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onPress={handleOpenPaymentWindow}
            className="flex-1 bg-gradient-coffee border-none hover:opacity-90"
            size="lg"
          >
            Abrir Ventana de Pago
          </Button>
          <Button
            onPress={handleCancel}
            variant="bordered"
            className="flex-1"
            size="lg"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
