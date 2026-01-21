import { CreditCard } from 'lucide-react'
import { usePaymentRetryModalHook } from '../hooks/usePaymentRetryModalHook'
import { PaymentRetryModalTabs } from './tabs/PaymentRetryModalTabs'
import type { Address } from '@/app/features/addresses/types'
import type { PaymentMethod } from '@/app/features/payment-cards/types'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface PaymentRetryModalProps {
  open: boolean
  onCancel: () => void
  orderId: string
  orderAmount: number
  addressId: string
  paymentMethodId?: string
  addresses: Array<Address>
  paymentMethods: Array<PaymentMethod>
  onSuccess?: () => void
}

export const PaymentRetryModal = ({
  open,
  onCancel,
  orderId,
  orderAmount,
  addressId,
  paymentMethodId,
  addresses,
  paymentMethods,
  onSuccess,
}: PaymentRetryModalProps) => {
  const {
    activeTab,
    depositImage,
    setDepositImage,
    isCashDepositPending,
    handleCashDepositSubmit,
    handleTabChange,
    handleSuccess,
    cryptoDepositImage,
    setCryptoDepositImage,
    isCryptoDepositPending,
    handleCryptoDepositSubmit,
    showMercadoPago,
  } = usePaymentRetryModalHook({
    orderId,
    addressId,
    onSuccess,
    onCancel,
  })

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onCancel()
    }
  }

  return (
    <CustomModalNextUI
      isOpen={open}
      onOpenChange={handleOpenChange}
      isDismissable
      size="2xl"
      placement="center"
      headerContent={
        <div className="flex items-center gap-2">
          <CreditCard size={20} className="text-coffee-dark" />
          <span className="text-coffee-darker font-bold text-lg">
            Pagar Orden #{orderId.slice(0, 8)}
          </span>
        </div>
      }
    >
      <div className="py-4">
        <PaymentRetryModalTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          orderAmount={orderAmount}
          addressId={addressId}
          paymentMethodId={paymentMethodId}
          addresses={addresses}
          paymentMethods={paymentMethods}
          orderId={orderId}
          onSuccess={handleSuccess}
          depositImage={depositImage}
          setDepositImage={setDepositImage}
          isCashDepositPending={isCashDepositPending}
          onCashDepositSubmit={handleCashDepositSubmit}
          cryptoDepositImage={cryptoDepositImage}
          setCryptoDepositImage={setCryptoDepositImage}
          isCryptoDepositPending={isCryptoDepositPending}
          onCryptoDepositSubmit={handleCryptoDepositSubmit}
          showMercadoPago={showMercadoPago}
        />
      </div>
    </CustomModalNextUI>
  )
}
