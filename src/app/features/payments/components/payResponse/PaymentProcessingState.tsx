import { PaymentStateCard } from './PaymentStateCard'

interface PaymentProcessingStateProps {
  message?: string
}

/**
 * Estado de procesamiento de pago.
 */
export const PaymentProcessingState = ({
  message = 'Procesando pago...',
}: PaymentProcessingStateProps) => {
  return (
    <PaymentStateCard>
      <h1 className="text-2xl font-bold text-coffee-darker mb-6 text-center">
        {message}
      </h1>
      <p className="text-gray-600 text-center">Por favor espera...</p>
    </PaymentStateCard>
  )
}
