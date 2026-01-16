import { FormPaymentMethod } from '../FormPaymentMethod'
import type { Form } from 'antd'
import type { PaymentMethod } from '@/app/features/payment-methods/types'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface PaymentMethodFormModalProps {
  isOpen: boolean
  onClose: () => void
  form: ReturnType<typeof Form.useForm<any>>[0]
  paymentMethods: Array<PaymentMethod> | undefined
  isLoading: boolean
  onFinish: (values: {
    gatewayToken: string
    cardBrand: string
    last4Digits: string
    expirationMonth: number
    expirationYear: number
    isDefault?: boolean
  }) => Promise<void>
}

export function PaymentMethodFormModal({
  isOpen,
  onClose,
  form,
  paymentMethods,
  isLoading,
  onFinish,
}: PaymentMethodFormModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable
      size="2xl"
      placement="center"
      headerContent="Agregar Método de Pago"
    >
      <FormPaymentMethod
        form={form}
        paymentMethods={paymentMethods}
        isLoading={isLoading}
        onFinish={onFinish}
        onCancel={onClose}
      />
    </CustomModalNextUI>
  )
}
