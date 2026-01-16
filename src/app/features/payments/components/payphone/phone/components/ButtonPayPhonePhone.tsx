import { Button } from '@heroui/react'
import { Smartphone } from 'lucide-react'
import { useButtonPayPhonePhoneHook } from '../hooks/useButtonPayPhonePhoneHook'
import { PhonePaymentModal } from './modals/PhonePaymentModal'

interface ButtonPayPhonePhoneProps {
  amount: number
  addressId: string
  paymentMethodId: string
  clientTransactionId?: string
  onSuccess?: () => void
  disabled?: boolean
  orderId?: string
}

export const ButtonPayPhonePhone = ({
  amount,
  addressId,
  paymentMethodId,
  clientTransactionId,
  onSuccess,
  disabled,
  orderId,
}: ButtonPayPhonePhoneProps) => {
  const {
    showPhoneModal,
    setShowPhoneModal,
    phoneNumber,
    setPhoneNumber,
    userInfo,
    isPendingPhone,
    handlePhonePayment,
    handleClosePhoneModal,
  } = useButtonPayPhonePhoneHook({
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
        onPress={() => setShowPhoneModal(true)}
        isDisabled={disabled}
        className="flex flex-col items-center justify-center p-6 h-auto bg-linear-to-br from-coffee-medium to-coffee-dark text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-coffee hover:shadow-coffee-md transition-all duration-200 border-2 border-coffee-dark"
      >
        <Smartphone size={24} className="mb-2" />
        <span className="text-base font-bold">Pagar con Teléfono</span>
        <span className="text-xs mt-1 opacity-90">Notificación en la app</span>
      </Button>

      <PhonePaymentModal
        isOpen={showPhoneModal}
        onClose={handleClosePhoneModal}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        userInfo={userInfo}
        onConfirm={handlePhonePayment}
        isLoading={isPendingPhone}
      />
    </>
  )
}
