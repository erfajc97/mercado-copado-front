import { useState } from 'react'
import { Modal, Button, Tabs } from 'antd'
import { CreditCard, Smartphone, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import { ButtonPayPhone } from './ButtonPayPhone'
import { CashDepositUpload } from '@/app/features/checkout/components/CashDepositUpload'
import { useCashDepositMutation } from '@/app/features/payments/mutations/useCashDepositMutation'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'
import type { Address } from '@/app/features/addresses/types'
import type { PaymentMethod } from '@/app/features/payment-methods/types'

interface PaymentRetryModalProps {
  open: boolean
  onCancel: () => void
  orderId: string
  orderAmount: number
  addressId: string
  paymentMethodId?: string
  addresses: Address[]
  paymentMethods: PaymentMethod[]
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
  const [activeTab, setActiveTab] = useState('payphone')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'link' | 'phone' | null>(null)
  const [depositImage, setDepositImage] = useState<File | null>(null)
  const { mutateAsync: cashDeposit, isPending: isCashDepositPending } = useCashDepositMutation()

  const handleSuccess = () => {
    onSuccess?.()
    onCancel()
    setSelectedPaymentMethod(null)
    setDepositImage(null)
  }

  const handleLinkPayment = () => {
    setSelectedPaymentMethod('link')
  }

  const handlePhonePayment = () => {
    setSelectedPaymentMethod('phone')
  }

  const handleCashDepositSubmit = async () => {
    if (!depositImage) {
      sonnerResponse(
        'Por favor, sube una imagen del comprobante de depósito',
        'error',
      )
      return
    }

    try {
      const randomIdClientTransaction = Math.random()
        .toString(36)
        .substring(2, 15)

      await cashDeposit({
        addressId,
        clientTransactionId: randomIdClientTransaction,
        depositImage,
        orderId, // Pasar orderId para que el backend actualice la orden existente
      } as any) // Type assertion needed because orderId is not in the mutation type yet
      handleSuccess()
    } catch (error) {
      console.error('Error processing cash deposit:', error)
      // El error ya se maneja en la mutación con sonner
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
      title={
        <div className="flex items-center gap-2">
          <CreditCard size={20} className="text-coffee-dark" />
          <span className="text-coffee-darker font-bold text-lg">
            Pagar Orden #{orderId.slice(0, 8)}
          </span>
        </div>
      }
    >
      <div className="py-4">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key)
            setSelectedPaymentMethod(null)
          }}
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
                <div className="py-4">
                  {!selectedPaymentMethod ? (
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="default"
                        size="large"
                        onClick={handleLinkPayment}
                        className="h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-coffee-light/20 to-coffee-medium/20 border-2 border-coffee-medium hover:border-coffee-dark hover:shadow-lg transition-all"
                      >
                        <LinkIcon size={32} className="text-coffee-medium" />
                        <div className="text-center">
                          <div className="font-bold text-coffee-darker text-base">
                            Pagar con Link
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Página de pago dedicada
                          </div>
                        </div>
                      </Button>
                      <Button
                        type="default"
                        size="large"
                        onClick={handlePhonePayment}
                        className="h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-coffee-light/20 to-coffee-medium/20 border-2 border-coffee-medium hover:border-coffee-dark hover:shadow-lg transition-all"
                      >
                        <Smartphone size={32} className="text-coffee-medium" />
                        <div className="text-center">
                          <div className="font-bold text-coffee-darker text-base">
                            Pagar con Teléfono
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Notificación en la app
                          </div>
                        </div>
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        type="text"
                        onClick={() => setSelectedPaymentMethod(null)}
                        className="mb-4 text-coffee-medium hover:text-coffee-dark"
                      >
                        ← Volver
                      </Button>
                      <ButtonPayPhone
                        amount={orderAmount}
                        addressId={addressId}
                        paymentMethodId={paymentMethodId}
                        addresses={addresses}
                        paymentMethods={paymentMethods}
                        orderId={orderId}
                        onSuccess={handleSuccess}
                        // Forzar el método de pago seleccionado
                        forcePaymentMethod={selectedPaymentMethod}
                      />
                    </div>
                  )}
                </div>
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
                <div className="py-4 space-y-4">
                  <CashDepositUpload
                    onImageSelect={setDepositImage}
                    selectedImage={depositImage}
                  />
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleCashDepositSubmit}
                    loading={isCashDepositPending}
                    disabled={!depositImage || isCashDepositPending}
                    className="w-full bg-gradient-coffee border-none hover:opacity-90"
                  >
                    {isCashDepositPending
                      ? 'Procesando...'
                      : 'Enviar Comprobante'}
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </div>
    </Modal>
  )
}
