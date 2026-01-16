import { Form, Input, Select } from 'antd'
import { Button } from '@heroui/react'
import { useRef } from 'react'
import type { Address, CreateAddressData } from '@/app/features/addresses/types'
import { COUNTRIES } from '@/app/constants/countries'

interface FormAddressesProps {
  form: ReturnType<typeof Form.useForm<CreateAddressData>>[0]
  addresses: Array<Address> | undefined
  isLoading: boolean
  editingAddress: Address | null
  onFinish: (values: CreateAddressData) => Promise<void>
  onCancel?: () => void
}

export function FormAddresses({
  form,
  addresses,
  isLoading,
  editingAddress,
  onFinish,
  onCancel,
}: FormAddressesProps) {
  const formRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={formRef}>
      <Form form={form} layout="vertical" onFinish={onFinish} className="mt-2">
        {/* Grupo 1: País y Ciudad */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <Form.Item
            name="country"
            label="País"
            rules={[{ required: true, message: 'Por favor ingresa el país' }]}
          >
            <Select
              size="large"
              placeholder="Selecciona un país"
              showSearch
              getPopupContainer={(trigger) => {
                // Renderizar el dropdown dentro del contenedor del formulario para evitar que cierre la modal
                return formRef.current || trigger.parentElement || document.body
              }}
              onClick={(e) => {
                // Prevenir que el evento se propague y cierre la modal
                e.stopPropagation()
              }}
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
        </div>

        {/* Grupo 2: Estado/Departamento y Código Postal */}
        <div className="grid grid-cols-2 gap-4 mb-3">
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
        </div>

        {/* Grupo 3: Dirección (campo largo) */}
        <div className="mb-3">
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
        </div>

        {/* Grupo 4: Referencia (opcional) */}
        <div className="mb-3">
          <Form.Item name="reference" label="Referencia o más detalles">
            <Input.TextArea
              rows={2}
              placeholder="Ej: Casa azul, portón negro, cerca del parque"
            />
          </Form.Item>
        </div>

        {/* Grupo 5: Checkbox isDefault */}
        {addresses && addresses.length > 0 && (
          <div className="mb-3">
            <Form.Item name="isDefault" valuePropName="checked">
              <input type="checkbox" className="mr-2" />
              <span>Establecer como dirección por defecto</span>
            </Form.Item>
          </div>
        )}

        {/* Grupo 6: Botones de acción */}
        <Form.Item>
          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button variant="light" onPress={onCancel} isDisabled={isLoading}>
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
              {editingAddress ? 'Actualizar Dirección' : 'Guardar Dirección'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}
