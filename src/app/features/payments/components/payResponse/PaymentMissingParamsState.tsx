import { PaymentStateCard } from './PaymentStateCard'

interface PaymentMissingParamsStateProps {
  onGoHome: () => void
}

/**
 * Estado cuando faltan parámetros requeridos.
 */
export const PaymentMissingParamsState = ({
  onGoHome,
}: PaymentMissingParamsStateProps) => {
  return (
    <PaymentStateCard>
      <h1 className="text-2xl font-bold text-coffee-darker mb-4">
        Faltan parámetros requeridos
      </h1>
      <p className="text-gray-600 mb-4">
        No se recibieron los parámetros necesarios para procesar el pago.
      </p>
      <button
        onClick={onGoHome}
        className="px-4 py-2 bg-coffee-medium text-white rounded hover:bg-coffee-darker"
      >
        Volver al inicio
      </button>
    </PaymentStateCard>
  )
}
