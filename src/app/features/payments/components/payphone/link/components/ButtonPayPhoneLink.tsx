import { Button } from '@heroui/react'
import { Link } from 'lucide-react'
import { useButtonPayPhoneLinkHook } from '../hooks/useButtonPayPhoneLinkHook'
import { LinkPaymentConfirmationModal } from './modals/LinkPaymentConfirmationModal'
import { useCurrency } from '@/app/hooks/useCurrency'

interface ButtonPayPhoneLinkProps {
  amount: number
  addressId: string
  paymentMethodId: string
  clientTransactionId?: string
  onSuccess?: () => void
  disabled?: boolean
  orderId?: string
}

export const ButtonPayPhoneLink = ({
  amount,
  addressId,
  paymentMethodId,
  clientTransactionId,
  onSuccess,
  disabled,
  orderId,
}: ButtonPayPhoneLinkProps) => {
  const { formatPrice } = useCurrency()
  const {
    showLinkConfirmationModal,
    setShowLinkConfirmationModal,
    isPendingLink,
    handleLinkPayment,
    handleConfirmLinkPayment,
  } = useButtonPayPhoneLinkHook({
    amount,
    addressId,
    paymentMethodId,
    clientTransactionId,
    onSuccess,
    orderId,
  })

  return (
    <>
      <Button
        onPress={handleLinkPayment}
        isDisabled={disabled || isPendingLink}
        className="flex flex-col items-center justify-center p-6 h-auto bg-linear-to-br from-coffee-light to-coffee-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-coffee hover:shadow-coffee-md transition-all duration-200 border-2 border-coffee-medium"
      >
        <Link size={24} className="mb-2" />
        <span className="text-base font-bold">
          {isPendingLink ? 'Procesando...' : 'Pagar con Link'}
        </span>
        <span className="text-xs mt-1 opacity-90">Página de pago dedicada</span>
      </Button>

      <LinkPaymentConfirmationModal
        isOpen={showLinkConfirmationModal}
        onClose={() => setShowLinkConfirmationModal(false)}
        onConfirm={handleConfirmLinkPayment}
        total={amount}
        formatPrice={formatPrice}
        isLoading={isPendingLink}
      />
    </>
  )
}
