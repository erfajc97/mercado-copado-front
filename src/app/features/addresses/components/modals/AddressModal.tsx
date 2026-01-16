import { FormAddresses } from '../FormAddresses'
import type { Form } from 'antd'
import type { Address, CreateAddressData } from '../../types'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  editingAddress: Address | null
  form: ReturnType<typeof Form.useForm<CreateAddressData>>[0]
  addresses: Array<Address> | undefined
  isLoading?: boolean
  onSave: (values: CreateAddressData) => Promise<void>
}

export function AddressModal({
  isOpen,
  onClose,
  editingAddress,
  form,
  addresses,
  isLoading = false,
  onSave,
}: AddressModalProps) {
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
      size="2xl"
      placement="center"
      headerContent={
        editingAddress ? 'Editar Dirección' : 'Agregar Nueva Dirección'
      }
    >
      <FormAddresses
        form={form}
        addresses={addresses}
        isLoading={isLoading}
        editingAddress={editingAddress}
        onFinish={onSave}
        onCancel={onClose}
      />
    </CustomModalNextUI>
  )
}
