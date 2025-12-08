import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button, Form, Input, Modal } from 'antd'
import { Home } from 'lucide-react'
import { useCartQuery } from '@/app/features/cart/queries/useCartQuery'
import { useAddressesQuery } from '@/app/features/addresses/queries/useAddressesQuery'
import { useCreateOrderMutation } from '@/app/features/orders/mutations/useOrderMutations'
import { useCreateAddressMutation } from '@/app/features/addresses/mutations/useCreateAddressMutation'
import { ButtonPayPhone } from '@/app/components/payphone/components/ButtonPayPhone'

export const Route = createFileRoute('/checkout')({
  component: Checkout,
})

function Checkout() {
  const navigate = useNavigate()
  const { data: cartItems } = useCartQuery()
  const { data: addresses, refetch: refetchAddresses } = useAddressesQuery()
  const { mutateAsync: createOrder, isPending } = useCreateOrderMutation()
  const { mutateAsync: createAddress, isPending: isCreatingAddress } =
    useCreateAddressMutation()
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderTotal, setOrderTotal] = useState<number>(0)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showAddressSelector, setShowAddressSelector] = useState(false)
  const [form] = Form.useForm()

  const defaultAddress = addresses?.find((addr: any) => addr.isDefault)

  useEffect(() => {
    if (
      !defaultAddress &&
      !selectedAddressId &&
      addresses &&
      addresses.length > 0
    ) {
      setSelectedAddressId(addresses[0].id)
    } else if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress.id)
    }
  }, [addresses, defaultAddress, selectedAddressId])

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
      const newAddress = await createAddress({
        ...values,
        isDefault:
          addresses && addresses.length === 0 ? true : values.isDefault,
      })
      await refetchAddresses()
      setSelectedAddressId(newAddress.id)
      setShowAddressForm(false)
      form.resetFields()
    } catch (error) {
      console.error('Error creating address:', error)
    }
  }

  const calculateTotal = () => {
    if (!cartItems) return 0
    return cartItems.reduce((total: number, item: any) => {
      const price = Number(item.product.price)
      const discount = Number(item.product.discount || 0)
      const finalPrice = price * (1 - discount / 100)
      return total + finalPrice * item.quantity
    }, 0)
  }

  const handleCreateOrder = async () => {
    if (!selectedAddressId) {
      alert('Por favor, selecciona una dirección')
      return
    }

    try {
      const order = await createOrder({ addressId: selectedAddressId })
      setOrderId(order.id)
      setOrderTotal(Number(order.total))
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Error al crear la orden. Por favor, intenta nuevamente.')
    }
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Carrito Vacío</h1>
        <p className="text-gray-600 mb-6">
          No tienes productos en tu carrito para checkout
        </p>
      </div>
    )
  }

  const total = calculateTotal()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-coffee-darker">
        Finalizar Compra
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-coffee p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-coffee-darker">
                Dirección de Envío
              </h2>
            </div>
            {defaultAddress ? (
              <div className="space-y-4">
                <div className="p-4 border-2 border-coffee-medium bg-coffee-light/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Home size={24} className="text-coffee-medium mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-coffee-medium text-white px-2 py-1 rounded">
                          Por defecto
                        </span>
                      </div>
                      <p className="font-semibold text-coffee-darker">
                        {defaultAddress.street}, {defaultAddress.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        {defaultAddress.state}, {defaultAddress.zipCode},{' '}
                        {defaultAddress.country}
                      </p>
                      {defaultAddress.reference && (
                        <p className="text-xs text-gray-500 mt-1">
                          Referencia: {defaultAddress.reference}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {addresses && addresses.length > 1 && (
                  <Button
                    type="default"
                    onClick={() => setShowAddressSelector(true)}
                    className="w-full"
                  >
                    Cambiar por dirección existente
                  </Button>
                )}
              </div>
            ) : addresses && addresses.length > 0 ? (
              <div className="space-y-2">
                {addresses.map((address: any) => (
                  <label
                    key={address.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedAddressId === address.id
                        ? 'border-coffee-medium bg-coffee-light/20'
                        : 'border-gray-200 hover:border-coffee-light'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="mr-2"
                    />
                    <div>
                      <p className="font-semibold text-coffee-darker">
                        {address.street}, {address.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.state}, {address.zipCode}, {address.country}
                      </p>
                      {address.reference && (
                        <p className="text-xs text-gray-500 mt-1">
                          Referencia: {address.reference}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  No tienes direcciones. Agrega una dirección para continuar.
                </p>
                <Button
                  type="primary"
                  onClick={() => setShowAddressForm(true)}
                  className="bg-gradient-coffee border-none hover:opacity-90"
                >
                  Agregar Dirección
                </Button>
              </div>
            )}
          </div>

          <Modal
            title="Seleccionar Dirección"
            open={showAddressSelector}
            onCancel={() => setShowAddressSelector(false)}
            footer={null}
            width={600}
          >
            <div className="space-y-2 mt-4">
              {addresses
                ?.filter((addr: any) => addr.id !== defaultAddress?.id)
                .map((address: any) => (
                  <label
                    key={address.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedAddressId === address.id
                        ? 'border-coffee-medium bg-coffee-light/20'
                        : 'border-gray-200 hover:border-coffee-light'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectAddress"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={(e) => {
                        setSelectedAddressId(e.target.value)
                        setShowAddressSelector(false)
                      }}
                      className="mr-2"
                    />
                    <div>
                      <p className="font-semibold text-coffee-darker">
                        {address.street}, {address.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.state}, {address.zipCode}, {address.country}
                      </p>
                      {address.reference && (
                        <p className="text-xs text-gray-500 mt-1">
                          Referencia: {address.reference}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
            </div>
          </Modal>

          <Modal
            title="Agregar Nueva Dirección"
            open={showAddressForm}
            onCancel={() => {
              setShowAddressForm(false)
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
                rules={[
                  { required: true, message: 'Por favor ingresa el país' },
                ]}
              >
                <Input size="large" placeholder="Ej: El Salvador" />
              </Form.Item>
              <Form.Item
                name="city"
                label="Ciudad"
                rules={[
                  { required: true, message: 'Por favor ingresa la ciudad' },
                ]}
              >
                <Input size="large" placeholder="Ej: San Salvador" />
              </Form.Item>
              <Form.Item
                name="state"
                label="Estado/Departamento"
                rules={[
                  { required: true, message: 'Por favor ingresa el estado' },
                ]}
              >
                <Input size="large" placeholder="Ej: San Salvador" />
              </Form.Item>
              <Form.Item
                name="zipCode"
                label="Código Postal"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingresa el código postal',
                  },
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
                      form.resetFields()
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isCreatingAddress}
                    className="bg-gradient-coffee border-none hover:opacity-90"
                  >
                    Guardar Dirección
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>

          <div className="bg-white rounded-lg shadow-coffee p-6">
            <h2 className="text-xl font-bold mb-4 text-coffee-darker">
              Resumen de Orden
            </h2>
            <div className="space-y-4">
              {cartItems.map((item: any) => {
                const price = Number(item.product.price)
                const discount = Number(item.product.discount || 0)
                const finalPrice = price * (1 - discount / 100)
                const mainImage =
                  item.product.images && item.product.images.length > 0
                    ? item.product.images[0].url
                    : null
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    {mainImage && (
                      <img
                        src={mainImage}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-coffee-darker mb-1">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">Cantidad:</span>
                        <span className="bg-coffee-medium text-white px-2 py-1 rounded-full text-sm font-bold">
                          x{item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {discount > 0 && (
                          <span className="text-gray-400 line-through text-sm">
                            ${price.toFixed(2)}
                          </span>
                        )}
                        <span className="text-coffee-dark font-bold">
                          ${finalPrice.toFixed(2)} c/u
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-coffee-darker">
                        ${(finalPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Total</h2>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {!orderId ? (
              <button
                onClick={handleCreateOrder}
                disabled={isPending || !selectedAddressId}
                className="w-full bg-gradient-coffee text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold mb-4 shadow-coffee hover:shadow-coffee-md transition-all duration-200"
              >
                {isPending ? 'Creando orden...' : 'Crear Orden'}
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-green-600 font-semibold">
                  Orden creada exitosamente
                </p>
                <ButtonPayPhone
                  amount={orderTotal}
                  orderId={orderId}
                  onSuccess={() => {
                    navigate({ to: '/orders' })
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
