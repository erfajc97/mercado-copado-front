import { useEffect } from 'react'
import { Button } from '@heroui/react'
import { Form, Input } from 'antd'
import { useEditCategoryModalHook } from '../../hooks/useEditCategoryModalHook'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface Category {
  id: string
  name: string
  subcategories?: Array<{ id: string; name: string }>
}

interface EditCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: Category | null
}

export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
}: EditCategoryModalProps) {
  const [form] = Form.useForm()
  const {
    newSubcategories,
    handleSubmit,
    addSubcategory,
    removeSubcategory,
    resetForm,
    isPending,
  } = useEditCategoryModalHook()

  useEffect(() => {
    if (category) {
      form.setFieldsValue({ name: category.name })
      resetForm()
    }
  }, [category, form, resetForm])

  const handleFormSubmit = async (values: any) => {
    const success = await handleSubmit(values, category)
    if (success) {
      handleCancel()
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

  if (!category) return null

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable
      size="2xl"
      placement="center"
      headerContent="Editar Categoría"
      footerContent={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="light" onPress={handleCancel} isDisabled={isPending}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={() => form.submit()}
            isLoading={isPending}
            isDisabled={isPending}
            className="bg-gradient-coffee border-none hover:opacity-90"
          >
            Actualizar Categoría
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        className="space-y-4 mt-4"
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

        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              Subcategorías Existentes
            </label>
            <div className="space-y-2">
              {category.subcategories.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-gray-50 p-2 rounded border border-gray-200"
                >
                  {sub.name}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">
              Agregar Nuevas Subcategorías
            </label>
            <Button variant="flat" size="sm" onPress={addSubcategory}>
              + Agregar Subcategoría
            </Button>
          </div>
          {newSubcategories.map((_, index) => (
            <Form.Item
              key={index}
              name={['newSubcategories', index]}
              rules={[
                { required: true, message: 'Por favor ingresa el nombre' },
              ]}
            >
              <div className="flex gap-2">
                <Input
                  size="large"
                  placeholder={`Nueva subcategoría ${index + 1}`}
                />
                {newSubcategories.length > 1 && (
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => removeSubcategory(index)}
                    size="lg"
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </Form.Item>
          ))}
        </div>
      </Form>
    </CustomModalNextUI>
  )
}
