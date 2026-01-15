import { Button, Form, Input, Modal, Select } from 'antd'
import { COUNTRIES } from '@/app/constants/countries'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Address = any

interface AddressModalProps {
  open: boolean
  onCancel: () => void
  onFinish: (values: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    reference?: string
    isDefault?: boolean
  }) => Promise<void>
  editingAddress: Address | null
  form: any
  addresses: Array<Address> | undefined
  isCreating: boolean
  isUpdating: boolean
}

export function AddressModal({
  open,
  onCancel,
  onFinish,
  editingAddress,
  form,
  addresses,
  isCreating,
  isUpdating,
}: AddressModalProps) {
  return (
    <Modal
      title={editingAddress ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
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
          name="country"
          label="País"
          rules={[{ required: true, message: 'Por favor ingresa el país' }]}
        >
          <Select
            size="large"
            placeholder="Selecciona un país"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={COUNTRIES}
          />
        </Form.Item>
        <Form.Item
          name="city"
          label="Ciudad"
          rules={[{ required: true, message: 'Por favor ingresa la ciudad' }]}
        >
          <Input size="large" placeholder="Ej: San Salvador" />
        </Form.Item>
        <Form.Item
          name="state"
          label="Estado/Departamento"
          rules={[{ required: true, message: 'Por favor ingresa el estado' }]}
        >
          <Input size="large" placeholder="Ej: San Salvador" />
        </Form.Item>
        <Form.Item
          name="zipCode"
          label="Código Postal"
          rules={[
            { required: true, message: 'Por favor ingresa el código postal' },
          ]}
        >
          <Input size="large" placeholder="Ej: 1101" />
        </Form.Item>
        <Form.Item
          name="street"
          label="Dirección"
          rules={[
            { required: true, message: 'Por favor ingresa la dirección' },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Ej: Calle Principal #123, Colonia Centro"
          />
        </Form.Item>
        <Form.Item name="reference" label="Referencia o más detalles">
          <Input.TextArea
            rows={2}
            placeholder="Ej: Casa azul, portón negro, cerca del parque"
          />
        </Form.Item>
        {addresses && addresses.length > 0 && (
          <Form.Item name="isDefault" valuePropName="checked">
            <input type="checkbox" className="mr-2" />
            <span>Establecer como dirección por defecto</span>
          </Form.Item>
        )}
        <Form.Item>
          <div className="flex gap-2 justify-end">
            <Button onClick={onCancel}>Cancelar</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
              className="bg-gradient-coffee border-none hover:opacity-90"
            >
              {editingAddress ? 'Actualizar Dirección' : 'Guardar Dirección'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}
