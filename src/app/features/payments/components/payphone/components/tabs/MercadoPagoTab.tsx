import { useState } from 'react'
import { Button } from '@heroui/react'
import { ExternalLink, Shield } from 'lucide-react'
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

  if (!isArgentina) {
    return (
      <div className="py-4 text-center text-gray-500">
        <p>Mercado Pago solo está disponible para Argentina.</p>
      </div>
    )
  }

  return (
    <div className="py-4 space-y-4">
      {/* Card con info de pago */}
      <div className="bg-linear-to-br from-sky-50 to-cyan-50 border border-sky-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total a pagar</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(orderAmount)}
            </p>
          </div>
          <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
            <img
              src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/6.6.73/mercadopago/logo__large@2x.png"
              alt="Mercado Pago"
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Boton de pago */}
      <Button
        size="lg"
        onPress={handlePayWithMercadoPago}
        isLoading={isPending || isProcessing}
        isDisabled={isPending || isProcessing}
        className="w-full bg-[#00b1ea] hover:bg-[#009ed6] text-white font-semibold"
        startContent={
          !isPending && !isProcessing ? <ExternalLink size={18} /> : null
        }
      >
        {isPending || isProcessing ? 'Generando enlace...' : 'Pagar ahora'}
      </Button>

      {/* Info de seguridad */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Shield size={14} />
        <span>Pago seguro con Mercado Pago</span>
      </div>
    </div>
  )
}
