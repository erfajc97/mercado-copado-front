import { useEffect, useState } from 'react'
import { Form } from 'antd'
import type { PaymentMethod } from '@/app/features/payment-methods/types'
import { useCartQuery } from '@/app/features/cart/queries/useCartQuery'
import { useAddressesQuery } from '@/app/features/addresses/queries/useAddressesQuery'
import { useCreateAddressMutation } from '@/app/features/addresses/mutations/useCreateAddressMutation'
import { usePaymentMethodsQuery } from '@/app/features/payment-methods/queries/usePaymentMethodsQuery'
import { useCreatePaymentMethodMutation } from '@/app/features/payment-methods/mutations/usePaymentMethodMutations'
import { useCreatePaymentTransactionWithoutOrderMutation } from '@/app/features/payments/mutations/useCreatePaymentTransactionWithoutOrderMutation'
import { useCurrency } from '@/app/hooks/useCurrency'

export const useCheckoutHook = () => {
  const { data: cartItems } = useCartQuery()
  const { data: addresses, refetch: refetchAddresses } = useAddressesQuery()
  const { data: paymentMethods, refetch: refetchPaymentMethods } =
    usePaymentMethodsQuery()
  const { mutateAsync: createPaymentTransactionWithoutOrder, isPending } =
    useCreatePaymentTransactionWithoutOrderMutation()
  const { mutateAsync: createAddress, isPending: isCreatingAddress } =
    useCreateAddressMutation()
  const {
    mutateAsync: createPaymentMethod,
    isPending: isCreatingPaymentMethod,
  } = useCreatePaymentMethodMutation()
  const { formatPrice } = useCurrency()

  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<string>('')
  const [clientTransactionId, setClientTransactionId] = useState<string | null>(
    null,
  )
  const [transactionTotal, setTransactionTotal] = useState<number>(0)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showAddressSelector, setShowAddressSelector] = useState(false)
  const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false)
  const [form] = Form.useForm()
  const [paymentMethodForm] = Form.useForm()

  const defaultAddress = addresses?.find((addr: any) => addr.isDefault)
  const defaultPaymentMethod = paymentMethods?.find(
    (pm: PaymentMethod) => pm.isDefault,
  )

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

  useEffect(() => {
    if (
      !defaultPaymentMethod &&
      !selectedPaymentMethodId &&
      paymentMethods &&
      paymentMethods.length > 0
    ) {
      setSelectedPaymentMethodId(paymentMethods[0].id)
    } else if (defaultPaymentMethod && !selectedPaymentMethodId) {
      setSelectedPaymentMethodId(defaultPaymentMethod.id)
    }
  }, [paymentMethods, defaultPaymentMethod, selectedPaymentMethodId])

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

  const handleCreatePaymentMethod = async (values: {
    gatewayToken: string
    cardBrand: string
    last4Digits: string
    expirationMonth: number
    expirationYear: number
    isDefault?: boolean
  }) => {
    try {
      const newPaymentMethod = (await createPaymentMethod({
        gatewayToken: values.gatewayToken,
        cardBrand: values.cardBrand,
        last4Digits: values.last4Digits,
        expirationMonth: values.expirationMonth,
        expirationYear: values.expirationYear,
        isDefault:
          paymentMethods && paymentMethods.length === 0
            ? true
            : values.isDefault,
      })) as PaymentMethod
      await refetchPaymentMethods()
      setSelectedPaymentMethodId(newPaymentMethod.id)
      setShowPaymentMethodForm(false)
      paymentMethodForm.resetFields()
    } catch (error) {
      console.error('Error creating payment method:', error)
    }
  }

  const handleCreatePaymentTransaction = async () => {
    if (!selectedAddressId) {
      alert('Por favor, selecciona una dirección')
      return
    }

    if (!selectedPaymentMethodId) {
      alert('Por favor, selecciona un método de pago')
      return
    }

    try {
      const randomIdClientTransaction = Math.random()
        .toString(36)
        .substring(2, 15)

      const transaction = await createPaymentTransactionWithoutOrder({
        addressId: selectedAddressId,
        paymentMethodId: selectedPaymentMethodId,
        clientTransactionId: randomIdClientTransaction,
        paymentProvider: 'PAYPHONE',
      })

      setClientTransactionId(randomIdClientTransaction)
      setTransactionTotal(Number(transaction.amount))
    } catch (error) {
      console.error('Error creating payment transaction:', error)
      alert('Error al crear la transacción de pago. Por favor, intenta nuevamente.')
    }
  }

  const total = calculateTotal()

  return {
    cartItems,
    addresses,
    paymentMethods,
    selectedAddressId,
    setSelectedAddressId,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    clientTransactionId,
    transactionTotal,
    showAddressForm,
    setShowAddressForm,
    showAddressSelector,
    setShowAddressSelector,
    showPaymentMethodForm,
    setShowPaymentMethodForm,
    form,
    paymentMethodForm,
    defaultAddress,
    defaultPaymentMethod,
    handleCreateAddress,
    handleCreatePaymentMethod,
    handleCreatePaymentTransaction,
    calculateTotal,
    total,
    formatPrice,
    isPending,
    isCreatingAddress,
    isCreatingPaymentMethod,
    refetchAddresses,
    refetchPaymentMethods,
  }
}

