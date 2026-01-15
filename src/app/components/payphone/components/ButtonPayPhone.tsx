import { useEffect, useState } from 'react'
import { Button, Input, Modal } from 'antd'
import { AlertCircle, Phone } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  useLinkPayphoneMutation,
  usePhonePayphoneMutation,
} from '../mutations/usePayPhoneMutation'
import { LinkPaymentConfirmationModal } from './LinkPaymentConfirmationModal'
import { useCreateTransactionAndOrderMutation } from '@/app/features/payments/mutations/useCreateTransactionAndOrderMutation'
import { useRegenerateTransactionMutation } from '@/app/features/payments/mutations/useRegenerateTransactionMutation'
import { useCurrency } from '@/app/hooks/useCurrency'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'
import { useAuthStore } from '@/app/store/auth/authStore'
import { userInfoService } from '@/app/features/auth/login/services/userInfoService'

interface ButtonPayPhoneProps {
  amount: number
  addressId: string
  paymentMethodId: string
  clientTransactionId?: string
  onSuccess?: () => void
  disabled?: boolean
  orderId?: string
  addresses?: Array<any>
  paymentMethods?: Array<any>
  forcePaymentMethod?: 'link' | 'phone' | null
}

export const ButtonPayPhone = ({
  amount,
  addressId,
  paymentMethodId,
  clientTransactionId: propClientTransactionId,
  onSuccess,
  disabled,
  orderId,
  forcePaymentMethod,
}: ButtonPayPhoneProps) => {
  const { mutateAsync: linkPayphone, isPending: isPendingLink } =
    useLinkPayphoneMutation()
  const { mutateAsync: phonePayphone, isPending: isPendingPhone } =
    usePhonePayphoneMutation()
  const { mutateAsync: createTransactionAndOrder } =
    useCreateTransactionAndOrderMutation()
  const { mutateAsync: regenerateTransaction } =
    useRegenerateTransactionMutation()
  const { formatPrice } = useCurrency()
  const { token } = useAuthStore()
  const isAuthenticated = !!token
  const navigate = useNavigate()

  const { data: userInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: userInfoService,
    enabled: isAuthenticated,
  })

  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [showLinkConfirmationModal, setShowLinkConfirmationModal] =
    useState(false)
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

  // Si forcePaymentMethod está definido, ejecutar automáticamente el método correspondiente
  useEffect(() => {
    if (forcePaymentMethod === 'link') {
      handleLinkPayment()
    } else if (forcePaymentMethod === 'phone') {
      setShowPhoneModal(true)
    }
  }, [forcePaymentMethod])

  // Helper para validar UUID
  const isValidUUID = (str: string | undefined): boolean => {
    if (!str || str === '' || str === 'payphone-default') return false
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(str)
  }

  const handleLinkPayment = () => {
    setShowLinkConfirmationModal(true)
  }

  // Flujo de pago por link (como ANKO: primero Payphone, luego backend)
  const handleConfirmLinkPayment = async () => {
    const ua = navigator.userAgent
    const isSafari =
      /Safari/.test(ua) &&
      !/Chrome/.test(ua) &&
      !/CriOS/.test(ua) &&
      !/FxiOS/.test(ua) &&
      !/EdgiOS/.test(ua)
    if (isSafari) {
      sonnerResponse(
        'No es posible generar links de pago en Safari. Por favor, utiliza Google Chrome u otro navegador compatible.',
        'error',
      )
      setShowLinkConfirmationModal(false)
      return
    }

    if (!amount || amount <= 0 || isNaN(amount)) {
      sonnerResponse('Error: El monto de la transacción no es válido', 'error')
      setShowLinkConfirmationModal(false)
      return
    }

    try {
      // 1. Generar clientTransactionId
      const transactionId = orderId
        ? propClientTransactionId || Math.random().toString(36).substring(2, 15)
        : Math.random().toString(36).substring(2, 15)

      // 2. Llamar a Payphone PRIMERO (como anko)
      const amountInCents = Math.round(amount * 100)
      const bodyPayphone = {
        clientTransactionId: transactionId,
        reference: 'Compra en Mercado Copado',
        amount: amountInCents,
        responseUrl: `${import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/pay-response?id=${transactionId}&clientTransactionId=${transactionId}`,
        amountWithoutTax: amountInCents,
        storeId: import.meta.env.VITE_STORE_ID,
      }

      const payphoneResponse = await linkPayphone(bodyPayphone)

      // 3. Si Payphone responde exitosamente, abrir la pasarela
      if (typeof payphoneResponse === 'object' && payphoneResponse.paymentId) {
        setShowLinkConfirmationModal(false)
        // Abrir pasarela de Payphone (como anko)
        window.open(payphoneResponse.payWithCard, '_blank', 'noopener')
        // NO llamar onSuccess aquí - dejar que el usuario complete el pago en la nueva ventana
        // onSuccess solo se llama en casos especiales como retry de pagos

        // 4. Crear transacción+orden en el backend DESPUÉS (opcional, no bloquea)
        try {
          if (orderId) {
            // Si hay orderId, solo regenerar la transacción con payphoneData (incluye paymentId)
            await regenerateTransaction({
              orderId,
              paymentProvider: 'PAYPHONE',
              ...(isValidUUID(paymentMethodId) ? { paymentMethodId } : {}),
              payphoneData: {
                paymentId: payphoneResponse.paymentId,
                payWithCard: payphoneResponse.payWithCard,
              },
            })
          } else {
            // Si no hay orderId, crear transacción+orden con payphoneData (incluye paymentId)
            await createTransactionAndOrder({
              addressId: addressId.trim(),
              clientTransactionId: transactionId,
              paymentProvider: 'PAYPHONE',
              ...(isValidUUID(paymentMethodId) ? { paymentMethodId } : {}),
              payphoneData: {
                paymentId: payphoneResponse.paymentId,
                payWithCard: payphoneResponse.payWithCard,
              },
            })
          }
        } catch (backendError) {
          // No bloquear si falla el backend, el pago ya fue enviado a Payphone
          console.error(
            'Error al crear transacción/orden en backend:',
            backendError,
          )
        }
      }
    } catch (e) {
      console.error('Error al generar link de pago:', e)
      setShowLinkConfirmationModal(false)
      const errorMessage =
        e instanceof Error
          ? e.message
          : 'Error al procesar el pago. Por favor, intenta nuevamente.'
      sonnerResponse(errorMessage, 'error')
    }
  }

  // Flujo de pago por teléfono (como ANKO: primero Payphone, luego backend)
  const handlePhonePayment = async () => {
    const cleanPhoneNumber = phoneNumber
      .replace(/\s+/g, '')
      .replace(/[^0-9]/g, '')

    if (!cleanPhoneNumber || cleanPhoneNumber.length === 0) {
      sonnerResponse('Por favor ingresa un número de teléfono válido', 'error')
      return
    }

    if (cleanPhoneNumber.length > 10) {
      sonnerResponse(
        'El número de teléfono debe tener máximo 10 dígitos',
        'error',
      )
      return
    }

    if (cleanPhoneNumber.length < 9) {
      sonnerResponse(
        'El número de teléfono debe tener al menos 9 dígitos',
        'error',
      )
      return
    }

    const phoneNumberToSend = cleanPhoneNumber.startsWith('0')
      ? cleanPhoneNumber.substring(1)
      : cleanPhoneNumber

    try {
      // 1. Generar clientTransactionId
      const transactionId = orderId
        ? propClientTransactionId || Math.random().toString(36).substring(2, 15)
        : Math.random().toString(36).substring(2, 15)

      // 2. Llamar a Payphone /api/Sale PRIMERO (como anko)
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

      // 3. Si Payphone responde exitosamente, crear transacción+orden en el backend (como el link)
      setShowPhoneModal(false)
      setPhoneNumber('')
      sonnerResponse(
        'Solicitud de pago enviada. Revisa tu app de Payphone para confirmar el pago.',
        'success',
      )
      onSuccess?.()

      // 4. Crear transacción+orden en el backend DESPUÉS (opcional, no bloquea)
      try {
        if (orderId) {
          // Si hay orderId, solo regenerar la transacción
          await regenerateTransaction({
            orderId,
            paymentProvider: 'PAYPHONE',
            ...(isValidUUID(paymentMethodId) ? { paymentMethodId } : {}),
          })
        } else {
          // Si no hay orderId, crear transacción+orden
          await createTransactionAndOrder({
            addressId: addressId.trim(),
            clientTransactionId: transactionId,
            paymentProvider: 'PAYPHONE',
            ...(isValidUUID(paymentMethodId) ? { paymentMethodId } : {}),
          })
        }
      } catch (backendError) {
        // No bloquear si falla el backend, el pago ya fue enviado a Payphone
        console.error(
          'Error al crear transacción/orden en backend:',
          backendError,
        )
      }

      if (!orderId) {
        setTimeout(() => {
          navigate({ to: '/orders' })
        }, 1500)
      }
    } catch (e) {
      console.error('Error al procesar pago por teléfono:', e)
      // El error ya se maneja en la mutación con sonner
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleLinkPayment}
          disabled={disabled || isPendingLink}
          className="flex flex-col items-center justify-center p-6 bg-linear-to-br from-coffee-light to-coffee-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-coffee hover:shadow-coffee-md transition-all duration-200 border-2 border-coffee-medium"
        >
          <div className="text-2xl mb-2">🔗</div>
          <div className="text-base font-bold">
            {isPendingLink ? 'Procesando...' : 'Pagar con Link'}
          </div>
          <div className="text-xs mt-1 opacity-90">Página de pago dedicada</div>
        </button>
        <button
          onClick={() => setShowPhoneModal(true)}
          disabled={disabled}
          className="flex flex-col items-center justify-center p-6 bg-linear-to-br from-coffee-medium to-coffee-dark text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-coffee hover:shadow-coffee-md transition-all duration-200 border-2 border-coffee-dark"
        >
          <div className="text-2xl mb-2">📱</div>
          <div className="text-base font-bold">Pagar con Teléfono</div>
          <div className="text-xs mt-1 opacity-90">Notificación en la app</div>
        </button>
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <Phone className="text-coffee-medium" size={24} />
            <span className="text-coffee-darker font-bold">
              Pago por Teléfono
            </span>
          </div>
        }
        open={showPhoneModal}
        onCancel={() => {
          setShowPhoneModal(false)
          setPhoneNumber('')
        }}
        footer={null}
        width={500}
        className="phone-payment-modal"
      >
        <div className="space-y-4 mt-4">
          <div className="bg-linear-to-r from-coffee-light/20 to-coffee-medium/20 p-4 rounded-lg border-2 border-coffee-medium">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="text-coffee-medium shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <p className="text-coffee-darker font-semibold mb-1">
                  Notificación en tu app de Payphone
                </p>
                <p className="text-sm text-gray-700">
                  Recibirás una notificación en tu teléfono para confirmar el
                  pago. Una vez que completes el pago, tu orden será procesada
                  automáticamente.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-coffee-darker mb-2">
              Número de Teléfono
            </label>
            <Input
              size="large"
              placeholder="Ej: 0978852710 o 958852711"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={10}
              className="border-coffee-medium focus:border-coffee-dark"
              prefix={<Phone className="text-gray-400" size={18} />}
            />
            <p className="text-xs text-gray-500 mt-2">
              Ingresa tu número de teléfono (9-10 dígitos). Puede empezar con 0
              o sin 0. El código de país (593) se agregará automáticamente.
              {userInfo?.phoneNumber && (
                <span className="block mt-1 text-coffee-medium">
                  Tu número registrado: {userInfo.phoneNumber}
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => {
                setShowPhoneModal(false)
                setPhoneNumber('')
              }}
              disabled={isPendingPhone}
              className="flex-1"
              size="large"
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              onClick={handlePhonePayment}
              loading={isPendingPhone}
              className="flex-1 bg-gradient-coffee border-none hover:opacity-90"
              size="large"
            >
              {isPendingPhone ? 'Procesando...' : 'Confirmar Pago'}
            </Button>
          </div>
        </div>
      </Modal>

      <LinkPaymentConfirmationModal
        open={showLinkConfirmationModal}
        onCancel={() => setShowLinkConfirmationModal(false)}
        onConfirm={handleConfirmLinkPayment}
        total={amount}
        formatPrice={formatPrice}
        isLoading={isPendingLink}
      />
    </>
  )
}
