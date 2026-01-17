import { Button } from '@heroui/react'
import { CreditCard, Plus } from 'lucide-react'
import { PaymentMethodCard } from '../PaymentMethodCard'
import { usePaymentMethodsTabHook } from '../../hooks/usePaymentMethodsTabHook'
import { PaymentMethodFormModal } from '@/app/features/payment-cards/components/modals/PaymentMethodFormModal'

export const PaymentMethodsTab = () => {
  const hook = usePaymentMethodsTabHook()
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-coffee-darker">
          Tarjetas Guardadas
        </h2>
        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={() => {
            hook.form.resetFields()
            hook.setShowPaymentMethodForm(true)
          }}
          className="bg-gradient-coffee border-none hover:opacity-90"
        >
          Agregar Tarjeta
        </Button>
      </div>

      {hook.paymentMethods && hook.paymentMethods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hook.paymentMethods.map((method: any) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              onSetDefault={hook.handleSetDefaultPaymentMethod}
              onDelete={hook.handleDeletePaymentMethod}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No tienes tarjetas guardadas</p>
          <Button
            color="primary"
            startContent={<Plus size={18} />}
            onPress={() => {
              hook.form.resetFields()
              hook.setShowPaymentMethodForm(true)
            }}
            className="bg-gradient-coffee border-none hover:opacity-90"
          >
            Agregar Primera Tarjeta
          </Button>
        </div>
      )}

      <PaymentMethodFormModal
        isOpen={hook.showPaymentMethodForm}
        onClose={() => {
          hook.setShowPaymentMethodForm(false)
          hook.form.resetFields()
        }}
        onFinish={hook.handleCreatePaymentMethod}
        form={hook.form}
        paymentMethods={hook.paymentMethods}
        isLoading={hook.isCreatingPaymentMethod}
        transformFormData={hook.paymentMethodFormHook.transformFormData}
      />
    </div>
  )
}
