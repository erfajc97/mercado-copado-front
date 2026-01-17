import { Form } from 'antd'
import {
  useCreatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
} from '../mutations/useProfileMutations'
import { usePaymentMethodsQuery } from '@/app/features/payment-cards/queries/usePaymentMethodsQuery'
import { usePaymentMethodFormHook } from '@/app/features/payment-cards/hooks/usePaymentMethodFormHook'
import { useProfileStore } from '@/app/store/profile/profileStore'

export const usePaymentMethodsTabHook = () => {
  const [form] = Form.useForm()
  const { data: paymentMethods, refetch: refetchPaymentMethods } =
    usePaymentMethodsQuery()
  const {
    mutateAsync: createPaymentMethod,
    isPending: isCreatingPaymentMethod,
  } = useCreatePaymentMethodMutation()
  const { mutateAsync: setDefaultPaymentMethod } =
    useSetDefaultPaymentMethodMutation()
  const { mutateAsync: deletePaymentMethod } = useDeletePaymentMethodMutation()
  const paymentMethodFormHook = usePaymentMethodFormHook()
  const { showPaymentMethodForm, setShowPaymentMethodForm } = useProfileStore()

  const handleCreatePaymentMethod = async (values: {
    gatewayToken: string
    cardBrand: string
    last4Digits: string
    expirationMonth: number
    expirationYear: number
    isDefault?: boolean
  }) => {
    try {
      await createPaymentMethod({
        gatewayToken: values.gatewayToken,
        cardBrand: values.cardBrand,
        last4Digits: values.last4Digits,
        expirationMonth: values.expirationMonth,
        expirationYear: values.expirationYear,
        isDefault:
          paymentMethods && paymentMethods.length === 0
            ? true
            : values.isDefault,
      })
      await refetchPaymentMethods()
      setShowPaymentMethodForm(false)
      form.resetFields()
    } catch (error) {
      console.error('Error saving payment method:', error)
    }
  }

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethod(paymentMethodId)
      await refetchPaymentMethods()
    } catch (error) {
      console.error('Error setting default payment method:', error)
    }
  }

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await deletePaymentMethod(paymentMethodId)
      await refetchPaymentMethods()
    } catch (error) {
      console.error('Error deleting payment method:', error)
    }
  }

  return {
    form,
    paymentMethods,
    showPaymentMethodForm,
    setShowPaymentMethodForm,
    handleCreatePaymentMethod,
    handleSetDefaultPaymentMethod,
    handleDeletePaymentMethod,
    isCreatingPaymentMethod,
    paymentMethodFormHook,
  }
}
