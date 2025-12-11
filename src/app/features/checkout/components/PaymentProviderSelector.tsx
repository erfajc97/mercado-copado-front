import { useState } from 'react'
import { Lock } from 'lucide-react'

type PaymentProvider = 'PAYPHONE' | 'MERCADOPAGO' | 'CRYPTO' | 'CASH_DEPOSIT'

interface PaymentProviderSelectorProps {
  selectedProvider: PaymentProvider | null
  onSelectProvider: (provider: PaymentProvider) => void
}

export const PaymentProviderSelector = ({
  selectedProvider,
  onSelectProvider,
}: PaymentProviderSelectorProps) => {
  const providers: Array<{
    id: PaymentProvider
    name: string
    available: boolean
    description: string
  }> = [
    {
      id: 'PAYPHONE',
      name: 'Payphone',
      available: true,
      description: 'Pago con Payphone',
    },
    {
      id: 'CASH_DEPOSIT',
      name: 'Depósito en Efectivo',
      available: true,
      description: 'Sube comprobante',
    },
    {
      id: 'MERCADOPAGO',
      name: 'Mercado Pago',
      available: false,
      description: 'Próximamente',
    },
    {
      id: 'CRYPTO',
      name: 'Crypto USDT',
      available: false,
      description: 'Próximamente',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {providers.map((provider) => {
        const isSelected = selectedProvider === provider.id
        const isDisabled = !provider.available

        return (
          <button
            key={provider.id}
            onClick={() => {
              if (!isDisabled) {
                onSelectProvider(provider.id)
              }
            }}
            disabled={isDisabled}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-200
              ${
                isSelected
                  ? 'border-coffee-medium bg-coffee-light/20 shadow-coffee'
                  : isDisabled
                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 bg-white hover:border-coffee-light hover:shadow-md cursor-pointer'
              }
            `}
            title={isDisabled ? 'Próximamente' : provider.description}
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
          </button>
        )
      })}
    </div>
  )
}

