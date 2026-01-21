import { useState } from 'react'
import { generateTransactionId } from '@/app/features/payments/components/payphone/shared/helpers/generateTransactionId'
import { useCreateTransactionAndOrderMutation } from '@/app/features/payments/mutations/useCreateTransactionAndOrderMutation'
import { useCartSyncContext } from '@/app/features/cart/context/CartSyncContext'

interface UseMercadoPagoButtonHookProps {
  amount: number
  addressId: string
  clientTransactionId?: string
  onSuccess?: () => void
  orderId?: string
}

export const useMercadoPagoButtonHook = ({
  amount,
  addressId,
  clientTransactionId: propClientTransactionId,
  onSuccess,
}: UseMercadoPagoButtonHookProps) => {
  const { syncAndWait } = useCartSyncContext()
  const { mutateAsync: createTransactionAndOrder, isPending } =
    useCreateTransactionAndOrderMutation()

  const [showModal, setShowModal] = useState(false)

  const handleOpenModal = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)

  const handlePay = async () => {
    if (!amount || amount <= 0 || isNaN(amount)) return
    if (!addressId.trim()) return

    if (syncAndWait) await syncAndWait()

    const clientTransactionId = propClientTransactionId || generateTransactionId()

    try {
      const data = await createTransactionAndOrder({
        addressId: addressId.trim(),
        clientTransactionId,
        paymentProvider: 'MERCADOPAGO',
      })

      const initPoint =
        (data as { content?: { initPoint?: string }; initPoint?: string })
          .content?.initPoint ??
        (data as { initPoint?: string }).initPoint

      if (initPoint) {
        setShowModal(false)
        onSuccess?.()
        window.location.href = initPoint
      }
    } catch {
      setShowModal(false)
    }
  }

  return {
    showModal,
    setShowModal,
    isPending,
    handleOpenModal,
    handleCloseModal,
    handlePay,
  }
}
