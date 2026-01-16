import { Button } from '@heroui/react'
import { Home } from 'lucide-react'
import { PaymentProviderSelector } from './PaymentProviderSelector'
import type { CheckoutHookReturn } from './types'
import { AddressSelectorModal } from '@/app/features/addresses/components/modals/AddressSelectorModal'
import { AddressModal } from '@/app/features/addresses/components/modals/AddressModal'
import { PaymentMethodFormModal } from '@/app/features/payment-cards/components/modals/PaymentMethodFormModal'
import { usePaymentMethodFormHook } from '@/app/features/payment-cards/hooks/usePaymentMethodFormHook'
import { CashDepositUpload } from '@/app/features/payments/components/CashDepositUpload'
import { PayPhoneButtonsContainer } from '@/app/features/payments/components/payphone/shared/components/PayPhoneButtonsContainer'
import AuthModal from '@/app/features/auth/components/AuthModal'

interface CheckoutFormProps {
  checkout: CheckoutHookReturn
}

export const CheckoutForm = ({ checkout }: CheckoutFormProps) => {
  const paymentMethodFormHook = usePaymentMethodFormHook()

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
          if (!checkout.displayAddress) {
            return (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  No tienes direcciones. Agrega una dirección para continuar.
                </p>
                {!checkout.isAuthenticated ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 mb-2">
                      Inicia sesión para agregar una dirección
                    </p>
                    <Button
                      color="primary"
                      onPress={checkout.handleAddAddressClick}
                      className="bg-gradient-coffee border-none hover:opacity-90"
                    >
                      Iniciar Sesión
                    </Button>
                  </div>
                ) : (
                  <Button
                    color="primary"
                    onPress={checkout.handleAddAddressClick}
                    className="bg-gradient-coffee border-none hover:opacity-90"
                  >
                    Agregar Dirección
                  </Button>
                )}
              </div>
            )
          }

          return (
            <div className="space-y-4">
              <div className="p-4 border-2 border-coffee-medium bg-coffee-light/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Home size={24} className="text-coffee-medium mt-1" />
                  <div className="flex-1">
                    {checkout.isDefaultAddress && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-coffee-medium text-white px-2 py-1 rounded">
                          Por defecto
                        </span>
                      </div>
                    )}
                    {checkout.isSelectedAddress &&
                      !checkout.isDefaultAddress && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                            Seleccionada
                          </span>
                        </div>
                      )}
                    <p className="font-semibold text-coffee-darker">
                      {checkout.displayAddress.street},{' '}
                      {checkout.displayAddress.city}
                    </p>
                    <p className="text-sm text-gray-600">
                      {checkout.displayAddress.state},{' '}
                      {checkout.displayAddress.zipCode},{' '}
                      {checkout.displayAddress.country}
                    </p>
                    {checkout.displayAddress.reference && (
                      <p className="text-xs text-gray-500 mt-1">
                        Referencia: {checkout.displayAddress.reference}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {checkout.addresses && checkout.addresses.length > 0 && (
                <Button
                  variant="bordered"
                  onPress={() => checkout.setShowAddressSelector(true)}
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
      <AddressSelectorModal
        isOpen={checkout.showAddressSelector}
        onClose={() => checkout.setShowAddressSelector(false)}
        addresses={checkout.addresses}
        selectedAddressId={checkout.selectedAddressId}
        onSelectAddress={(addressId) => {
          checkout.setSelectedAddressId(addressId)
        }}
        onAddNewAddress={checkout.handleAddAddressClick}
      />

      {/* Address Form Modal */}
      <AddressModal
        isOpen={checkout.showAddressForm}
        onClose={() => {
          checkout.setShowAddressForm(false)
          checkout.form.resetFields()
        }}
        editingAddress={null}
        form={checkout.form}
        addresses={checkout.addresses}
        isLoading={checkout.isCreatingAddress}
        onSave={checkout.handleCreateAddress}
      />

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
            disabled={!checkout.selectedAddressId && !checkout.defaultAddress}
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
            <PayPhoneButtonsContainer
              amount={checkout.total}
              addressId={
                checkout.selectedAddressId || checkout.defaultAddress?.id || ''
              }
              paymentMethodId={
                checkout.selectedPaymentMethodId || 'payphone-default'
              }
              clientTransactionId={checkout.clientTransactionId || ''}
              disabled={!checkout.selectedAddressId && !checkout.defaultAddress}
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
                  Por favor, selecciona una dirección de envío antes de subir el
                  comprobante.
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
      <PaymentMethodFormModal
        isOpen={checkout.showPaymentMethodForm}
        onClose={() => {
          checkout.setShowPaymentMethodForm(false)
          checkout.paymentMethodForm.resetFields()
        }}
        form={checkout.paymentMethodForm}
        paymentMethods={checkout.paymentMethods}
        isLoading={checkout.isCreatingPaymentMethod}
        onFinish={checkout.handleCreatePaymentMethod}
        transformFormData={paymentMethodFormHook.transformFormData}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={checkout.showAuthModal}
        onClose={() => checkout.setShowAuthModal(false)}
        onOpenChange={(open) => {
          if (!open) {
            checkout.setShowAuthModal(false)
          }
        }}
        initialMode="login"
      />
    </div>
  )
}
