import { PaymentStateCard } from './PaymentStateCard'

interface PaymentRejectedStateProps {
  onGoToCheckout: () => void
  onGoToOrders: () => void
}

/**
 * Estado de pago rechazado o incompleto.
 */
export const PaymentRejectedState = ({
  onGoToCheckout,
  onGoToOrders,
}: PaymentRejectedStateProps) => {
  return (
    <PaymentStateCard>
      <h1 className="text-2xl font-bold text-coffee-darker mb-6 text-center">
        Pago rechazado o incompleto
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        El pago no pudo completarse. Serás redirigido al checkout para
        intentar de nuevo.
      </p>
      <p className="text-sm text-gray-500 mb-4 text-center">
        Redirigiendo al checkout...
      </p>
      <div className="flex gap-4">
        <button
          onClick={onGoToCheckout}
          className="flex-1 bg-coffee-medium text-white py-2 px-4 rounded-xl hover:bg-coffee-darker transition-colors cursor-pointer"
        >
          Ir al Checkout
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
