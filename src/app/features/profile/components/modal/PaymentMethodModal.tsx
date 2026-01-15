import { Button, Form, Input, Modal, Select } from 'antd'

interface PaymentMethodModalProps {
  open: boolean
  onCancel: () => void
  onFinish: (values: {
    gatewayToken: string
    cardBrand: string
    last4Digits: string
    expirationMonth: number
    expirationYear: number
    isDefault?: boolean
  }) => Promise<void>
  form: any
  paymentMethods: Array<any> | undefined
  isCreating: boolean
}

export function PaymentMethodModal({
  open,
  onCancel,
  onFinish,
  form,
  paymentMethods,
  isCreating,
}: PaymentMethodModalProps) {
  return (
    <Modal
      title="Agregar Nueva Tarjeta"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="mt-4"
      >
        <Form.Item
          name="gatewayToken"
          label="Token del Gateway"
          rules={[
            {
              required: true,
              message: 'El token del gateway es requerido',
            },
          ]}
          tooltip="Este token será generado por el gateway de pago (Payphone, Stripe, etc.)"
        >
          <Input size="large" placeholder="Token generado por el gateway" />
        </Form.Item>

        <Form.Item
          name="cardBrand"
          label="Marca de la Tarjeta"
          rules={[
            {
              required: true,
              message: 'La marca de la tarjeta es requerida',
            },
          ]}
        >
          <Select
            size="large"
            placeholder="Selecciona la marca"
            options={[
              { value: 'Visa', label: 'Visa' },
              { value: 'Mastercard', label: 'Mastercard' },
              { value: 'American Express', label: 'American Express' },
              { value: 'Discover', label: 'Discover' },
              { value: 'Diners Club', label: 'Diners Club' },
              { value: 'JCB', label: 'JCB' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="last4Digits"
          label="Últimos 4 Dígitos"
          rules={[
            {
              required: true,
              message: 'Los últimos 4 dígitos son requeridos',
            },
            {
              pattern: /^[0-9]{4}$/,
              message: 'Debe contener exactamente 4 dígitos',
            },
          ]}
        >
          <Input size="large" placeholder="1234" maxLength={4} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="expirationMonth"
            label="Mes de Expiración"
            rules={[
              {
                required: true,
                message: 'El mes de expiración es requerido',
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Mes"
              options={Array.from({ length: 12 }, (_, i) => ({
                value: i + 1,
                label: (i + 1).toString().padStart(2, '0'),
              }))}
            />
          </Form.Item>

          <Form.Item
            name="expirationYear"
            label="Año de Expiración"
            rules={[
              {
                required: true,
                message: 'El año de expiración es requerido',
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Año"
              options={Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() + i
                return { value: year, label: year.toString() }
              })}
            />
          </Form.Item>
        </div>

        {paymentMethods && paymentMethods.length > 0 && (
          <Form.Item name="isDefault" valuePropName="checked">
            <input type="checkbox" className="mr-2" />
            <span>Establecer como tarjeta predeterminada</span>
          </Form.Item>
        )}

        <Form.Item>
          <div className="flex gap-2 justify-end">
            <Button onClick={onCancel}>Cancelar</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating}
              className="bg-gradient-coffee border-none hover:opacity-90"
            >
              Guardar Tarjeta
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}
