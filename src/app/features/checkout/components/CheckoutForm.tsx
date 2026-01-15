import { Button, Form, Input, Modal } from 'antd'
import { Home } from 'lucide-react'
import { PaymentProviderSelector } from './PaymentProviderSelector'
import { CashDepositUpload } from './CashDepositUpload'
import type { CheckoutHookReturn } from './types'
import { ButtonPayPhone } from '@/app/components/payphone/components/ButtonPayPhone'

interface CheckoutFormProps {
  checkout: CheckoutHookReturn
}

export const CheckoutForm = ({ checkout }: CheckoutFormProps) => {
  return (
    <div className="space-y-6">
      {/* Address Section */}
      <div className="bg-white rounded-lg shadow-coffee p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-coffee-darker">
            Dirección de Envío
          </h2>
        </div>
        {(() => {
          // Determinar qué dirección mostrar: priorizar selectedAddressId sobre defaultAddress
          const selectedAddress =
            checkout.selectedAddressId &&
            checkout.addresses?.find(
              (addr: any) => addr.id === checkout.selectedAddressId,
            )
          const displayAddress =
            selectedAddress ||
            checkout.defaultAddress ||
            (checkout.addresses && checkout.addresses.length > 0
              ? checkout.addresses[0]
              : null)

          if (!displayAddress) {
            return (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  No tienes direcciones. Agrega una dirección para continuar.
                </p>
                <Button
                  type="primary"
                  onClick={() => checkout.setShowAddressForm(true)}
                  className="bg-gradient-coffee border-none hover:opacity-90"
                >
                  Agregar Dirección
                </Button>
              </div>
            )
          }

          const isDefaultAddress =
            displayAddress.id === checkout.defaultAddress?.id
          const isSelectedAddress =
            checkout.selectedAddressId === displayAddress.id

          return (
            <div className="space-y-4">
              <div className="p-4 border-2 border-coffee-medium bg-coffee-light/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Home size={24} className="text-coffee-medium mt-1" />
                  <div className="flex-1">
                    {isDefaultAddress && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-coffee-medium text-white px-2 py-1 rounded">
                          Por defecto
                        </span>
                      </div>
                    )}
                    {isSelectedAddress && !isDefaultAddress && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                          Seleccionada
                        </span>
                      </div>
                    )}
                    <p className="font-semibold text-coffee-darker">
                      {displayAddress.street}, {displayAddress.city}
                    </p>
                    <p className="text-sm text-gray-600">
                      {displayAddress.state}, {displayAddress.zipCode},{' '}
                      {displayAddress.country}
                    </p>
                    {displayAddress.reference && (
                      <p className="text-xs text-gray-500 mt-1">
                        Referencia: {displayAddress.reference}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {checkout.addresses && checkout.addresses.length > 0 && (
                <Button
                  type="default"
                  onClick={() => checkout.setShowAddressSelector(true)}
                  className="w-full"
                >
                  {checkout.addresses.length > 1
                    ? 'Cambiar Dirección'
                    : 'Seleccionar o Agregar Dirección'}
                </Button>
              )}
            </div>
          )
        })()}
      </div>

      {/* Address Selector Modal */}
      <Modal
        title="Seleccionar Dirección"
        open={checkout.showAddressSelector}
        onCancel={() => checkout.setShowAddressSelector(false)}
        footer={null}
        width={600}
      >
        <div className="space-y-2 mt-4">
          {checkout.addresses?.map((address: any) => (
            <label
              key={address.id}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                checkout.selectedAddressId === address.id
                  ? 'border-coffee-medium bg-coffee-light/20'
                  : 'border-gray-200 hover:border-coffee-light'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="selectAddress"
                  value={address.id}
                  checked={checkout.selectedAddressId === address.id}
                  onChange={(e) => {
                    checkout.setSelectedAddressId(e.target.value)
                    checkout.setShowAddressSelector(false)
                  }}
                  className="mt-1"
                />
                <div className="flex-1">
                  {address.isDefault && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-coffee-medium text-white px-2 py-1 rounded">
                        Por defecto
                      </span>
                    </div>
                  )}
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
              </div>
            </label>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button
            type="dashed"
            onClick={() => {
              checkout.setShowAddressSelector(false)
              checkout.setShowAddressForm(true)
            }}
            className="w-full"
          >
            Agregar Nueva Dirección
          </Button>
        </div>
      </Modal>

      {/* Address Form Modal */}
      <Modal
        title="Agregar Nueva Dirección"
        open={checkout.showAddressForm}
        onCancel={() => {
          checkout.setShowAddressForm(false)
          checkout.form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={checkout.form}
          layout="vertical"
          onFinish={checkout.handleCreateAddress}
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
            <Input size="large" placeholder="Ej: Calle Principal #123" />
          </Form.Item>
          <Form.Item name="reference" label="Referencia (Opcional)">
            <Input.TextArea
              size="large"
              placeholder="Ej: Casa color azul, portón negro"
              rows={3}
            />
          </Form.Item>
          {checkout.addresses && checkout.addresses.length > 0 && (
            <Form.Item name="isDefault" valuePropName="checked">
              <input type="checkbox" className="mr-2" />
              <span>Establecer como dirección por defecto</span>
            </Form.Item>
          )}
          <Form.Item>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  checkout.setShowAddressForm(false)
                  checkout.form.resetFields()
                }}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={checkout.isCreatingAddress}
                className="bg-gradient-coffee border-none hover:opacity-90"
              >
                Guardar Dirección
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Payment Provider Section */}
      <div className="bg-white rounded-lg shadow-coffee p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-coffee-darker">
            Método de Pago
          </h2>
        </div>
        {/* Validar que haya dirección seleccionada antes de permitir seleccionar método de pago */}
        {(() => {
          const hasAddress =
            !!checkout.selectedAddressId || !!checkout.defaultAddress
          return !hasAddress ? (
            <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Atención:</strong> Por favor, selecciona una
                dirección de envío antes de elegir un método de pago. La orden
                requiere una dirección para ser creada.
              </p>
            </div>
          ) : null
        })()}
        <div className="mb-6">
          <PaymentProviderSelector
            selectedProvider={checkout.selectedPaymentProvider}
            onSelectProvider={(provider) =>
              checkout.setSelectedPaymentProvider(provider)
            }
            disabled={
              !checkout.selectedAddressId && !checkout.defaultAddress
            }
          />
        </div>

        {/* Mostrar opciones de Payphone cuando está seleccionado - automáticamente */}
        {checkout.selectedPaymentProvider === 'PAYPHONE' && (
          <div className="mt-6 pt-6 border-t border-coffee-medium">
            <h3 className="text-lg font-semibold text-coffee-darker mb-4">
              Completa tu Pago
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Elige una de las siguientes opciones para finalizar tu compra:
            </p>
            <ButtonPayPhone
              amount={checkout.total}
              addressId={
                checkout.selectedAddressId ||
                checkout.defaultAddress?.id ||
                ''
              }
              paymentMethodId={
                checkout.selectedPaymentMethodId || 'payphone-default'
              }
              clientTransactionId={checkout.clientTransactionId || ''}
              disabled={
                !checkout.selectedAddressId && !checkout.defaultAddress
              }
              onSuccess={() => {
                // El onSuccess se maneja en CheckoutSummary
              }}
            />
          </div>
        )}

        {/* Mostrar componente de depósito en efectivo cuando está seleccionado */}
        {checkout.selectedPaymentProvider === 'CASH_DEPOSIT' && (
          <div className="mt-6 pt-6 border-t border-coffee-medium">
            <h3 className="text-lg font-semibold text-coffee-darker mb-4">
              Sube tu Comprobante de Depósito
            </h3>
            {!checkout.selectedAddressId && !checkout.defaultAddress ? (
              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg mb-4">
                <p className="text-sm text-yellow-800">
                  Por favor, selecciona una dirección de envío antes de subir
                  el comprobante.
                </p>
              </div>
            ) : null}
            <CashDepositUpload
              onImageSelect={checkout.setDepositImage}
              selectedImage={checkout.depositImage}
              disabled={!checkout.selectedAddressId && !checkout.defaultAddress}
            />
          </div>
        )}
      </div>

      {/* Payment Method Form Modal */}
      <Modal
        title="Agregar Método de Pago"
        open={checkout.showPaymentMethodForm}
        onCancel={() => {
          checkout.setShowPaymentMethodForm(false)
          checkout.paymentMethodForm.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={checkout.paymentMethodForm}
          layout="vertical"
          onFinish={(values) => {
            const expirationDate = values.expirationDate?.split('/')
            checkout.handleCreatePaymentMethod({
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
          }}
          className="mt-4"
        >
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
          {checkout.paymentMethods && checkout.paymentMethods.length > 0 && (
            <Form.Item name="isDefault" valuePropName="checked">
              <input type="checkbox" className="mr-2" />
              <span>Establecer como método por defecto</span>
            </Form.Item>
          )}
          <Form.Item>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  checkout.setShowPaymentMethodForm(false)
                  checkout.paymentMethodForm.resetFields()
                }}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={checkout.isCreatingPaymentMethod}
                className="bg-gradient-coffee border-none hover:opacity-90"
              >
                Guardar
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
