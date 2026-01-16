import { Button } from '@heroui/react'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface DeleteCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export const DeleteCategoryModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteCategoryModalProps) => {
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
      headerContent="Eliminar Categoría"
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
            Eliminar
          </Button>
        </div>
      }
    >
      <p className="text-gray-700">
        ¿Estás seguro de que deseas eliminar esta categoría? Esto también
        eliminará todas sus subcategorías y productos asociados. Esta acción no
        se puede deshacer.
      </p>
    </CustomModalNextUI>
  )
}
