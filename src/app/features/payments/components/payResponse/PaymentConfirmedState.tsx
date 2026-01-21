import { PaymentStateCard } from './PaymentStateCard'

interface PaymentConfirmedStateProps {
  onGoHome: () => void
  onGoToOrders: () => void
}

/**
 * Estado de pago confirmado/exitoso.
 */
export const PaymentConfirmedState = ({
  onGoHome,
  onGoToOrders,
}: PaymentConfirmedStateProps) => {
  return (
    <PaymentStateCard>
      <h1 className="text-2xl font-bold text-coffee-darker mb-6 text-center">
        ¡Pago exitoso!
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Tu transacción está siendo procesada. Recibirás una confirmación por
        correo electrónico.
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
