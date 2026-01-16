import { useState } from 'react'
import { generateTransactionId } from '../shared/helpers/generateTransactionId'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'
import { useCashDepositMutation } from '@/app/features/payments/mutations/useCashDepositMutation'

interface UsePaymentRetryModalHookProps {
  orderId: string
  addressId: string
  onSuccess?: () => void
  onCancel: () => void
}

export const usePaymentRetryModalHook = ({
  orderId,
  addressId,
  onSuccess,
  onCancel,
}: UsePaymentRetryModalHookProps) => {
  const { mutateAsync: cashDeposit, isPending: isCashDepositPending } =
    useCashDepositMutation()

  const [activeTab, setActiveTab] = useState('payphone')
  const [depositImage, setDepositImage] = useState<File | null>(null)

  const handleSuccess = () => {
    onSuccess?.()
    onCancel()
    setDepositImage(null)
  }

  const handleCashDepositSubmit = async () => {
    if (!depositImage) {
      sonnerResponse(
        'Por favor, sube una imagen del comprobante de depósito',
        'error',
      )
      return
    }

    try {
      const randomIdClientTransaction = generateTransactionId()

      await cashDeposit({
        addressId,
        clientTransactionId: randomIdClientTransaction,
        depositImage,
        orderId,
      } as any)
      handleSuccess()
    } catch (error) {
      console.error('Error processing cash deposit:', error)
    }
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key)
  }

  return {
    activeTab,
    depositImage,
    setDepositImage,
    isCashDepositPending,
    handleSuccess,
    handleCashDepositSubmit,
    handleTabChange,
  }
}
