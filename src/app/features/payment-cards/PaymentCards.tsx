import { Button, Card } from 'antd'
import { CreditCard, Plus, Star, Trash2 } from 'lucide-react'
import { usePaymentCardsHook } from './hooks/usePaymentCardsHook'
import { PaymentMethodFormModal } from './components/modals/PaymentMethodFormModal'
import { usePaymentMethodFormHook } from './hooks/usePaymentMethodFormHook'
import type { PaymentMethod } from './types'

export function PaymentCards() {
  const {
    paymentMethods,
    showPaymentMethodForm,
    paymentMethodForm,
    isCreatingPaymentMethod,
    isDeletingPaymentMethod,
    isSettingDefaultPaymentMethod,
    handleCreatePaymentMethod,
    handleDeletePaymentMethod,
    handleSetDefaultPaymentMethod,
    openModal,
    closeModal,
  } = usePaymentCardsHook()

  const paymentMethodFormHook = usePaymentMethodFormHook()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-coffee-darker">
          Tarjetas Guardadas
        </h2>
        <Button
          type="primary"
          icon={<Plus size={18} />}
          onClick={openModal}
          className="bg-gradient-coffee border-none hover:opacity-90"
        >
          Agregar Tarjeta
        </Button>
      </div>

      {paymentMethods && paymentMethods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((paymentMethod: PaymentMethod) => (
            <Card
              key={paymentMethod.id}
              className={`shadow-coffee ${
                paymentMethod.isDefault ? 'border-2 border-coffee-medium' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard
                      size={20}
                      className="text-coffee-medium"
                    />
                    <span className="font-semibold text-coffee-darker">
                      {paymentMethod.cardBrand}
                    </span>
                    {paymentMethod.isDefault && (
                      <span className="text-xs bg-coffee-medium text-white px-2 py-1 rounded flex items-center gap-1">
                        <Star size={12} />
                        Por defecto
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-1">
                    •••• •••• •••• {paymentMethod.last4Digits}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expira: {paymentMethod.expirationMonth.toString().padStart(2, '0')}/{paymentMethod.expirationYear}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!paymentMethod.isDefault && (
                    <Button
                      type="text"
                      icon={<Star size={16} />}
                      onClick={() => handleSetDefaultPaymentMethod(paymentMethod.id)}
                      disabled={isSettingDefaultPaymentMethod}
                      className="text-coffee-medium hover:text-coffee-dark"
                      title="Establecer como predeterminada"
                    />
                  )}
                  <Button
                    type="text"
                    danger
                    icon={<Trash2 size={16} />}
                    onClick={() => handleDeletePaymentMethod(paymentMethod.id)}
                    disabled={isDeletingPaymentMethod}
                    title="Eliminar tarjeta"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <CreditCard size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No tienes tarjetas guardadas</p>
          <Button
            type="primary"
            icon={<Plus size={18} />}
            onClick={openModal}
            className="bg-gradient-coffee border-none hover:opacity-90"
          >
            Agregar Primera Tarjeta
          </Button>
        </div>
      )}

      <PaymentMethodFormModal
        isOpen={showPaymentMethodForm}
        onClose={closeModal}
        form={paymentMethodForm}
        paymentMethods={paymentMethods}
        isLoading={isCreatingPaymentMethod}
        onFinish={handleCreatePaymentMethod}
        transformFormData={paymentMethodFormHook.transformFormData}
      />
    </div>
  )
}
