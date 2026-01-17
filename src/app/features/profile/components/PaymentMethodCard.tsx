import { CreditCard, Home, Trash2 } from 'lucide-react'
import type { PaymentMethod } from '@/app/features/payment-cards/types'

interface PaymentMethodCardProps {
  method: PaymentMethod
  onSetDefault: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export const PaymentMethodCard = ({
  method,
  onSetDefault,
  onDelete,
}: PaymentMethodCardProps) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-sm border ${
        method.isDefault ? 'border-2 border-coffee-medium' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={20} className="text-coffee-medium" />
            <h3 className="font-semibold text-coffee-darker">
              {method.cardBrand}
            </h3>
          </div>
          <p className="text-lg font-mono text-coffee-darker mb-1">
            **** **** **** {method.last4Digits}
          </p>
          <p className="text-sm text-gray-600">
            Exp:{' '}
            {method.expirationMonth.toString().padStart(2, '0')}/
            {method.expirationYear}
          </p>
          {method.isDefault && (
            <span className="mt-2 inline-flex items-center gap-1 bg-coffee-medium text-white text-xs px-2 py-1 rounded">
              <Home size={12} />
              Predeterminada
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {!method.isDefault && (
            <button
              onClick={() => onSetDefault(method.id)}
              className="p-2 text-coffee-medium hover:bg-coffee-light rounded-lg transition-colors text-xs"
              aria-label="Establecer como predeterminada"
              title="Establecer como predeterminada"
            >
              <Home size={16} />
            </button>
          )}
          <button
            onClick={() => onDelete(method.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Eliminar tarjeta"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
