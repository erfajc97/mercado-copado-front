import { useState } from 'react'
import { Button } from '@heroui/react'
import { CreditCard, ExternalLink } from 'lucide-react'
import { useRegenerateTransactionMutation } from '@/app/features/payments/mutations/useRegenerateTransactionMutation'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'
import { useCurrency } from '@/app/hooks/useCurrency'

interface MercadoPagoTabProps {
  orderId: string
  orderAmount: number
  onSuccess?: () => void
}

export const MercadoPagoTab = ({
  orderId,
  orderAmount,
  onSuccess,
}: MercadoPagoTabProps) => {
  const { isArgentina, formatPrice } = useCurrency()
  const { mutateAsync: regenerateTransaction, isPending } =
    useRegenerateTransactionMutation()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayWithMercadoPago = async () => {
    if (!orderId || isProcessing) return

    setIsProcessing(true)
    try {
      const response = await regenerateTransaction({
        orderId,
        paymentProvider: 'MERCADOPAGO',
      })

      // Extract initPoint from the response
      const initPoint =
        response?.content?.initPoint ||
        response?.initPoint ||
        response?.transaction?.payphoneData?.initPoint

      if (initPoint) {
        onSuccess?.()
        window.location.href = initPoint
      } else {
        sonnerResponse(
          'No se pudo obtener el enlace de pago de Mercado Pago',
          'error',
        )
      }
    } catch (error) {
      console.error('Error generating Mercado Pago link:', error)
      sonnerResponse('Error al generar el enlace de Mercado Pago', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Solo mostrar para usuarios de Argentina
  if (!isArgentina) {
    return (
      <div className="py-4 text-center text-gray-500">
        <p>Mercado Pago solo está disponible para Argentina.</p>
      </div>
    )
  }

  return (
    <div className="py-4 space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-full mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-coffee-darker mb-2">
          Pagar con Mercado Pago
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Serás redirigido a Mercado Pago para completar el pago de forma
          segura.
        </p>
        <p className="text-lg font-bold text-green-600">
          {formatPrice(orderAmount)}
        </p>
      </div>

      <Button
        color="primary"
        size="lg"
        onPress={handlePayWithMercadoPago}
        isLoading={isPending || isProcessing}
        isDisabled={isPending || isProcessing}
        className="w-full bg-blue-500 hover:bg-blue-600"
        startContent={
          !isPending && !isProcessing ? <ExternalLink size={18} /> : null
        }
      >
        {isPending || isProcessing
          ? 'Generando enlace...'
          : 'Pagar con Mercado Pago'}
      </Button>
    </div>
  )
}
