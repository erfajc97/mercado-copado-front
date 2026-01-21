import { Tabs } from 'antd'
import { Bitcoin, CreditCard, Image as ImageIcon, Wallet } from 'lucide-react'
import { PayphoneTab } from './PayphoneTab'
import { CashDepositTab } from './CashDepositTab'
import { MercadoPagoTab } from './MercadoPagoTab'
import { CryptoTab } from './CryptoTab'
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
  // Crypto deposit tab props
  cryptoDepositImage: File | null
  setCryptoDepositImage: (file: File | null) => void
  isCryptoDepositPending: boolean
  onCryptoDepositSubmit: () => void
  // MercadoPago visibility
  showMercadoPago: boolean
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
  cryptoDepositImage,
  setCryptoDepositImage,
  isCryptoDepositPending,
  onCryptoDepositSubmit,
  showMercadoPago,
}: PaymentRetryModalTabsProps) => {
  const tabItems = [
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
          Depósito
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
    {
      key: 'crypto',
      label: (
        <span className="flex items-center gap-2">
          <Bitcoin size={16} />
          Crypto
        </span>
      ),
      children: (
        <CryptoTab
          depositImage={cryptoDepositImage}
          setDepositImage={setCryptoDepositImage}
          isCryptoDepositPending={isCryptoDepositPending}
          onCryptoDepositSubmit={onCryptoDepositSubmit}
        />
      ),
    },
  ]

  // Agregar tab de Mercado Pago solo si está disponible (Argentina)
  if (showMercadoPago) {
    tabItems.splice(1, 0, {
      key: 'mercadopago',
      label: (
        <span className="flex items-center gap-2">
          <Wallet size={16} />
          Mercado Pago
        </span>
      ),
      children: (
        <MercadoPagoTab
          orderId={orderId}
          orderAmount={orderAmount}
          onSuccess={onSuccess}
        />
      ),
    })
  }

  return (
    <Tabs activeKey={activeTab} onChange={onTabChange} items={tabItems} />
  )
}
