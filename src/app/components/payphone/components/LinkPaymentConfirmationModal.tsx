import { Button, Modal } from 'antd'
import { AlertCircle, ShoppingCart } from 'lucide-react'

interface LinkPaymentConfirmationModalProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  total: number
  formatPrice: (price: number) => string
  isLoading?: boolean
}

export const LinkPaymentConfirmationModal = ({
  open,
  onCancel,
  onConfirm,
  total,
  formatPrice,
  isLoading = false,
}: LinkPaymentConfirmationModalProps) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <AlertCircle className="text-coffee-medium" size={24} />
          <span className="text-coffee-darker font-bold">
            Confirmar Orden de Pago
          </span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      className="link-payment-confirmation-modal"
    >
      <div className="space-y-4 mt-4">
        <div className="bg-linear-to-r from-coffee-light/20 to-coffee-medium/20 p-4 rounded-lg border-2 border-coffee-medium">
          <p className="text-coffee-darker font-semibold mb-2">
            ¿Estás seguro de crear esta orden?
          </p>
          <p className="text-sm text-gray-700">
            Estamos a espera de tu pago. Una vez que completes el pago en
            Payphone, tu orden será procesada automáticamente.
          </p>
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

        <div className="flex gap-3 pt-2">
          <Button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
            size="large"
          >
            Cancelar
          </Button>
          <Button
            type="primary"
            onClick={onConfirm}
            loading={isLoading}
            className="flex-1 bg-gradient-coffee border-none hover:opacity-90"
            size="large"
          >
            {isLoading ? 'Procesando...' : 'Confirmar y Pagar'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
