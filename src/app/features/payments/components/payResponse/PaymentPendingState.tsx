import { PaymentStateCard } from './PaymentStateCard'

interface PaymentPendingStateProps {
  onGoHome: () => void
  onGoToOrders: () => void
}

/**
 * Estado de pago pendiente (Mercado Pago).
 */
export const PaymentPendingState = ({
  onGoHome,
  onGoToOrders,
}: PaymentPendingStateProps) => {
  return (
    <PaymentStateCard>
      <h1 className="text-2xl font-bold text-coffee-darker mb-6 text-center">
        Pago pendiente
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Tu orden se procesará cuando Mercado Pago confirme el pago.
      </p>
      <p className="text-sm text-gray-500 mb-4 text-center">
        Serás redirigido a tus órdenes en unos momentos...
      </p>
      <div className="flex gap-4">
        <button
          onClick={onGoHome}
          className="flex-1 bg-coffee-medium text-white py-2 px-4 rounded-xl hover:bg-coffee-darker transition-colors cursor-pointer"
        >
          Volver al Inicio
        </button>
        <button
          onClick={onGoToOrders}
          className="flex-1 border-2 border-coffee-medium text-coffee-darker py-2 px-4 rounded-xl hover:bg-coffee-light transition-colors cursor-pointer"
        >
          Ver mis órdenes
        </button>
      </div>
    </PaymentStateCard>
  )
}
