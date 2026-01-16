import { Button, Input } from 'antd'
import { AlertCircle, Phone } from 'lucide-react'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface PhonePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: string
  setPhoneNumber: (value: string) => void
  userInfo?: { phoneNumber?: string }
  onConfirm: () => void
  isLoading?: boolean
}

export const PhonePaymentModal = ({
  isOpen,
  onClose,
  phoneNumber,
  setPhoneNumber,
  userInfo,
  onConfirm,
  isLoading = false,
}: PhonePaymentModalProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
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
          <Phone className="text-coffee-medium" size={24} />
          <span className="text-coffee-darker font-bold">
            Pago por Teléfono
          </span>
        </div>
      }
      footerContent={
        <div className="flex gap-3 w-full">
          <Button
            onClick={onClose}
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
            {isLoading ? 'Procesando...' : 'Confirmar Pago'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
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
            Ingresa tu número de teléfono (9-10 dígitos). Puede empezar con 0 o
            sin 0. El código de país (593) se agregará automáticamente.
            {userInfo?.phoneNumber && (
              <span className="block mt-1 text-coffee-medium">
                Tu número registrado: {userInfo.phoneNumber}
              </span>
            )}
          </p>
        </div>
      </div>
    </CustomModalNextUI>
  )
}
