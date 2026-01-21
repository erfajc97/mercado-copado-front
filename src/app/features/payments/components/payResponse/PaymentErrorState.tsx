import { PaymentStateCard } from './PaymentStateCard'

interface PaymentErrorStateProps {
  errorMessage: string
  onGoToOrders: () => void
  onRetry: () => void
}

/**
 * Estado de error al procesar el pago.
 */
export const PaymentErrorState = ({
  errorMessage,
  onGoToOrders,
  onRetry,
}: PaymentErrorStateProps) => {
  return (
    <PaymentStateCard>
      <h1 className="text-2xl font-bold text-coffee-darker mb-4">
        Error al procesar el pago
      </h1>
      <p className="text-red-600 mb-6">{errorMessage}</p>
      <div className="flex gap-4">
        <button
          onClick={onGoToOrders}
          className="px-4 py-2 bg-coffee-medium text-white rounded hover:bg-coffee-darker"
        >
          Ir a mis órdenes
        </button>
        <button
          onClick={onRetry}
          className="px-4 py-2 border border-coffee-medium text-coffee-darker rounded hover:bg-coffee-light"
        >
          Reintentar
        </button>
      </div>
    </PaymentStateCard>
  )
}
