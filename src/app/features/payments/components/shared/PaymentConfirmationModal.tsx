import { Button } from '@heroui/react'
import { AlertCircle, ShoppingCart } from 'lucide-react'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

export interface PaymentConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  total: number
  formatPrice: (price: number) => string
  isLoading?: boolean
  /** Título del modal. Default: "Confirmar Orden de Pago" */
  title?: string
  /** Pregunta principal. Default: "¿Estás seguro de crear esta orden?" */
  question?: string
  /** Descripción adicional */
  description?: string
  /** Texto del botón de confirmar. Default: "Confirmar y Pagar" */
  confirmButtonText?: string
  /** Texto del botón de confirmar mientras carga. Default: "Procesando..." */
  loadingButtonText?: string
}

/**
 * Modal genérico de confirmación de pago.
 * Reemplaza MercadoPagoPaymentModal y LinkPaymentConfirmationModal.
 */
export const PaymentConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  total,
  formatPrice,
  isLoading = false,
  title = 'Confirmar Orden de Pago',
  question = '¿Estás seguro de crear esta orden?',
  description = 'Una vez que completes el pago, tu orden será procesada automáticamente.',
  confirmButtonText = 'Confirmar y Pagar',
  loadingButtonText = 'Procesando...',
}: PaymentConfirmationModalProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose()
  }

  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable
      size="md"
      placement="center"
      headerContent={
        <div className="flex items-center gap-2">
          <AlertCircle className="text-coffee-medium" size={24} />
          <span className="text-coffee-darker font-bold">{title}</span>
        </div>
      }
      footerContent={
        <div className="flex gap-3 w-full">
          <Button
            variant="light"
            onPress={onClose}
            isDisabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleConfirm}
            isLoading={isLoading}
            isDisabled={isLoading}
            className="flex-1 bg-gradient-coffee border-none hover:opacity-90"
          >
            {isLoading ? loadingButtonText : confirmButtonText}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-linear-to-r from-coffee-light/20 to-coffee-medium/20 p-4 rounded-lg border-2 border-coffee-medium">
          <p className="text-coffee-darker font-semibold mb-2">{question}</p>
          <p className="text-sm text-gray-700">{description}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="text-coffee-medium" size={20} />
            <span className="font-semibold text-coffee-darker">
              Resumen de la Orden
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-gray-700 font-medium">Total a Pagar:</span>
            <span className="text-xl font-bold text-coffee-darker">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>
    </CustomModalNextUI>
  )
}

export default PaymentConfirmationModal
