import { Modal } from 'antd'
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { useCreateCategoryMutation } from '@/app/features/categories/mutations/useCategoryMutations'
import { useCreateSubcategoryMutation } from '@/app/features/categories/mutations/useCreateSubcategoryMutation'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateCategoryModal({
  isOpen,
  onClose,
}: CreateCategoryModalProps) {
  const [form] = Form.useForm()
  const { mutateAsync: createCategory, isPending: isCreatingCategory } =
    useCreateCategoryMutation()
  const { mutateAsync: createSubcategory } = useCreateSubcategoryMutation()
  const [subcategories, setSubcategories] = useState<Array<string>>([''])

  const handleSubmit = async (values: any) => {
    try {
      // Crear la categoría primero
      const category = await createCategory(values.name)

      // Crear las subcategorías si existen
      const subcategoryNames = values.subcategories?.filter(
        (name: string) => name && name.trim() !== '',
      )

      if (subcategoryNames && subcategoryNames.length > 0) {
        await Promise.all(
          subcategoryNames.map((name: string) =>
            createSubcategory({ name: name.trim(), categoryId: category.id }),
          ),
        )
      }

      form.resetFields()
      setSubcategories([''])
      sonnerResponse('Categoría creada exitosamente', 'success')
      onClose()
    } catch (error) {
      console.error('Error creating category:', error)
      sonnerResponse('Error al crear la categoría', 'error')
    }
  }

  const addSubcategory = () => {
    setSubcategories([...subcategories, ''])
  }

  const removeSubcategory = (index: number) => {
    if (subcategories.length > 1) {
      setSubcategories(subcategories.filter((_, i) => i !== index))
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setSubcategories([''])
    onClose()
  }

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      styles={{
        body: {
          borderRadius: '12px',
        },
      }}
    >
      <div className="py-4">
        <h2 className="text-2xl font-bold text-coffee-darker mb-6 text-center">
          Nueva Categoría
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
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
              loading={isCreatingCategory}
              className="flex-1 bg-gradient-coffee border-none hover:opacity-90"
            >
              Crear Categoría
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

