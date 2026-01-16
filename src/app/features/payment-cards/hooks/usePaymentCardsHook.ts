import { useState } from 'react'
import { Form } from 'antd'
import { usePaymentMethodsQuery } from '../queries/usePaymentMethodsQuery'
import {
  useCreatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
} from '../mutations/usePaymentMethodMutations'
import type { PaymentMethod } from '../types'

export const usePaymentCardsHook = () => {
  const { data: paymentMethods, refetch: refetchPaymentMethods } =
    usePaymentMethodsQuery()
  const {
    mutateAsync: createPaymentMethod,
    isPending: isCreatingPaymentMethod,
  } = useCreatePaymentMethodMutation()
  const { mutateAsync: deletePaymentMethod, isPending: isDeletingPaymentMethod } =
    useDeletePaymentMethodMutation()
  const {
    mutateAsync: setDefaultPaymentMethod,
    isPending: isSettingDefaultPaymentMethod,
  } = useSetDefaultPaymentMethodMutation()

  const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false)
  const [editingPaymentMethod, setEditingPaymentMethod] =
    useState<PaymentMethod | null>(null)
  const [paymentMethodForm] = Form.useForm()

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
        ...values,
        isDefault:
          paymentMethods && paymentMethods.length === 0
            ? true
            : values.isDefault,
      })
      await refetchPaymentMethods()
      setShowPaymentMethodForm(false)
      setEditingPaymentMethod(null)
      paymentMethodForm.resetFields()
    } catch (error) {
      console.error('Error creating payment method:', error)
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

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethod(paymentMethodId)
      await refetchPaymentMethods()
    } catch (error) {
      console.error('Error setting default payment method:', error)
    }
  }

  const openModal = () => {
    setEditingPaymentMethod(null)
    setShowPaymentMethodForm(true)
  }

  const closeModal = () => {
    setShowPaymentMethodForm(false)
    setEditingPaymentMethod(null)
    paymentMethodForm.resetFields()
  }

  return {
    paymentMethods,
    showPaymentMethodForm,
    editingPaymentMethod,
    paymentMethodForm,
    isCreatingPaymentMethod,
    isDeletingPaymentMethod,
    isSettingDefaultPaymentMethod,
    handleCreatePaymentMethod,
    handleDeletePaymentMethod,
    handleSetDefaultPaymentMethod,
    openModal,
    closeModal,
  }
}
