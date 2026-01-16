import { Button } from '@heroui/react'
import { Lock } from 'lucide-react'
import { PAYMENT_PROVIDERS } from '../constants/paymentProviders'
import type { PaymentProvider } from '../constants/paymentProviders'

interface PaymentProviderSelectorProps {
  selectedProvider: PaymentProvider | null
  onSelectProvider: (provider: PaymentProvider) => void
  disabled?: boolean
}

export const PaymentProviderSelector = ({
  selectedProvider,
  onSelectProvider,
  disabled = false,
}: PaymentProviderSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {PAYMENT_PROVIDERS.map((provider) => {
        const isSelected = selectedProvider === provider.id
        const isProviderDisabled = !provider.available
        const isDisabled = disabled || isProviderDisabled

        return (
          <Button
            key={provider.id}
            onPress={() => {
              if (!isDisabled) {
                onSelectProvider(provider.id)
              }
            }}
            disabled={isDisabled}
            className={`
              relative p-8  rounded-lg border-2 transition-all duration-200
              ${
                isSelected
                  ? 'border-coffee-medium bg-coffee-light/20 shadow-coffee'
                  : isDisabled
                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 bg-white hover:border-coffee-light hover:shadow-md cursor-pointer'
              }
            `}
            title={
              disabled
                ? 'Por favor, selecciona una dirección de envío primero'
                : isProviderDisabled
                  ? 'Próximamente'
                  : provider.description
            }
          >
            {isDisabled && (
              <div className="absolute top-2 right-2">
                <Lock size={16} className="text-gray-400" />
              </div>
            )}
            <div className="text-center">
              <div
                className={`
                  text-lg font-bold mb-1
                  ${isSelected ? 'text-coffee-darker' : 'text-gray-700'}
                  ${isDisabled ? 'text-gray-400' : ''}
                `}
              >
                {provider.name}
              </div>
              <div
                className={`
                  text-xs
                  ${isSelected ? 'text-coffee-medium' : 'text-gray-500'}
                  ${isDisabled ? 'text-gray-400' : ''}
                `}
              >
                {provider.description}
              </div>
            </div>
          </Button>
        )
      })}
    </div>
  )
}
