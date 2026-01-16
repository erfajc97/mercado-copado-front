import { Button } from '@heroui/react'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface DeleteAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export default function DeleteAddressModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteAddressModalProps) {
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
      headerContent="Eliminar Dirección"
      footerContent={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="light" onPress={onClose} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button
            color="danger"
            onPress={async () => {
              await onConfirm()
            }}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Sí, Eliminar
          </Button>
        </div>
      }
    >
      <p className="text-gray-700">
        ¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se
        puede deshacer.
      </p>
    </CustomModalNextUI>
  )
}
