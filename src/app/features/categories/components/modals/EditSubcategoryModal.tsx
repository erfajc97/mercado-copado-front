import { Button } from '@heroui/react'
import { Input } from 'antd'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface EditSubcategoryModalProps {
  isOpen: boolean
  onClose: () => void
  subcategoryName: string
  onSubcategoryNameChange: (name: string) => void
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export const EditSubcategoryModal = ({
  isOpen,
  onClose,
  subcategoryName,
  onSubcategoryNameChange,
  onConfirm,
  isLoading = false,
}: EditSubcategoryModalProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
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
      headerContent="Editar Subcategoría"
      footerContent={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="light" onPress={onClose} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleConfirm}
            isLoading={isLoading}
            isDisabled={isLoading}
            className="bg-gradient-coffee border-none hover:opacity-90"
          >
            Actualizar
          </Button>
        </div>
      }
    >
      <div className="mt-4">
        <Input
          size="large"
          placeholder="Nombre de la subcategoría"
          value={subcategoryName}
          onChange={(e) => onSubcategoryNameChange(e.target.value)}
          onPressEnter={handleConfirm}
        />
      </div>
    </CustomModalNextUI>
  )
}
