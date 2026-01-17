import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { generateTransactionId } from '../../shared/helpers/generateTransactionId'
import { isValidUUID } from '../../shared/helpers/isValidUUID'
import { validatePhoneNumber } from '../helpers/validatePhoneNumber'
import { formatPhoneNumber } from '../helpers/formatPhoneNumber'
import { usePhonePayphoneMutation } from '../../mutations/usePayPhoneMutation'
import { useCreateTransactionAndOrderMutation } from '@/app/features/payments/mutations/useCreateTransactionAndOrderMutation'
import { useRegenerateTransactionMutation } from '@/app/features/payments/mutations/useRegenerateTransactionMutation'
import { useAuthStore } from '@/app/store/auth/authStore'
import { userInfoService } from '@/app/features/auth/login/services/userInfoService'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface UseButtonPayPhonePhoneHookProps {
  amount: number
  addressId: string
  paymentMethodId: string
  clientTransactionId?: string
  onSuccess?: () => void
  orderId?: string
}

export const useButtonPayPhonePhoneHook = ({
  amount,
  addressId,
  paymentMethodId,
  clientTransactionId: propClientTransactionId,
  onSuccess,
  orderId,
}: UseButtonPayPhonePhoneHookProps) => {
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const isAuthenticated = !!token

  const { mutateAsync: phonePayphone, isPending: isPendingPhone } =
    usePhonePayphoneMutation()
  const { mutateAsync: createTransactionAndOrder } =
    useCreateTransactionAndOrderMutation()
  const { mutateAsync: regenerateTransaction } =
    useRegenerateTransactionMutation()

  const { data: userInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: userInfoService,
    enabled: isAuthenticated,
  })

  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')

  // Pre-seleccionar el número de teléfono del usuario cuando se abre la modal
  useEffect(() => {
    if (showPhoneModal && userInfo?.phoneNumber) {
      const phoneWithoutCode = userInfo.phoneNumber.replace(/^\+\d{1,4}/, '')
      setPhoneNumber(phoneWithoutCode)
    } else if (showPhoneModal && !userInfo?.phoneNumber) {
      setPhoneNumber('')
    }
  }, [showPhoneModal, userInfo?.phoneNumber])

  const handlePhonePayment = async () => {
    const validation = validatePhoneNumber(phoneNumber)
    if (!validation.isValid) {
      sonnerResponse(validation.errorMessage || 'Número inválido', 'error')
      return
    }

    const phoneNumberToSend = formatPhoneNumber(phoneNumber)

    try {
      // 1. Generar clientTransactionId
      const transactionId = orderId
        ? propClientTransactionId || generateTransactionId()
        : generateTransactionId()

      // 2. Llamar a Payphone /api/Sale PRIMERO
      const phonePaymentData: {
        addressId: string
        paymentMethodId?: string
        phoneNumber: string
        clientTransactionId: string
        amount: number
      } = {
        addressId,
        phoneNumber: phoneNumberToSend,
        clientTransactionId: transactionId,
        amount,
      }
      if (isValidUUID(paymentMethodId)) {
        phonePaymentData.paymentMethodId = paymentMethodId
      }

      await phonePayphone(phonePaymentData)

      // 3. Si Payphone responde exitosamente, crear transacción+orden en el backend
      setShowPhoneModal(false)
      setPhoneNumber('')
      // usePhonePayphoneMutation ya maneja sonnerResponse en onSuccess
      onSuccess?.()

      // 4. Crear transacción+orden en el backend DESPUÉS
      try {
        if (orderId) {
          await regenerateTransaction({
            orderId,
            paymentProvider: 'PAYPHONE',
            ...(isValidUUID(paymentMethodId) ? { paymentMethodId } : {}),
          })
          onSuccess?.()
        } else {
          await createTransactionAndOrder({
            addressId: addressId.trim(),
            clientTransactionId: transactionId,
            paymentProvider: 'PAYPHONE',
            ...(isValidUUID(paymentMethodId) ? { paymentMethodId } : {}),
          })
          onSuccess?.()
        }
      } catch (backendError) {
        console.error(
          '[useButtonPayPhonePhoneHook] Error al crear transacción/orden en backend:',
          backendError,
        )
        // Las mutations ya manejan sonnerResponse en onError
      }

      if (!orderId) {
        setTimeout(() => {
          navigate({ to: '/orders' })
        }, 1500)
      }
    } catch (e) {
      console.error('Error al procesar pago por teléfono:', e)
    }
  }

  const handleClosePhoneModal = () => {
    setShowPhoneModal(false)
    setPhoneNumber('')
  }

  return {
    showPhoneModal,
    setShowPhoneModal,
    phoneNumber,
    setPhoneNumber,
    userInfo,
    isPendingPhone,
    handlePhonePayment,
    handleClosePhoneModal,
  }
}
