import { Form, Input } from 'antd'
import { Button } from '@heroui/react'
import { useRef } from 'react'
import type { PaymentMethod } from '@/app/features/payment-methods/types'

interface FormPaymentMethodProps {
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
  onCancel?: () => void
}

export function FormPaymentMethod({
  form,
  paymentMethods,
  isLoading,
  onFinish,
  onCancel,
}: FormPaymentMethodProps) {
  const formRef = useRef<HTMLDivElement>(null)

  const handleFormFinish = async (values: any) => {
    const expirationDate = values.expirationDate?.split('/')
    await onFinish({
      gatewayToken: values.gatewayToken || 'temp-token',
      cardBrand: values.cardBrand || 'Visa',
      last4Digits: values.last4Digits,
      expirationMonth: expirationDate
        ? parseInt(expirationDate[0])
        : 12,
      expirationYear: expirationDate
        ? 2000 + parseInt(expirationDate[1])
        : 2025,
      isDefault: values.isDefault,
    })
  }

  return (
    <div ref={formRef}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormFinish}
        className="mt-2"
      >
        {/* Grupo 1: Marca de Tarjeta y Últimos 4 Dígitos */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <Form.Item
            name="cardBrand"
            label="Marca de Tarjeta"
            rules={[{ required: true, message: 'Ingresa la marca' }]}
          >
            <Input placeholder="Ej: Visa, Mastercard, Amex" />
          </Form.Item>
          <Form.Item
            name="last4Digits"
            label="Últimos 4 Dígitos"
            rules={[
              { required: true, message: 'Ingresa los últimos 4 dígitos' },
              { len: 4, message: 'Debe tener 4 dígitos' },
            ]}
          >
            <Input placeholder="1234" maxLength={4} />
          </Form.Item>
        </div>

        {/* Grupo 2: Fecha de Vencimiento y Token */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <Form.Item
            name="expirationDate"
            label="Fecha de Vencimiento (MM/YY)"
            rules={[
              { required: true, message: 'Ingresa la fecha de vencimiento' },
            ]}
          >
            <Input placeholder="MM/YY" maxLength={5} />
          </Form.Item>
          <Form.Item
            name="gatewayToken"
            label="Token del Gateway"
            rules={[{ required: true, message: 'Ingresa el token' }]}
          >
            <Input placeholder="Token del proveedor de pago" />
          </Form.Item>
        </div>

        {/* Grupo 3: Checkbox isDefault */}
        {paymentMethods && paymentMethods.length > 0 && (
          <div className="mb-3">
            <Form.Item name="isDefault" valuePropName="checked">
              <input type="checkbox" className="mr-2" />
              <span>Establecer como método por defecto</span>
            </Form.Item>
          </div>
        )}

        {/* Grupo 4: Botones de acción */}
        <Form.Item>
          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button
                variant="light"
                onPress={onCancel}
                isDisabled={isLoading}
              >
                Cancelar
              </Button>
            )}
            <Button
              color="primary"
              onPress={() => form.submit()}
              isLoading={isLoading}
              isDisabled={isLoading}
              className="bg-gradient-coffee border-none hover:opacity-90"
            >
              Guardar
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}
