import { PayPhoneButtonsContainer } from '../../shared/components/PayPhoneButtonsContainer'
import type { Address } from '@/app/features/addresses/types'
import type { PaymentMethod } from '@/app/features/payment-cards/types'

interface PayphoneTabProps {
  orderAmount: number
  addressId: string
  paymentMethodId?: string
  addresses: Array<Address>
  paymentMethods: Array<PaymentMethod>
  orderId: string
  onSuccess?: () => void
}

export const PayphoneTab = ({
  orderAmount,
  addressId,
  paymentMethodId,
  addresses,
  paymentMethods,
  orderId,
  onSuccess,
}: PayphoneTabProps) => {
  return (
    <div className="py-4">
      <PayPhoneButtonsContainer
        amount={orderAmount}
        addressId={addressId}
        paymentMethodId={paymentMethodId || 'payphone-default'}
        addresses={addresses}
        paymentMethods={paymentMethods}
        orderId={orderId}
        onSuccess={onSuccess}
      />
    </div>
  )
}
