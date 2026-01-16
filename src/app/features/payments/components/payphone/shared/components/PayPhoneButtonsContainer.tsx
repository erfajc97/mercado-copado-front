import { ButtonPayPhoneLink } from '../../link/components/ButtonPayPhoneLink'
import { ButtonPayPhonePhone } from '../../phone/components/ButtonPayPhonePhone'

interface PayPhoneButtonsContainerProps {
  amount: number
  addressId: string
  paymentMethodId: string
  clientTransactionId?: string
  onSuccess?: () => void
  disabled?: boolean
  orderId?: string
  addresses?: Array<any>
  paymentMethods?: Array<any>
  forcePaymentMethod?: 'link' | 'phone' | null
}

export const PayPhoneButtonsContainer = ({
  amount,
  addressId,
  paymentMethodId,
  clientTransactionId,
  onSuccess,
  disabled,
  orderId,
  forcePaymentMethod,
}: PayPhoneButtonsContainerProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {forcePaymentMethod === 'link' ? (
        <ButtonPayPhoneLink
          amount={amount}
          addressId={addressId}
          paymentMethodId={paymentMethodId}
          clientTransactionId={clientTransactionId}
          onSuccess={onSuccess}
          disabled={disabled}
          orderId={orderId}
        />
      ) : forcePaymentMethod === 'phone' ? (
        <ButtonPayPhonePhone
          amount={amount}
          addressId={addressId}
          paymentMethodId={paymentMethodId}
          clientTransactionId={clientTransactionId}
          onSuccess={onSuccess}
          disabled={disabled}
          orderId={orderId}
        />
      ) : (
        <>
          <ButtonPayPhoneLink
            amount={amount}
            addressId={addressId}
            paymentMethodId={paymentMethodId}
            clientTransactionId={clientTransactionId}
            onSuccess={onSuccess}
            disabled={disabled}
            orderId={orderId}
          />
          <ButtonPayPhonePhone
            amount={amount}
            addressId={addressId}
            paymentMethodId={paymentMethodId}
            clientTransactionId={clientTransactionId}
            onSuccess={onSuccess}
            disabled={disabled}
            orderId={orderId}
          />
        </>
      )}
    </div>
  )
}
