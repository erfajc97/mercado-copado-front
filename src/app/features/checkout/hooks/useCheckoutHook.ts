import { useEffect, useMemo, useState } from 'react'
import { Form } from 'antd'
import { calculateItemPrice } from '../helpers/calculateItemPrice'
import type { Address } from '@/app/features/addresses/types'
import type { PaymentMethod } from '@/app/features/payment-cards/types'
import { useCartQuery } from '@/app/features/cart/queries/useCartQuery'
import { useAddressesQuery } from '@/app/features/addresses/queries/useAddressesQuery'
import { useCreateAddressMutation } from '@/app/features/addresses/mutations/useCreateAddressMutation'
import { usePaymentMethodsQuery } from '@/app/features/payment-cards/queries/usePaymentMethodsQuery'
import { useCreatePaymentMethodMutation } from '@/app/features/payment-cards/mutations/usePaymentMethodMutations'
import { useCreatePaymentTransactionWithoutOrderMutation } from '@/app/features/payments/mutations/useCreatePaymentTransactionWithoutOrderMutation'
import { useCashDepositMutation } from '@/app/features/payments/mutations/useCashDepositMutation'
import { useCurrency } from '@/app/hooks/useCurrency'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'
import { useAuthStore } from '@/app/store/auth/authStore'
import { formatUSD } from '@/app/services/currencyService'

export const useCheckoutHook = () => {
  const { data: cartItems } = useCartQuery()
  const { roles, token, getToken } = useAuthStore()
  const isAuthenticated = Boolean(token || getToken())

  const { data: addresses, refetch: refetchAddresses } = useAddressesQuery({
    enabled: isAuthenticated,
  })
  const { data: paymentMethods, refetch: refetchPaymentMethods } =
    usePaymentMethodsQuery({
      enabled: isAuthenticated,
    })
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
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [form] = Form.useForm()
  const [paymentMethodForm] = Form.useForm()

  const handleAddAddressClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
    } else {
      setShowAddressForm(true)
    }
  }

  const defaultAddress = useMemo(
    () => addresses?.find((addr: any) => addr.isDefault),
    [addresses],
  )
  const defaultPaymentMethod = useMemo(
    () => paymentMethods?.find((pm: PaymentMethod) => pm.isDefault),
    [paymentMethods],
  )

  // Calcular dirección inicial usando useMemo
  const initialAddressId = useMemo(() => {
    if (!addresses || addresses.length === 0) return ''
    if (defaultAddress) return defaultAddress.id
    return addresses[0].id
  }, [addresses, defaultAddress])

  // Calcular payment method inicial usando useMemo
  const initialPaymentMethodId = useMemo(() => {
    if (!paymentMethods || paymentMethods.length === 0) return ''
    if (defaultPaymentMethod) return defaultPaymentMethod.id
    return paymentMethods[0].id
  }, [paymentMethods, defaultPaymentMethod])

  // Inicializar selecciones cuando los datos estén disponibles (useEffect mínimo necesario)
  // Combinado en un solo useEffect para optimización
  useEffect(() => {
    if (initialAddressId && !selectedAddressId) {
      setSelectedAddressId(initialAddressId)
    }
    if (initialPaymentMethodId && !selectedPaymentMethodId) {
      setSelectedPaymentMethodId(initialPaymentMethodId)
    }
  }, [
    initialAddressId,
    selectedAddressId,
    initialPaymentMethodId,
    selectedPaymentMethodId,
  ])

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

  // Calcular total usando useMemo para optimización
  const total = useMemo(() => {
    if (!cartItems) return 0
    return cartItems.reduce((sum: number, item: any) => {
      const finalPrice = calculateItemPrice(
        item.product.price,
        item.product.discount || 0,
      )
      return sum + finalPrice * item.quantity
    }, 0)
  }, [cartItems])

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
      // useCreatePaymentTransactionWithoutOrderMutation ya maneja sonnerResponse en onError
    }
  }

  // Calcular dirección a mostrar usando useMemo
  const displayAddress = useMemo(() => {
    if (!addresses || addresses.length === 0) return null
    if (selectedAddressId) {
      return (
        addresses.find((addr: Address) => addr.id === selectedAddressId) || null
      )
    }
    return defaultAddress || addresses[0] || null
  }, [addresses, selectedAddressId, defaultAddress])

  // Calcular si es dirección por defecto o seleccionada
  const isDefaultAddress = useMemo(() => {
    return displayAddress?.id === defaultAddress?.id
  }, [displayAddress, defaultAddress])

  const isSelectedAddress = useMemo(() => {
    return displayAddress?.id === selectedAddressId
  }, [displayAddress, selectedAddressId])

  // Helper para calcular precio final de un item
  const calculateItemFinalPrice = (item: any) => {
    return calculateItemPrice(item.product.price, item.product.discount || 0)
  }

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
    showAuthModal,
    setShowAuthModal,
    form,
    paymentMethodForm,
    defaultAddress,
    defaultPaymentMethod,
    handleCreateAddress,
    handleCreatePaymentMethod,
    handleCreatePaymentTransaction,
    handleAddAddressClick,
    calculateItemFinalPrice,
    total,
    displayAddress,
    isDefaultAddress,
    isSelectedAddress,
    formatPrice,
    formatUSD,
    currency,
    isAdmin,
    isAuthenticated,
    isPending: isPending || isProcessingDeposit,
    isCreatingAddress,
    isCreatingPaymentMethod,
    refetchAddresses,
    refetchPaymentMethods,
    depositImage,
    setDepositImage,
  }
}
