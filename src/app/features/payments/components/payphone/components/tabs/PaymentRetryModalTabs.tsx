import { Tabs } from 'antd'
import { CreditCard, Image as ImageIcon } from 'lucide-react'
import { PayphoneTab } from './PayphoneTab'
import { CashDepositTab } from './CashDepositTab'
import type { Address } from '@/app/features/addresses/types'
import type { PaymentMethod } from '@/app/features/payment-cards/types'

interface PaymentRetryModalTabsProps {
  activeTab: string
  onTabChange: (key: string) => void
  // Payphone tab props
  orderAmount: number
  addressId: string
  paymentMethodId?: string
  addresses: Array<Address>
  paymentMethods: Array<PaymentMethod>
  orderId: string
  onSuccess?: () => void
  // Cash deposit tab props
  depositImage: File | null
  setDepositImage: (file: File | null) => void
  isCashDepositPending: boolean
  onCashDepositSubmit: () => void
}

export const PaymentRetryModalTabs = ({
  activeTab,
  onTabChange,
  orderAmount,
  addressId,
  paymentMethodId,
  addresses,
  paymentMethods,
  orderId,
  onSuccess,
  depositImage,
  setDepositImage,
  isCashDepositPending,
  onCashDepositSubmit,
}: PaymentRetryModalTabsProps) => {
  return (
    <Tabs
      activeKey={activeTab}
      onChange={onTabChange}
      items={[
        {
          key: 'payphone',
          label: (
            <span className="flex items-center gap-2">
              <CreditCard size={16} />
              Payphone
            </span>
          ),
          children: (
            <PayphoneTab
              orderAmount={orderAmount}
              addressId={addressId}
              paymentMethodId={paymentMethodId}
              addresses={addresses}
              paymentMethods={paymentMethods}
              orderId={orderId}
              onSuccess={onSuccess}
            />
          ),
        },
        {
          key: 'cash',
          label: (
            <span className="flex items-center gap-2">
              <ImageIcon size={16} />
              Depósito en Efectivo
            </span>
          ),
          children: (
            <CashDepositTab
              depositImage={depositImage}
              setDepositImage={setDepositImage}
              isCashDepositPending={isCashDepositPending}
              onCashDepositSubmit={onCashDepositSubmit}
            />
          ),
        },
      ]}
    />
  )
}
