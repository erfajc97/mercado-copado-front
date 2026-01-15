import { useEffect, useState } from 'react'
import { Form } from 'antd'
import type { PaymentMethod } from '@/app/features/payment-methods/types'
import { useCartQuery } from '@/app/features/cart/queries/useCartQuery'
import { useAddressesQuery } from '@/app/features/addresses/queries/useAddressesQuery'
import { useCreateAddressMutation } from '@/app/features/addresses/mutations/useCreateAddressMutation'
import { usePaymentMethodsQuery } from '@/app/features/payment-methods/queries/usePaymentMethodsQuery'
import { useCreatePaymentMethodMutation } from '@/app/features/payment-methods/mutations/usePaymentMethodMutations'
import { useCreatePaymentTransactionWithoutOrderMutation } from '@/app/features/payments/mutations/useCreatePaymentTransactionWithoutOrderMutation'
import { useCashDepositMutation } from '@/app/features/payments/mutations/useCashDepositMutation'
import { useCurrency } from '@/app/hooks/useCurrency'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'
import { useAuthStore } from '@/app/store/auth/authStore'
import { formatUSD } from '@/app/services/currencyService'

export const useCheckoutHook = () => {
  const { data: cartItems } = useCartQuery()
  const { data: addresses, refetch: refetchAddresses } = useAddressesQuery()
  const { data: paymentMethods, refetch: refetchPaymentMethods } =
    usePaymentMethodsQuery()
  const { mutateAsync: createPaymentTransactionWithoutOrder, isPending } =
    useCreatePaymentTransactionWithoutOrderMutation()
  const { mutateAsync: cashDeposit, isPending: isProcessingDeposit } =
    useCashDepositMutation()
  const { mutateAsync: createAddress, isPending: isCreatingAddress } =
    useCreateAddressMutation()
  const {
    mutateAsync: createPaymentMethod,
    isPending: isCreatingPaymentMethod,
  } = useCreatePaymentMethodMutation()
  const { formatPrice, currency } = useCurrency()
  const { roles } = useAuthStore()
  const isAdmin = roles === 'ADMIN'

  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<string>('')
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<
    'PAYPHONE' | 'MERCADOPAGO' | 'CRYPTO' | 'CASH_DEPOSIT' | null
  >(null)
  const [clientTransactionId, setClientTransactionId] = useState<string | null>(
    null,
  )
  const [transactionTotal, setTransactionTotal] = useState<number>(0)
  const [depositImage, setDepositImage] = useState<File | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showAddressSelector, setShowAddressSelector] = useState(false)
  const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false)
  const [form] = Form.useForm()
  const [paymentMethodForm] = Form.useForm()

  const defaultAddress = addresses?.find((addr: any) => addr.isDefault)
  const defaultPaymentMethod = paymentMethods?.find(
    (pm: PaymentMethod) => pm.isDefault,
  )

  // Seleccionar automáticamente la dirección por defecto o la primera disponible
  useEffect(() => {
    if (!addresses || addresses.length === 0) {
      // No hay direcciones, no hacer nada
      return
    }

    // Si ya hay una dirección seleccionada, no cambiar
    if (selectedAddressId) {
      return
    }

    // Si hay dirección por defecto, seleccionarla
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id)
      return
    }

    // Si no hay dirección por defecto pero hay direcciones, seleccionar la primera
    if (addresses.length > 0) {
      setSelectedAddressId(addresses[0].id)
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
      sonnerResponse('Por favor, selecciona una dirección', 'error')
      return
    }

    if (!selectedPaymentProvider) {
      sonnerResponse('Por favor, selecciona un proveedor de pago', 'error')
      return
    }

    // Si es depósito en efectivo, usar el método específico
    if (selectedPaymentProvider === 'CASH_DEPOSIT') {
      if (!depositImage) {
        sonnerResponse(
          'Por favor, sube una imagen del comprobante de depósito',
          'error',
        )
        return
      }

      try {
        const randomIdClientTransaction = Math.random()
          .toString(36)
          .substring(2, 15)

        await cashDeposit({
          addressId: selectedAddressId,
          clientTransactionId: randomIdClientTransaction,
          depositImage,
        })
      } catch (error) {
        console.error('Error processing cash deposit:', error)
        // El error ya se maneja en la mutación con sonner
      }
      return
    }

    try {
      const randomIdClientTransaction = Math.random()
        .toString(36)
        .substring(2, 15)

      // Para Payphone, no enviamos paymentMethodId
      // Para otros proveedores futuros, será necesario
      const transactionData: any = {
        addressId: selectedAddressId,
        clientTransactionId: randomIdClientTransaction,
        paymentProvider: selectedPaymentProvider,
      }

      if (selectedPaymentProvider !== 'PAYPHONE' && selectedPaymentMethodId) {
        transactionData.paymentMethodId = selectedPaymentMethodId
      }

      const transaction =
        await createPaymentTransactionWithoutOrder(transactionData)

      setClientTransactionId(randomIdClientTransaction)
      setTransactionTotal(Number(transaction.amount))
    } catch (error) {
      console.error('Error creating payment transaction:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al crear la transacción de pago. Por favor, intenta nuevamente.'
      sonnerResponse(errorMessage, 'error')
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
    selectedPaymentProvider,
    setSelectedPaymentProvider,
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
    formatUSD,
    currency,
    isAdmin,
    isPending: isPending || isProcessingDeposit,
    isCreatingAddress,
    isCreatingPaymentMethod,
    refetchAddresses,
    refetchPaymentMethods,
    depositImage,
    setDepositImage,
  }
}
