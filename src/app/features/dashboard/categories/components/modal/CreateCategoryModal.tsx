import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { useCreateCategoryModalHook } from '../../hooks/useCreateCategoryModalHook'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateCategoryModal({
  isOpen,
  onClose,
}: CreateCategoryModalProps) {
  const [form] = Form.useForm()
  const {
    subcategories,
    handleSubmit,
    addSubcategory,
    removeSubcategory,
    resetForm,
    isPending,
  } = useCreateCategoryModalHook()

  const handleFormSubmit = async (values: any) => {
    const success = await handleSubmit(values)
    if (success) {
      form.resetFields()
      resetForm()
      onClose()
    }
  }

  const handleCancel = () => {
    form.resetFields()
    resetForm()
    onClose()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel()
    }
  }

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable
      size="2xl"
      placement="center"
      headerContent="Nueva Categoría"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        className="space-y-4"
      >
        <Form.Item
          name="name"
          label="Nombre de la Categoría"
          rules={[
            {
              required: true,
              message: 'Por favor ingresa el nombre de la categoría',
            },
          ]}
        >
          <Input size="large" placeholder="Ej: Electrónica" />
        </Form.Item>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Subcategorías</label>
            <Button type="dashed" onClick={addSubcategory} size="small">
              + Agregar Subcategoría
            </Button>
          </div>
          {subcategories.map((_, index) => (
            <Form.Item
              key={index}
              name={['subcategories', index]}
              rules={[
                { required: true, message: 'Por favor ingresa el nombre' },
              ]}
            >
              <div className="flex gap-2">
                <Input
                  size="large"
                  placeholder={`Subcategoría ${index + 1}`}
                />
                {subcategories.length > 1 && (
                  <Button
                    danger
                    onClick={() => removeSubcategory(index)}
                    size="large"
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </Form.Item>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleCancel} className="flex-1">
            Cancelar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            className="flex-1 bg-gradient-coffee border-none hover:opacity-90"
          >
            Crear Categoría
          </Button>
        </div>
      </Form>
    </CustomModalNextUI>
  )
}
