import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, Card, Form, Input, Modal } from 'antd'
import { Edit, Home, MapPin, Plus, Trash2 } from 'lucide-react'
import { useAddressesQuery } from '@/app/features/addresses/queries/useAddressesQuery'
import { useCreateAddressMutation } from '@/app/features/addresses/mutations/useCreateAddressMutation'
import { useDeleteAddressMutation } from '@/app/features/addresses/mutations/useDeleteAddressMutation'
import { useSetDefaultAddressMutation } from '@/app/features/addresses/mutations/useSetDefaultAddressMutation'
import { useUpdateAddressMutation } from '@/app/features/addresses/mutations/useUpdateAddressMutation'

export const Route = createFileRoute('/profile')({
  component: Profile,
})

function Profile() {
  const { data: addresses, refetch: refetchAddresses } = useAddressesQuery()
  const { mutateAsync: createAddress, isPending: isCreatingAddress } =
    useCreateAddressMutation()
  const { mutateAsync: deleteAddress } = useDeleteAddressMutation()
  const { mutateAsync: setDefaultAddress } = useSetDefaultAddressMutation()
  const { mutateAsync: updateAddress, isPending: isUpdatingAddress } =
    useUpdateAddressMutation()
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [form] = Form.useForm()

  const handleCreateAddress = async (values: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    reference?: string
    isDefault?: boolean
  }) => {
    try {
      if (editingAddress) {
        await updateAddress({
          addressId: editingAddress.id,
          data: values,
        })
      } else {
        await createAddress({
          ...values,
          isDefault:
            addresses && addresses.length === 0 ? true : values.isDefault,
        })
      }
      await refetchAddresses()
      setShowAddressForm(false)
      setEditingAddress(null)
      form.resetFields()
    } catch (error) {
      console.error('Error saving address:', error)
    }
  }

  const handleEditAddress = (address: any) => {
    setEditingAddress(address)
    form.setFieldsValue(address)
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId)
      await refetchAddresses()
    } catch (error) {
      console.error('Error deleting address:', error)
    }
  }

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId)
      await refetchAddresses()
    } catch (error) {
      console.error('Error setting default address:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-coffee-darker">Mi Perfil</h1>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-coffee-darker flex items-center gap-2">
            <MapPin size={24} />
            Mis Direcciones
          </h2>
          <Button
            type="primary"
            icon={<Plus size={18} />}
            onClick={() => {
              setEditingAddress(null)
              form.resetFields()
              setShowAddressForm(true)
            }}
            className="bg-gradient-coffee border-none hover:opacity-90"
          >
            Agregar Dirección
          </Button>
        </div>

        {addresses && addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address: any) => (
              <Card
                key={address.id}
                className={`shadow-coffee ${
                  address.isDefault ? 'border-2 border-coffee-medium' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-coffee-darker mb-2">
                      {address.street}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {address.city}, {address.state}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      {address.zipCode}, {address.country}
                    </p>
                    {address.reference && (
                      <p className="text-xs text-gray-500 mt-2">
                        <strong>Referencia:</strong> {address.reference}
                      </p>
                    )}
                    {address.isDefault && (
                      <span className="mt-2 bg-coffee-medium text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Home size={12} />
                        Por defecto
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(address.id)}
                        className="p-2 text-coffee-medium hover:bg-coffee-light rounded-lg transition-colors text-xs"
                        aria-label="Establecer como predeterminada"
                        title="Establecer como predeterminada"
                      >
                        <Home size={16} />
                      </button>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditAddress(address)}
                        className="p-2 text-coffee-medium hover:bg-coffee-light rounded-lg transition-colors"
                        aria-label="Editar dirección"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Eliminar dirección"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-coffee">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              No tienes direcciones guardadas
            </p>
            <Button
              type="primary"
              icon={<Plus size={18} />}
              onClick={() => {
                setEditingAddress(null)
                form.resetFields()
                setShowAddressForm(true)
              }}
              className="bg-gradient-coffee border-none hover:opacity-90"
            >
              Agregar Primera Dirección
            </Button>
          </div>
        )}
      </div>

      <Modal
        title={editingAddress ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
        open={showAddressForm}
        onCancel={() => {
          setShowAddressForm(false)
          setEditingAddress(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateAddress}
          className="mt-4"
        >
          <Form.Item
            name="country"
            label="País"
            rules={[{ required: true, message: 'Por favor ingresa el país' }]}
          >
            <Input size="large" placeholder="Ej: El Salvador" />
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
              <Button
                onClick={() => {
                  setShowAddressForm(false)
                  setEditingAddress(null)
                  form.resetFields()
                }}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreatingAddress || isUpdatingAddress}
                className="bg-gradient-coffee border-none hover:opacity-90"
              >
                {editingAddress ? 'Actualizar Dirección' : 'Guardar Dirección'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
