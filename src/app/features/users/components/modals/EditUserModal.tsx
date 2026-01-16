import { Button } from '@heroui/react'
import { Form, Input, Select } from 'antd'
import { COUNTRIES } from '@/app/constants/countries'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  form: ReturnType<typeof Form.useForm<any>>[0]
  isLoading?: boolean
}

export const EditUserModal = ({
  isOpen,
  onClose,
  onConfirm,
  form,
  isLoading = false,
}: EditUserModalProps) => {
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
      headerContent="Editar Usuario"
      footerContent={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="light" onPress={onClose} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={async () => {
              await onConfirm()
            }}
            isLoading={isLoading}
            isDisabled={isLoading}
            className="bg-gradient-coffee border-none hover:opacity-90"
          >
            Guardar
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" className="mt-4">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <Form.Item
            label="Nombre"
            name="firstName"
            rules={[
              { required: true, message: 'El nombre es requerido' },
              {
                min: 2,
                message: 'El nombre debe tener al menos 2 caracteres',
              },
            ]}
          >
            <Input placeholder="Nombre" />
          </Form.Item>

          <Form.Item label="Apellido" name="lastName">
            <Input placeholder="Apellido" />
          </Form.Item>
        </div>

        <div className="mb-3">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'El email es requerido' },
              { type: 'email', message: 'Debe ser un email válido' },
            ]}
          >
            <Input placeholder="email@ejemplo.com" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <Form.Item
            label="Documento"
            name="documentId"
            rules={[
              {
                pattern: /^[0-9A-Za-z-]+$/,
                message: 'Solo números, letras y guiones',
              },
            ]}
          >
            <Input placeholder="Documento de identidad" />
          </Form.Item>

          <Form.Item label="Teléfono" name="phoneNumber">
            <Input placeholder="Teléfono" />
          </Form.Item>
        </div>

        <div className="mb-3">
          <Form.Item label="País" name="country">
            <Select
              placeholder="Seleccionar país"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={COUNTRIES}
            />
          </Form.Item>
        </div>
      </Form>
    </CustomModalNextUI>
  )
}
