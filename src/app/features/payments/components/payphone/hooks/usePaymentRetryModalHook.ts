import { useState } from 'react'
import { generateTransactionId } from '../shared/helpers/generateTransactionId'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'
import { useCashDepositMutation } from '@/app/features/payments/mutations/useCashDepositMutation'
import { useCryptoDepositMutation } from '@/app/features/payments/mutations/useCryptoDepositMutation'
import { useCurrency } from '@/app/hooks/useCurrency'

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
  const { mutateAsync: cryptoDeposit, isPending: isCryptoDepositPending } =
    useCryptoDepositMutation()
  const { isArgentina } = useCurrency()

  const [activeTab, setActiveTab] = useState('payphone')
  const [depositImage, setDepositImage] = useState<File | null>(null)
  const [cryptoDepositImage, setCryptoDepositImage] = useState<File | null>(
    null,
  )

  const handleSuccess = () => {
    onSuccess?.()
    onCancel()
    setDepositImage(null)
    setCryptoDepositImage(null)
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

  const handleCryptoDepositSubmit = async () => {
    if (!cryptoDepositImage) {
      sonnerResponse(
        'Por favor, sube una imagen del comprobante de transferencia crypto',
        'error',
      )
      return
    }

    try {
      const randomIdClientTransaction = generateTransactionId()

      await cryptoDeposit({
        addressId,
        clientTransactionId: randomIdClientTransaction,
        depositImage: cryptoDepositImage,
        orderId,
      } as any)
      handleSuccess()
    } catch (error) {
      console.error('Error processing crypto deposit:', error)
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
    // Crypto
    cryptoDepositImage,
    setCryptoDepositImage,
    isCryptoDepositPending,
    handleCryptoDepositSubmit,
    // MercadoPago visibility
    showMercadoPago: isArgentina,
  }
}
