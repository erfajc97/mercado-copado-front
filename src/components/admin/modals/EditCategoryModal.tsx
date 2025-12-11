import { Modal } from 'antd'
import { useState, useEffect } from 'react'
import { Button, Form, Input } from 'antd'
import { useUpdateCategoryMutation } from '@/app/features/categories/mutations/useCategoryMutations'
import { useCreateSubcategoryMutation } from '@/app/features/categories/mutations/useCreateSubcategoryMutation'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface EditCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: {
    id: string
    name: string
    subcategories?: Array<{ id: string; name: string }>
  } | null
}

export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
}: EditCategoryModalProps) {
  const [form] = Form.useForm()
  const { mutateAsync: updateCategory, isPending: isUpdatingCategory } =
    useUpdateCategoryMutation()
  const { mutateAsync: createSubcategory } = useCreateSubcategoryMutation()
  const [newSubcategories, setNewSubcategories] = useState<Array<string>>([''])

  useEffect(() => {
    if (category) {
      form.setFieldsValue({ name: category.name })
      setNewSubcategories([''])
    }
  }, [category, form])

  const handleSubmit = async (values: any) => {
    if (!category) return

    try {
      // Actualizar el nombre de la categoría
      await updateCategory({
        categoryId: category.id,
        name: values.name.trim(),
      })

      // Crear las nuevas subcategorías si existen
      const subcategoryNames = values.newSubcategories?.filter(
        (name: string) => name && name.trim() !== '',
      )

      if (subcategoryNames && subcategoryNames.length > 0) {
        await Promise.all(
          subcategoryNames.map((name: string) =>
            createSubcategory({
              name: name.trim(),
              categoryId: category.id,
            }),
          ),
        )
      }

      form.resetFields()
      setNewSubcategories([''])
      sonnerResponse('Categoría actualizada exitosamente', 'success')
      onClose()
    } catch (error) {
      console.error('Error updating category:', error)
      sonnerResponse('Error al actualizar la categoría', 'error')
    }
  }

  const addSubcategory = () => {
    setNewSubcategories([...newSubcategories, ''])
  }

  const removeSubcategory = (index: number) => {
    if (newSubcategories.length > 1) {
      setNewSubcategories(newSubcategories.filter((_, i) => i !== index))
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setNewSubcategories([''])
    onClose()
  }

  if (!category) return null

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
          Editar Categoría
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
              <Button type="dashed" onClick={addSubcategory} size="small">
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
              loading={isUpdatingCategory}
              className="flex-1 bg-gradient-coffee border-none hover:opacity-90"
            >
              Actualizar Categoría
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

