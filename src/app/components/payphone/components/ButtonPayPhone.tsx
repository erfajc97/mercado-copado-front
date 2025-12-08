import { useState } from 'react'
import { Button, Input, Modal } from 'antd'
import {
  useLinkPayphoneMutation,
  usePhonePayphoneMutation,
} from '../mutations/usePayPhoneMutation'
import { useCreatePaymentTransactionMutation } from '@/app/features/payments/mutations/usePaymentMutations'

interface ButtonPayPhoneProps {
  amount: number
  orderId: string
  onSuccess?: () => void
  disabled?: boolean
}

export const ButtonPayPhone = ({
  amount,
  orderId,
  onSuccess,
  disabled,
}: ButtonPayPhoneProps) => {
  const { mutateAsync: linkPayphone, isPending } = useLinkPayphoneMutation()
  const {
    mutateAsync: createTransaction,
    isPending: isPendingCreateTransaction,
  } = useCreatePaymentTransactionMutation()
  const { mutateAsync: phonePayphone, isPending: isPendingPhonePayment } =
    usePhonePayphoneMutation()
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleLinkPayment = async () => {
    const ua = navigator.userAgent
    const isSafari =
      /Safari/.test(ua) &&
      !/Chrome/.test(ua) &&
      !/CriOS/.test(ua) &&
      !/FxiOS/.test(ua) &&
      !/EdgiOS/.test(ua)
    if (isSafari) {
      alert(
        'No es posible generar links de pago en Safari. Por favor, utiliza Google Chrome u otro navegador compatible.',
      )
      return
    }
    try {
      const randomIdClientTransaction = Math.random()
        .toString(36)
        .substring(2, 15)

      const bodyPayphone = {
        clientTransactionId: randomIdClientTransaction,
        reference: 'Compra en Mercado Copado',
        amount: amount * 100,
        responseUrl: `${import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/pay-response`,
        amountWithoutTax: amount * 100,
        storeId: import.meta.env.VITE_STORE_ID,
      }

      const bodyTransaction = {
        orderId: orderId,
        clientTransactionId: randomIdClientTransaction,
      }

      const response = await linkPayphone(bodyPayphone)
      if (typeof response === 'object' && response.paymentId) {
        window.open(response.payWithCard, '_blank', 'noopener')
        await createTransaction(bodyTransaction)
        onSuccess?.()
      }
    } catch (e) {
      console.error('Failed to create payment:', e)
      alert('Error al procesar el pago. Por favor, intenta nuevamente.')
    }
  }

  const handlePhonePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      alert('Por favor ingresa un número de teléfono válido')
      return
    }

    // Validar formato de teléfono (debe incluir código de país)
    const phoneRegex = /^[0-9]{8,15}$/
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      alert(
        'Por favor ingresa un número de teléfono válido (8-15 dígitos, incluyendo código de país)',
      )
      return
    }

    try {
      const randomIdClientTransaction = Math.random()
        .toString(36)
        .substring(2, 15)

      // Crear la transacción primero
      await createTransaction({
        orderId: orderId,
        clientTransactionId: randomIdClientTransaction,
      })

      // Procesar el pago por teléfono
      await phonePayphone({
        orderId: orderId,
        phoneNumber: phoneNumber.replace(/\s+/g, ''),
        clientTransactionId: randomIdClientTransaction,
      })

      setShowPhoneModal(false)
      setPhoneNumber('')
      onSuccess?.()
    } catch (e) {
      console.error('Failed to create phone payment:', e)
      // El error ya se maneja en la mutación con sonner
    }
  }

  return (
    <>
      <div className="space-y-3">
        <button
          onClick={handleLinkPayment}
          disabled={disabled || isPending || isPendingCreateTransaction}
          className="w-full bg-gradient-coffee text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-coffee hover:shadow-coffee-md transition-all duration-200"
        >
          {isPending || isPendingCreateTransaction
            ? 'Procesando...'
            : 'Pagar con Link de Pago'}
        </button>
        <button
          onClick={() => setShowPhoneModal(true)}
          disabled={disabled}
          className="w-full bg-coffee-medium text-white py-3 rounded-lg hover:bg-coffee-dark disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-coffee hover:shadow-coffee-md transition-all duration-200"
        >
          Pagar con Número de Teléfono
        </button>
      </div>

      <Modal
        title="Pago por Teléfono"
        open={showPhoneModal}
        onCancel={() => {
          setShowPhoneModal(false)
          setPhoneNumber('')
        }}
        footer={null}
      >
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Número de Teléfono
            </label>
            <Input
              size="large"
              placeholder="Ej: 50371234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Ingresa tu número de teléfono (incluyendo código de país)
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setShowPhoneModal(false)}>Cancelar</Button>
            <Button
              type="primary"
              onClick={handlePhonePayment}
              loading={isPendingPhonePayment || isPendingCreateTransaction}
              className="bg-gradient-coffee border-none hover:opacity-90"
            >
              {isPendingPhonePayment || isPendingCreateTransaction
                ? 'Procesando...'
                : 'Confirmar Pago'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
