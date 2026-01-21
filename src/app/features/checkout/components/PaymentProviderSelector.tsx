import { useMemo } from 'react'
import { Button } from '@heroui/react'
import { Lock } from 'lucide-react'
import { PAYMENT_PROVIDERS } from '../constants/paymentProviders'
import { EmailVerificationBanner } from './EmailVerificationBanner'
import type { PaymentProvider } from '../constants/paymentProviders'
import { useCurrency } from '@/app/hooks/useCurrency'
import { useUserVerification } from '@/app/hooks/useUserVerification'

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
  const { isArgentina } = useCurrency()
  const { isVerified, email, isLoading: isVerificationLoading } = useUserVerification()

  // Filtrar proveedores según el país del usuario
  // Mercado Pago solo disponible para Argentina
  const availableProviders = useMemo(() => {
    return PAYMENT_PROVIDERS.filter((provider) => {
      // Mercado Pago solo para Argentina
      if (provider.id === 'MERCADOPAGO') {
        return isArgentina
      }
      return true
    })
  }, [isArgentina])

  // Si el usuario no está verificado, mostrar banner y bloquear métodos de pago
  const isBlockedByVerification = !isVerificationLoading && !isVerified

  return (
    <div className="flex flex-col gap-4">
      {isBlockedByVerification && <EmailVerificationBanner email={email} />}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {availableProviders.map((provider) => {
          const isSelected = selectedProvider === provider.id
          const isProviderDisabled = !provider.available
          const isDisabled = disabled || isProviderDisabled || isBlockedByVerification

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
                relative p-4 md:p-6 min-h-[70px] md:min-h-[80px] rounded-lg border-2 transition-all duration-200
                ${
                  isSelected
                    ? 'border-coffee-medium bg-coffee-light/20 shadow-coffee'
                    : isDisabled
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 bg-white hover:border-coffee-light hover:shadow-md cursor-pointer'
                }
              `}
              title={
                isBlockedByVerification
                  ? 'Verifica tu email para continuar'
                  : disabled
                    ? 'Por favor, selecciona una dirección de envío primero'
                    : isProviderDisabled
                      ? 'Próximamente'
                      : provider.description
              }
            >
              {isDisabled && (
                <div className="absolute top-1 right-1 md:top-2 md:right-2">
                  <Lock size={14} className="text-gray-400" />
                </div>
              )}
              <div className="text-center">
                <div
                  className={`
                    text-sm md:text-base font-bold mb-0.5
                    ${isSelected ? 'text-coffee-darker' : 'text-gray-700'}
                    ${isDisabled ? 'text-gray-400' : ''}
                  `}
                >
                  {provider.name}
                </div>
                <div
                  className={`
                    text-[10px] md:text-xs
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
    </div>
  )
}
