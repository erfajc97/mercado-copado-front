import { useState } from 'react'
import { Button, Input, Modal } from 'antd'
import {
  useLinkPayphoneMutation,
  usePhonePayphoneMutation,
} from '../mutations/usePayPhoneMutation'
import { useCreateOrderFromTransactionMutation } from '@/app/features/payments/mutations/useCreateOrderFromTransactionMutation'
import { useCreatePaymentTransactionWithoutOrderMutation } from '@/app/features/payments/mutations/useCreatePaymentTransactionWithoutOrderMutation'
import { LinkPaymentConfirmationModal } from './LinkPaymentConfirmationModal'
import { useCurrency } from '@/app/hooks/useCurrency'

interface ButtonPayPhoneProps {
  amount: number
  addressId: string
  paymentMethodId: string
  clientTransactionId?: string
  onSuccess?: () => void
  disabled?: boolean
}

export const ButtonPayPhone = ({
  amount,
  addressId,
  paymentMethodId,
  clientTransactionId: propClientTransactionId,
  onSuccess,
  disabled,
}: ButtonPayPhoneProps) => {
  const { mutateAsync: linkPayphone, isPending } = useLinkPayphoneMutation()
  const { mutateAsync: phonePayphone, isPending: isPendingPhonePayment } =
    usePhonePayphoneMutation()
  const { mutateAsync: createOrderFromTransaction, isPending: isCreatingOrder } =
    useCreateOrderFromTransactionMutation()
  const { mutateAsync: createPaymentTransactionWithoutOrder, isPending: isCreatingTransaction } =
    useCreatePaymentTransactionWithoutOrderMutation()
  const { formatPrice } = useCurrency()
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [showLinkConfirmationModal, setShowLinkConfirmationModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [clientTransactionId, setClientTransactionId] = useState<string | null>(
    propClientTransactionId || null,
  )

  // Función para crear la transacción si no existe
  const ensureTransaction = async (): Promise<string> => {
    if (clientTransactionId) {
      return clientTransactionId
    }

    const randomIdClientTransaction = Math.random()
      .toString(36)
      .substring(2, 15)

    await createPaymentTransactionWithoutOrder({
      addressId,
      clientTransactionId: randomIdClientTransaction,
      paymentProvider: 'PAYPHONE',
    })

    setClientTransactionId(randomIdClientTransaction)
    return randomIdClientTransaction
  }

  const handleLinkPayment = async () => {
    // Mostrar modal de confirmación primero
    setShowLinkConfirmationModal(true)
  }

  const handleConfirmLinkPayment = async () => {
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
      setShowLinkConfirmationModal(false)
      return
    }

    // Validar que el amount sea válido
    if (!amount || amount <= 0 || isNaN(amount)) {
      alert('Error: El monto de la transacción no es válido')
      console.error('Invalid amount:', amount)
      setShowLinkConfirmationModal(false)
      return
    }

    try {
      // Asegurar que existe la transacción
      const transactionId = await ensureTransaction()

      // Crear la orden en estado pending antes de generar el link
      await createOrderFromTransaction({
        clientTransactionId: transactionId,
        initialStatus: 'pending',
      })

      // Generar el link de pago
      const amountInCents = Math.round(amount * 100)
      const bodyPayphone = {
        clientTransactionId: transactionId,
        reference: 'Compra en Mercado Copado',
        amount: amountInCents,
        responseUrl: `${import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/pay-response?id=${transactionId}&clientTransactionId=${transactionId}`,
        amountWithoutTax: amountInCents,
        storeId: import.meta.env.VITE_STORE_ID,
      }

      const response = await linkPayphone(bodyPayphone)
      if (typeof response === 'object' && response.paymentId) {
        setShowLinkConfirmationModal(false)
        window.open(response.payWithCard, '_blank', 'noopener')
        onSuccess?.()
      }
    } catch (e) {
      console.error('Failed to create payment:', e)
      setShowLinkConfirmationModal(false)
      alert('Error al procesar el pago. Por favor, intenta nuevamente.')
    }
  }

  const handlePhonePayment = async () => {
    const cleanPhoneNumber = phoneNumber.replace(/\s+/g, '')
    
    if (!cleanPhoneNumber || cleanPhoneNumber.length < 8) {
      alert('Por favor ingresa un número de teléfono válido')
      return
    }

    // Validar formato de teléfono (solo números, 8-15 dígitos)
    // El código de país es opcional según la documentación de Payphone
    const phoneRegex = /^[0-9]{8,15}$/
    if (!phoneRegex.test(cleanPhoneNumber)) {
      alert(
        'Por favor ingresa un número de teléfono válido (8-15 dígitos numéricos)',
      )
      return
    }

    try {
      // Asegurar que existe la transacción
      const transactionId = await ensureTransaction()

      // Procesar el pago por teléfono (esto creará la orden en estado processing automáticamente en el backend)
      await phonePayphone({
        addressId,
        paymentMethodId,
        phoneNumber: cleanPhoneNumber,
        clientTransactionId: transactionId,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleLinkPayment}
          disabled={disabled || isPending || isCreatingOrder || isCreatingTransaction}
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-coffee-light to-coffee-medium text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-coffee hover:shadow-coffee-md transition-all duration-200 border-2 border-coffee-medium"
        >
          <div className="text-2xl mb-2">🔗</div>
          <div className="text-base font-bold">
            {isPending || isCreatingOrder || isCreatingTransaction ? 'Procesando...' : 'Pagar con Link'}
          </div>
          <div className="text-xs mt-1 opacity-90">
            Abre en nueva ventana
          </div>
        </button>
        <button
          onClick={() => setShowPhoneModal(true)}
          disabled={disabled}
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-coffee-medium to-coffee-dark text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-coffee hover:shadow-coffee-md transition-all duration-200 border-2 border-coffee-dark"
        >
          <div className="text-2xl mb-2">📱</div>
          <div className="text-base font-bold">
            Pagar con Teléfono
          </div>
          <div className="text-xs mt-1 opacity-90">
            Notificación en la app
          </div>
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
              placeholder="Ej: 71234567 o 50371234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={15}
            />
            <p className="text-xs text-gray-500 mt-1">
              Ingresa tu número de teléfono (8-15 dígitos). El código de país es opcional.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setShowPhoneModal(false)}>Cancelar</Button>
            <Button
              type="primary"
              onClick={handlePhonePayment}
              loading={isPendingPhonePayment}
              className="bg-gradient-coffee border-none hover:opacity-90"
            >
              {isPendingPhonePayment ? 'Procesando...' : 'Confirmar Pago'}
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
        isLoading={isPending || isCreatingOrder || isCreatingTransaction}
      />
    </>
  )
}
